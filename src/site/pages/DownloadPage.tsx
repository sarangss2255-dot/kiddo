import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Apple, ArrowRight, Download, QrCode, ShieldCheck, Smartphone, TabletSmartphone } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { SiteHeader } from '../components/SiteHeader';

const previewSlides = [
  {
    title: 'MISSION BOARD',
    body: 'CHILD TASKS STAY DIRECT, VISIBLE, AND EASY TO TRIGGER.',
  },
  {
    title: 'PARENT APPROVALS',
    body: 'OVERSIGHT, RELEASE, AND CONFIRMATION STAY IN ONE HARD-EDGED FLOW.',
  },
  {
    title: 'REWARD LOOP',
    body: 'STREAKS AND INCENTIVES READ LIKE SYSTEM OUTPUT, NOT DECORATION.',
  },
];

export function DownloadPage() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <SiteHeader />

      <main className="pb-20 lg:pr-[200px]">
        <section className="border-b-8 border-black bg-white px-4 py-16 text-black md:px-6 lg:px-8">
          <div className="mx-auto max-w-[1180px]">
            <div className="neo-shadow-black inline-flex rotate-[-2deg] border-4 border-black bg-[#ccff00] px-4 py-2 font-label text-xs font-bold">
              ANDROID DELIVERY / FIELD READY
            </div>

            <Reveal className="mt-8 max-w-6xl">
              <h1 className="font-display text-[24vw] leading-[0.85] md:text-[150px]">
                GET THE
                <br />
                BUILD
              </h1>
            </Reveal>

            <Reveal className="mt-6 max-w-3xl">
              <p className="text-2xl font-medium italic leading-tight">
                Download the current KidDo package without losing the brutalist system language.
              </p>
            </Reveal>

            <Reveal className="mt-10 flex flex-wrap gap-4">
              <a
                href="/kiddo-app.apk"
                download
                className="neo-shadow-black inline-flex items-center gap-3 border-4 border-black bg-[#ccff00] px-6 py-4 font-label text-sm font-bold text-black transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                <Download size={18} /> DOWNLOAD APK
              </a>
              <span className="inline-flex items-center gap-3 border-4 border-black bg-black px-6 py-4 font-label text-sm font-bold text-white">
                <Apple size={18} /> IOS PENDING
              </span>
            </Reveal>
          </div>
        </section>

        <section className="border-b-8 border-black bg-[#121212] px-4 py-16 md:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <div className="neo-shadow-white border-8 border-black bg-white p-6 text-black">
                <div className="font-label text-xs font-bold">SCAN TO INSTALL</div>
                <div className="mt-4 font-display text-5xl leading-[0.85]">OPEN ON DEVICE</div>
                <p className="mt-4 text-base font-medium leading-relaxed">
                  Use the QR handoff when the family device is already in hand and needs the package directly.
                </p>
                <div className="mt-8 grid place-items-center border-4 border-black bg-[#121212] p-6 text-white">
                  <QrCode size={150} />
                </div>
              </div>
            </Reveal>

            <Reveal delayMs={100}>
              <div className="neo-shadow-black border-8 border-black bg-[#ccff00] p-6 text-black">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-label text-xs font-bold">LIVE PREVIEW</div>
                    <div className="mt-3 font-display text-5xl leading-[0.85]">{previewSlides[activeSlide].title}</div>
                  </div>
                  <div className="border-4 border-black bg-white p-4">
                    <Smartphone size={24} />
                  </div>
                </div>
                <p className="mt-5 max-w-xl text-base font-medium leading-relaxed">{previewSlides[activeSlide].body}</p>

                <div className="mt-8 border-4 border-black bg-white p-5">
                  <div className="font-label text-xs font-bold text-black">MOBILE SURFACE</div>
                  <div className="mt-5 grid gap-3">
                    {[72, 54, 88].map((width, index) => (
                      <div key={width} className="border-4 border-black bg-[#f8fafc] px-4 py-3">
                        <div className="flex items-center justify-between gap-3 font-label text-xs font-bold text-black">
                          <span>PANEL 0{index + 1}</span>
                          <span>ACTIVE</span>
                        </div>
                        <div className="mt-3 h-3 border-4 border-black bg-white">
                          <div className="h-full bg-[#ccff00]" style={{ width: `${width}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  {previewSlides.map((item, index) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setActiveSlide(index)}
                      className={`h-4 border-4 border-black ${index === activeSlide ? 'w-16 bg-black' : 'w-4 bg-white'}`}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="border-b-8 border-black bg-white px-4 py-16 text-black md:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1180px] gap-6 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: 'VERIFIED PACKAGE',
                body: 'THE PACKAGE PATH STAYS EXPLICIT ABOUT SAFETY, INSTALLATION, AND OWNERSHIP.',
              },
              {
                icon: TabletSmartphone,
                title: 'DEVICE READY',
                body: 'PHONES, TABLETS, AND CHROMEBOOKS CAN ENTER THE SAME SHIPPING LOOP.',
              },
              {
                icon: Download,
                title: 'DIRECT ACCESS',
                body: 'NO SOFT DETOURS. DOWNLOAD, INSTALL, AND CONTINUE INTO THE PRODUCT.',
              },
            ].map((item, index) => (
              <Reveal key={item.title} delayMs={index * 80}>
                <div className="neo-shadow-black h-full border-4 border-black bg-white p-6">
                  <div className="inline-flex border-4 border-black bg-[#ccff00] p-3">
                    <item.icon size={22} />
                  </div>
                  <div className="mt-5 font-display text-4xl leading-[0.85]">{item.title}</div>
                  <p className="mt-4 text-base font-medium leading-relaxed">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-b-8 border-black bg-[#ccff00] px-4 py-16 text-black md:px-6 lg:px-8">
          <div className="mx-auto max-w-[1180px]">
            <div className="font-label text-xs font-bold">INSTALL FLOW</div>
            <div className="mt-5 grid gap-4">
              {[
                'DOWNLOAD THE ANDROID APK.',
                'ALLOW INSTALLATION WHEN ANDROID PROMPTS.',
                'SIGN IN WITH THE FAMILY ACCOUNT AND SELECT THE WORKSPACE.',
              ].map((item, index) => (
                <Reveal key={item} delayMs={index * 80}>
                  <div className="neo-shadow-black grid gap-4 border-4 border-black bg-white p-5 text-black sm:grid-cols-[88px_1fr] sm:items-start">
                    <div className="grid h-[88px] w-[88px] place-items-center border-4 border-black bg-black font-display text-4xl leading-none text-[#ccff00]">
                      0{index + 1}
                    </div>
                    <div className="pt-1 font-label text-sm font-bold">{item}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-black px-4 py-16 text-white md:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <Reveal>
              <div>
                <div className="font-label text-xs font-bold text-[#ccff00]">NEXT ACTION</div>
                <h2 className="mt-4 font-display text-6xl leading-[0.85] md:text-[110px]">
                  INSTALL
                  <br />
                  THEN
                  <br />
                  ENTER
                </h2>
              </div>
            </Reveal>

            <Reveal delayMs={100}>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/kiddo-app.apk"
                  download
                  className="neo-shadow-white inline-flex items-center gap-3 border-4 border-black bg-white px-6 py-4 font-label text-sm font-bold text-black transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                >
                  GET APK <ArrowRight size={16} />
                </a>
                <Link
                  to="/signup"
                  className="neo-shadow-white inline-flex items-center gap-3 border-4 border-white bg-[#ccff00] px-6 py-4 font-label text-sm font-bold text-black transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                >
                  OPEN ACCOUNT FLOW <ArrowRight size={16} />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  );
}
