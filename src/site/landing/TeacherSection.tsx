import React from 'react';
import { BookOpen, CheckSquare, Users, CalendarDays, Megaphone, MessageCircle } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { Reveal } from './Reveal';

const teacherFeatures = [
  { icon: BookOpen, text: 'Create assignments' },
  { icon: CheckSquare, text: 'Track submissions' },
  { icon: Users, text: 'Manage classes' },
  { icon: CalendarDays, text: 'Record attendance' },
  { icon: Megaphone, text: 'Send announcements' },
  { icon: MessageCircle, text: 'Communicate with parents' },
];

export function TeacherSection() {
  return (
    <section id="teachers" className="py-16 md:py-24 bg-white">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal>
            <div>
              <Badge variant="mint" className="px-3.5 py-1.5 text-xs">
                For Teachers
              </Badge>
              <h2 className="mt-5 text-[32px] md:text-[42px] font-bold tracking-tight text-kiddo-navy leading-tight">
                Bring home and school
                <br />
                <span className="text-kiddo-green">closer together.</span>
              </h2>
              <p className="mt-5 text-[17px] text-kiddo-muted leading-relaxed max-w-[540px]">
                Teachers use the KidDo Adult App — no separate teacher app needed —
                to run their classes and keep parents in the loop.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {teacherFeatures.map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-100 bg-kiddo-warm"
                  >
                    <span className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-kiddo-green">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <span className="text-[15px] font-semibold text-kiddo-navy">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative">
              <div className="absolute -bottom-6 -right-6 w-44 h-44 rounded-full opacity-20 bg-kiddo-green blur-3xl" />
              <Card className="relative p-3 border-white shadow-[0_30px_60px_-15px_rgba(27,58,75,0.20)] overflow-hidden">
                <div className="rounded-xl bg-gradient-to-br from-kiddo-mint/50 to-kiddo-sky/20 aspect-[4/3] flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-white text-kiddo-green flex items-center justify-center shadow-sm mb-4">
                      <Users className="h-6 w-6" />
                    </div>
                    <p className="text-kiddo-navy text-[15px] font-bold">Teacher Workspace</p>
                    <p className="text-kiddo-muted text-[13px] mt-1 font-medium">
                      Inside the KidDo Adult App
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
