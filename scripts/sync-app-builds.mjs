// Copies the newest release APKs from the sibling Flutter app repos into
// `public/` and records what was published, so the download pages and the
// in-app update check both point at the same build.
//
//   public/app-releases.json  - release manifest fetched by the mobile apps
//   src/lib/app-releases.json - version labels rendered on the download pages
//
// Usage:
//   npm run apps:sync
//
// The app repos are expected as siblings of this webapp (…/kiddo-child-app,
// …/kiddo-parent-app). Override with KIDDO_CHILD_APP_DIR / KIDDO_PARENT_APP_DIR.
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const webappRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reposRoot = path.resolve(webappRoot, "..");
const FALLBACK_SITE_URL = "https://kiddoapp.in";

/** Minimal `.env*` reader so the script sees the same NEXT_PUBLIC_* values as the build. */
function readEnvFiles() {
  const values = {};

  for (const file of [".env", ".env.production", ".env.local"]) {
    const fullPath = path.join(webappRoot, file);
    if (!existsSync(fullPath)) continue;

    for (const line of readFileSync(fullPath, "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (match && !line.trim().startsWith("#")) {
        values[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  }

  return { ...values, ...process.env };
}

const env = readEnvFiles();
const siteUrl = (env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL).replace(/\/+$/, "");

const APPS = [
  {
    key: "child",
    label: "Child App",
    repoDir: env.KIDDO_CHILD_APP_DIR ?? path.join(reposRoot, "kiddo-child-app"),
    publicFile: "kiddo-child-app.apk",
    urlOverride: env.NEXT_PUBLIC_CHILD_APP_APK_URL,
  },
  {
    key: "parent",
    label: "Parent App",
    repoDir: env.KIDDO_PARENT_APP_DIR ?? path.join(reposRoot, "kiddo-parent-app"),
    publicFile: "kiddo-parent-app.apk",
    urlOverride: env.NEXT_PUBLIC_PARENT_APP_APK_URL,
  },
];

function readPubspecVersion(repoDir) {
  const pubspec = path.join(repoDir, "pubspec.yaml");
  if (!existsSync(pubspec)) return { version: "1.0.0", buildNumber: 0 };

  const match = readFileSync(pubspec, "utf8").match(/^version:\s*(\S+)/m);
  if (!match) return { version: "1.0.0", buildNumber: 0 };

  const [version, buildNumber = "0"] = match[1].split("+");
  return { version, buildNumber: Number.parseInt(buildNumber, 10) || 0 };
}

function downloadUrlFor(app) {
  const override = app.urlOverride;
  if (override && /^https?:\/\//i.test(override)) return override;
  return `${siteUrl}/${app.publicFile}`;
}

const releases = {};
const manifestApps = {};
const skipped = [];

for (const app of APPS) {
  const apk = path.join(app.repoDir, "build", "app", "outputs", "flutter-apk", "app-release.apk");

  if (!existsSync(apk)) {
    skipped.push({ app, apk });
    continue;
  }

  const { version, buildNumber } = readPubspecVersion(app.repoDir);
  const { size, mtime } = statSync(apk);
  const buildDate = mtime.toISOString().slice(0, 10);
  const target = path.join(webappRoot, "public", app.publicFile);

  mkdirSync(path.dirname(target), { recursive: true });
  copyFileSync(apk, target);

  releases[app.key] = {
    label: app.label,
    version,
    buildNumber,
    buildDate,
    sizeBytes: size,
    publicFile: app.publicFile,
  };

  manifestApps[app.key] = {
    label: app.label,
    version,
    buildNumber,
    buildDate,
    sizeBytes: size,
    downloadUrl: downloadUrlFor(app),
    forceUpdate: false,
  };

  console.log(
    `✔ ${app.label} v${version}+${buildNumber} (${(size / 1024 / 1024).toFixed(1)} MB) → public/${app.publicFile}`,
  );
}

if (skipped.length > 0) {
  for (const { app, apk } of skipped) {
    console.error(`✖ ${app.label}: release APK not found at ${apk}`);
    console.error(`  Run "flutter build apk --release" in ${app.repoDir} first.`);
  }
  process.exit(1);
}

const uiTarget = path.join(webappRoot, "src", "lib", "app-releases.json");
writeFileSync(uiTarget, `${JSON.stringify(releases, null, 2)}\n`);
console.log("✔ Wrote src/lib/app-releases.json (download page labels)");

const manifestTarget = path.join(webappRoot, "public", "app-releases.json");
writeFileSync(
  manifestTarget,
  `${JSON.stringify({ generatedAt: new Date().toISOString(), apps: manifestApps }, null, 2)}\n`,
);
console.log(`✔ Wrote public/app-releases.json (in-app update manifest → ${siteUrl}/app-releases.json)`);
