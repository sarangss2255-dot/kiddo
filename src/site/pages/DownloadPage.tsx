import Link from 'next/link';
import { Apple, Check, Download, QrCode, ShieldCheck, Smartphone, TabletSmartphone, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CHILD_APP_APK_URL, PARENT_APP_APK_URL } from '../../lib/site-config';
import { Reveal } from '../components/Reveal';

export function DownloadPage() {
  return (
    <div className="min-h-screen bg-kiddo-warm">
      <div className="mx-auto flex min-h-screen w-full max-w-[1240px] flex-col px-4 py-6 md:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/kiddo-logo-64.png" alt="" className="h-9 w-9 rounded-xl shadow-sm" />
            <span className="text-[22px] font-extrabold tracking-tight text-kiddo-navy">KidDo</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth">Log in</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </header>

        <main className="flex-1 py-12 md:py-16">
          {/* Hero */}
          <section className="text-center">
            <Reveal>
              <Badge variant="sky" className="px-4 py-1.5 text-xs">
                Android · Field ready
              </Badge>
              <h1 className="mx-auto mt-6 max-w-[760px] text-[38px] font-extrabold leading-[1.05] tracking-tight text-kiddo-navy md:text-[56px]">
                Get the KidDo app
                <span className="block text-kiddo-blue">for your family.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-[560px] text-[17px] leading-relaxed text-kiddo-muted">
                Download the app for your child or for yourself, install it, and sign in
                with your family account. KidDo runs on phones, tablets, and Chromebooks.
              </p>

              <div className="mx-auto mt-9 grid max-w-[720px] gap-4 sm:grid-cols-2">
                <Card className="border-slate-200/80 bg-white text-left shadow-[0_18px_45px_-20px_rgba(27,58,75,0.18)]">
                  <CardContent className="p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-kiddo-orange/15 text-kiddo-orange">
                      <Smartphone className="h-5 w-5" />
                    </span>
                    <h2 className="mt-4 text-lg font-extrabold text-kiddo-navy">Child App</h2>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-kiddo-muted">
                      Missions, streaks, mini games and rewards for your child.
                    </p>
                    <Button asChild size="lg" variant="accent" className="mt-5 w-full">
                      <a href={CHILD_APP_APK_URL} download>
                        <Download />
                        Download Child App
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-slate-200/80 bg-white text-left shadow-[0_18px_45px_-20px_rgba(27,58,75,0.18)]">
                  <CardContent className="p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-kiddo-sky/20 text-kiddo-blue">
                      <Users className="h-5 w-5" />
                    </span>
                    <h2 className="mt-4 text-lg font-extrabold text-kiddo-navy">Parent App</h2>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-kiddo-muted">
                      Approvals, routines, school progress and parent controls.
                    </p>
                    <Button asChild size="lg" className="mt-5 w-full">
                      <a href={PARENT_APP_APK_URL} download>
                        <Download />
                        Download Parent App
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <p className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-kiddo-muted">
                <Apple className="h-4 w-4" />
                iOS — coming soon
              </p>
            </Reveal>
          </section>

          {/* QR + install steps */}
          <section className="mt-16 md:mt-20 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <Card className="h-full border-slate-200/80 shadow-[0_24px_60px_-20px_rgba(27,58,75,0.12)]">
                <CardContent className="flex h-full flex-col items-center justify-center p-8 text-center">
                  <span className="text-sm font-bold uppercase tracking-wide text-kiddo-blue">Scan to install</span>
                  <h2 className="mt-3 text-2xl font-extrabold text-kiddo-navy">Open it on your device</h2>
                  <p className="mt-2 max-w-[380px] text-[15px] text-kiddo-muted">
                    Use the QR handoff when the family device is already in hand and needs the package directly.
                  </p>
                  <div className="mt-7 grid place-items-center rounded-2xl border-2 border-slate-200 bg-white p-8">
                    <QrCode className="h-40 w-40 text-kiddo-navy" />
                  </div>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delayMs={100}>
              <Card className="h-full border-slate-200/80 bg-white shadow-[0_24px_60px_-20px_rgba(27,58,75,0.12)]">
                <CardContent className="flex h-full flex-col justify-center p-8">
                  <span className="text-sm font-bold uppercase tracking-wide text-kiddo-blue">Install flow</span>
                  <div className="mt-6 space-y-4">
                    {[
                      'Pick the child or parent app and download the APK.',
                      'Allow installation when Android prompts.',
                      'Sign in with the family account and select the workspace.',
                    ].map((item, index) => (
                      <div key={item} className="flex items-start gap-4">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-kiddo-sky/20 text-sm font-extrabold text-kiddo-blue">
                          {index + 1}
                        </span>
                        <p className="pt-1.5 text-[15px] font-semibold text-kiddo-navy">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 rounded-2xl bg-kiddo-mint/50 p-5">
                    <p className="text-[14px] font-semibold leading-relaxed text-kiddo-muted">
                      <ShieldCheck className="mr-1.5 inline h-4 w-4 text-kiddo-green" />
                      The package path is explicit about safety, installation, and ownership.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </section>

          {/* Perks */}
          <section className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: 'Verified package',
                body: 'Safe to install and clearly attributed to KidDo.',
              },
              {
                icon: TabletSmartphone,
                title: 'Device ready',
                body: 'Phones, tablets, and Chromebooks can join the same loop.',
              },
              {
                icon: Smartphone,
                title: 'Direct access',
                body: 'Download, install, and continue straight into the product.',
              },
            ].map((item, index) => (
              <Reveal key={item.title} delayMs={index * 80}>
                <Card className="h-full border-slate-200/70 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(27,58,75,0.08)] transition-all duration-300">
                  <CardContent className="p-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-kiddo-sky/20 text-kiddo-blue">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-base font-extrabold text-kiddo-navy">{item.title}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-kiddo-muted">{item.body}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </section>

          {/* Final CTA */}
          <section className="mt-14 rounded-3xl bg-kiddo-navy px-6 py-12 text-center text-white md:px-12">
            <h2 className="text-2xl font-extrabold md:text-3xl">Installed? Time to set up.</h2>
            <p className="mx-auto mt-3 max-w-[480px] text-[15px] text-white/70">
              Sign in with your family account and pick your workspace.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="xl" className="w-full bg-kiddo-blue text-white hover:bg-white hover:text-kiddo-navy sm:w-auto">
                <Link href="/auth">
                  <Check />
                  Log in to KidDo
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="w-full border-white/25 bg-transparent text-white hover:bg-white/10 sm:w-auto">
                <Link href="/">Back to the site</Link>
              </Button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
