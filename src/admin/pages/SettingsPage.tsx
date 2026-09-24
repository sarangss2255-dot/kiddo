import { Coins, Mail, BellRing, CreditCard, ShieldCheck, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';

export function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Settings"
        description="Configure platform-level preferences and review the account used for administrative access."
      />

      <div className="grid grid-cols-1 gap-8">
        {/* Account Settings */}
        <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <User className="text-kiddo-blue" size={18} />
              Account Settings
            </CardTitle>
            <CardDescription>The authenticated administrator account for this workspace.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-kiddo-navy text-white flex items-center justify-center font-bold uppercase shrink-0">
                  {user?.firstName?.[0] ?? 'A'}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">
                    {user ? `${user.firstName} ${user.lastName}`.trim() : 'Administrator'}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Administrator</p>
                </div>
              </div>
              <Badge variant="info" className="bg-kiddo-blue/10 text-kiddo-blue border-none rounded-full font-bold capitalize">
                Verified
              </Badge>
            </div>

            <div className="space-y-2 text-xs font-bold text-slate-600">
              <div className="flex items-center gap-2 p-3.5 bg-slate-50/50 rounded-xl border border-slate-100">
                <Mail size={14} className="text-slate-400" />
                <span className="truncate">{user?.email ?? '—'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Settings */}
        <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="text-kiddo-blue" size={18} />
              Platform Settings
            </CardTitle>
            <CardDescription>Current platform-level configuration governed by the KidDo backend.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl space-y-3">
              <div className="w-10 h-10 bg-amber-100/60 text-amber-700 rounded-xl flex items-center justify-center shadow-sm">
                <Coins size={18} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">Reward Configuration</h4>
                <p className="text-xs text-slate-500 font-medium mt-1.5 leading-relaxed">
                  Reward points convert to reward coins at 1,000 RP = 1 RC. Waking-up rewards are earned
                  in the 3:30 PM – 4:30 PM bracket (30 points) and taper by 10 points each additional
                  hour, ending at 6:30 PM.
                </p>
              </div>
            </div>

            <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-2xl space-y-3">
              <div className="w-10 h-10 bg-sky-100/60 text-sky-700 rounded-xl flex items-center justify-center shadow-sm">
                <BellRing size={18} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">Notification Configuration</h4>
                <p className="text-xs text-slate-500 font-medium mt-1.5 leading-relaxed">
                  Families receive realtime updates for task approvals, reward claims, and platform
                  announcements through the KidDo notification engine.
                </p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-3">
              <div className="w-10 h-10 bg-emerald-100/60 text-emerald-700 rounded-xl flex items-center justify-center shadow-sm">
                <CreditCard size={18} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">Subscription Configuration</h4>
                <p className="text-xs text-slate-500 font-medium mt-1.5 leading-relaxed">
                  Active family dashboards receive complimentary premium access with advertising filters
                  disabled across child companion applications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
