import React, { useState } from 'react';
import { useKiddoApp } from './KiddoApp';
import { Settings, User, Bell, Shield, Smartphone, Heart, Sparkles, RefreshCw, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { cn } from '../../../lib/utils';

export function SettingsSection() {
  const { childName, childAvatar, resetData } = useKiddoApp();
  
  // Custom states
  const [parentName, setParentName] = useState('Sarah Smith');
  const [parentEmail, setParentEmail] = useState('sarah@family.com');
  const [cName, setCName] = useState(childName);
  const [cAvatar, setCAvatar] = useState(childAvatar);
  const [cAge, setCAge] = useState('8');
  
  // Settings switches
  const [emailDigest, setEmailDigest] = useState(true);
  const [pushApprovals, setPushApprovals] = useState(true);
  const [pushStreakAlerts, setPushStreakAlerts] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<'cozy' | 'mint'>('cozy');

  const avatars = ['🦊', '🐱', '🐼', '🦁', '🦄', '🐨', '🦖', '🐝'];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('kiddo_onboarding_child_name', cName);
    localStorage.setItem('kiddo_onboarding_child_avatar', cAvatar);
    localStorage.setItem('kiddo_onboarding_child_age', cAge);
    alert('Profile settings saved successfully!');
    window.location.reload();
  };

  const triggerReset = () => {
    if (confirm('Are you sure you want to reset all mock tasks, rewards, and achievements to defaults?')) {
      resetData();
      alert('Application simulation reset.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      
      {/* Header */}
      <div>
        <Badge variant="info" className="px-3 py-1 mb-3">Control Center</Badge>
        <h1 className="text-4xl md:text-5xl font-kids font-bold">Profile & Settings</h1>
        <p className="text-lg text-brand-muted mt-2 font-medium">Customize your family setup and workspace preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Settings Panel */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* PROFILE CONFIGURATOR */}
          <Card className="p-8 border-brand-navy/5 shadow-sm">
            <h3 className="text-2xl font-kids font-bold flex items-center gap-3 mb-8 text-brand-navy">
              <User size={24} className="text-brand-orange" />
              Explorer Profile
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted ml-1">Explorer Name</label>
                  <Input
                    required
                    value={cName}
                    onChange={(e) => setCName(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted ml-1">Explorer Age</label>
                  <Input
                    type="number"
                    required
                    value={cAge}
                    onChange={(e) => setCAge(e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted ml-1">Select Avatar</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {avatars.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setCAvatar(av)}
                      className={cn(
                        "text-2xl py-3 rounded-2xl border-2 transition-all",
                        cAvatar === av 
                          ? "border-brand-orange bg-brand-orange/10 scale-105 shadow-sm" 
                          : "border-brand-navy/5 bg-white hover:border-brand-navy/10"
                      )}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" className="px-8 h-12 rounded-xl bg-brand-navy shadow-xl shadow-brand-navy/10">
                Save Profile Changes
              </Button>
            </form>
          </Card>

          {/* NOTIFICATION PREFERENCES */}
          <Card className="p-8 border-brand-navy/5 shadow-sm">
            <h3 className="text-2xl font-kids font-bold flex items-center gap-3 mb-8 text-brand-navy">
              <Bell size={24} className="text-brand-mint" />
              Notification Settings
            </h3>
            
            <div className="space-y-4">
              {[
                { state: emailDigest, setter: setEmailDigest, label: 'Weekly Digest Email', desc: 'Get a weekly performance chart report in your inbox.' },
                { state: pushApprovals, setter: setPushApprovals, label: 'Push Approvals Alerts', desc: 'Receive alerts when child completes daily missions.' },
                { state: pushStreakAlerts, setter: setPushStreakAlerts, label: 'Streak Reminders', desc: 'Remind child to finish routines before bedtime.' }
              ].map((opt, i) => (
                <label key={i} className="flex items-center justify-between p-5 bg-brand-bg rounded-2xl border border-brand-navy/5 cursor-pointer group hover:border-brand-mint/30 transition-all">
                  <div>
                    <span className="text-sm font-bold text-brand-navy block">{opt.label}</span>
                    <span className="text-xs text-brand-muted font-medium">{opt.desc}</span>
                  </div>
                  <div className={cn(
                    "w-12 h-6 rounded-full transition-all relative p-1",
                    opt.state ? "bg-brand-mint" : "bg-slate-200"
                  )}>
                    <div className={cn(
                      "w-4 h-4 bg-white rounded-full transition-all",
                      opt.state ? "translate-x-6" : "translate-x-0"
                    )} />
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={opt.state}
                      onChange={(e) => opt.setter(e.target.checked)}
                    />
                  </div>
                </label>
              ))}
            </div>
          </Card>

        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          
          {/* THEME SELECTOR */}
          <Card className="p-6 border-brand-navy/5 shadow-sm">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-xl flex items-center gap-2">
                <Sparkles size={20} className="text-brand-yellow" />
                Cozy Themes
              </CardTitle>
            </CardHeader>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setCurrentTheme('cozy')}
                className={cn(
                  "p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between group",
                  currentTheme === 'cozy' 
                    ? "border-brand-orange bg-brand-orange/5" 
                    : "border-brand-navy/5 bg-white hover:border-brand-navy/10"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🍊</span>
                  <span className={cn("text-xs font-bold", currentTheme === 'cozy' ? "text-brand-orange" : "text-brand-muted")}>Cozy Warmth</span>
                </div>
                {currentTheme === 'cozy' && <CheckCircle2 size={16} className="text-brand-orange" />}
              </button>

              <button
                onClick={() => setCurrentTheme('mint')}
                className={cn(
                  "p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between group",
                  currentTheme === 'mint' 
                    ? "border-brand-mint bg-brand-mint/5" 
                    : "border-brand-navy/5 bg-white hover:border-brand-navy/10"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌱</span>
                  <span className={cn("text-xs font-bold", currentTheme === 'mint' ? "text-brand-mint" : "text-brand-muted")}>Calming Mint</span>
                </div>
                {currentTheme === 'mint' && <CheckCircle2 size={16} className="text-brand-mint" />}
              </button>
            </div>
          </Card>

          {/* SIMULATOR CONTROLS */}
          <Card className="p-6 border-brand-navy/5 shadow-sm bg-rose-50/30 border-rose-100">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl text-rose-600 flex items-center gap-2">
                <RefreshCw size={18} />
                Simulator
              </CardTitle>
            </CardHeader>
            <p className="text-xs text-brand-muted font-medium leading-relaxed mb-6">
              Running in local sandbox simulation. Clear cache memory to restore onboarding and sample tasks.
            </p>
            <Button
              variant="outline"
              onClick={triggerReset}
              className="w-full bg-white hover:bg-rose-50 border-rose-200 text-rose-600 h-12 rounded-xl text-xs font-bold border-2 shadow-sm"
            >
              Clear Cache & Reset
            </Button>
          </Card>

        </div>

      </div>

    </div>
  );
}
