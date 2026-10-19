# App releases (APKs + in-app updates)

How a new child/parent build reaches the website and the installed apps.

## Pieces

| Where | What |
| --- | --- |
| `kiddo-child-app`, `kiddo-parent-app` | Flutter apps; `version:` in `pubspec.yaml` is the published version |
| `scripts/sync-app-builds.mjs` (`npm run apps:sync`) | Copies the newest release APKs into `public/` and writes the two release files below |
| `public/app-releases.json` | Release manifest fetched by the installed apps (`https://kiddoapp.in/app-releases.json`) |
| `src/lib/app-releases.json` | Same data shaped for the download pages (`/download`, `ChildSection`, `ParentSection`) |
| `public/kiddo-child-app.apk`, `public/kiddo-parent-app.apk` | The files users download |

## Signing (one-time setup — never lose these files)

Android only installs an update that is signed with the same key as the installed app, so
both apps are signed with the shared KidDo release keystore:

| Where | What |
| --- | --- |
| `*/android/kiddo-release.jks` | The keystore (identical file in both app repos, gitignored) |
| `*/android/key.properties` | Passwords + alias read by the Gradle build (gitignored; template in `android/key.properties.example`) |

- **Back up** the `.jks` file and its passwords (password manager / vault). If they are
  lost, no future in-app update can be installed over the existing app.
- `flutter build apk --release` uses the keystore automatically when
  `android/key.properties` exists; without it the release build falls back to debug
  signing (local builds keep working, but those APKs cannot update release-signed
  installs).
- Verify on a new machine with
  `android\gradlew.bat -p android :app:signingReport` — the `release` variant must show
  `android/kiddo-release.jks` with alias `kiddo`.

### One-time migration for builds up to v1.0.1

Those builds were signed with the debug keystore, so a release-signed APK cannot install
on top of them ("App not installed"). Testers must uninstall once and install v1.0.2
fresh; after that, in-app updates work normally.

## Shipping a new build

```bash
# 0. One-time per machine: copy android/key.properties.example -> android/key.properties
#    and restore kiddo-release.jks from the vault (both app repos).

# 1. Bump the version in each app you are shipping (this is what devices compare)
#    kiddo-child-app/pubspec.yaml:  version: 1.0.1+2   ->  version: 1.0.2+3

# 2. Build the release APKs
cd ../kiddo-child-app  && flutter build apk --release
cd ../kiddo-parent-app && flutter build apk --release

# 3. Publish into the web app (APKs + both release files)
cd ../kiddo-webapp && npm run apps:sync

# 4. Commit + push; CI runs lint/typecheck/test/build, then deploy
git add public src/lib/app-releases.json && git commit -m "release: v1.0.2 builds"
```

The install directory layout is `exported_repos/{kiddo-webapp,kiddo-child-app,kiddo-parent-app}`;
override the app locations with `KIDDO_CHILD_APP_DIR` / `KIDDO_PARENT_APP_DIR`.

## What the apps do

`AppUpdateWatcher` (`packages/kiddo_shared/lib/widgets/app_update_watcher.dart`) runs once per
launch, after the first frame, and calls `AppUpdateService.check`:

- fetches `<site>/app-releases.json` (`SITE_URL` / `APP_RELEASES_URL` in the app `.env`),
- compares the manifest entry against `PackageInfo.version` + `buildNumber`,
- skips the prompt when the same build was already dismissed, throttles checks to once per
  6 hours (successful lookups only — offline devices retry next launch).

If a newer build exists the family sees an update dialog:

- Android: the APK is downloaded to the app temp directory and handed to the package installer
  (`open_filex`, `REQUEST_INSTALL_PACKAGES` in the manifest); any failure falls back to opening
  the download URL.
- Web/other platforms: the download URL opens in the browser.

Both apps also have **Settings → App → Check for Updates**, which bypasses the 6-hour throttle,
clears a previous "Later" dismissal and shows the installed build next to the button.

`forceUpdate: true` in a manifest entry makes the prompt non-dismissible — set it by hand in
`public/app-releases.json` when a release must not be skipped (the next `apps:sync` resets it).
