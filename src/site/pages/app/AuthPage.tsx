import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, ChevronRight, Lock, Mail, Shield, Users } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { cn } from '../../../lib/utils';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
}

const avatars = ['FOX', 'PANDA', 'LION', 'KOALA', 'BEE', 'UNICORN', 'CAT', 'BEAR'];
const availableGoals = [
  { id: 'routines', label: 'MORNING + BEDTIME ROUTINES' },
  { id: 'chores', label: 'HELPING WITH CHORES' },
  { id: 'learning', label: 'PUZZLES + DAILY LEARNING' },
  { id: 'screen', label: 'HEALTHIER SCREEN BALANCE' },
  { id: 'habits', label: 'HYGIENE + CONSISTENCY' },
];

export function AuthPage({ initialMode = 'login' }: AuthPageProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'auth' | 'otp' | 'role' | 'onboarding'>('auth');
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('FOX');
  const [goals, setGoals] = useState<string[]>([]);

  const handleAuthSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) return;
    if (mode === 'signup') {
      setStep('onboarding');
      return;
    }
    setStep('otp');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }

    if (next.every(Boolean) && index === 3) {
      window.setTimeout(() => setStep('role'), 300);
    }
  };

  const handleRoleSelect = (role: 'parent' | 'child') => {
    localStorage.setItem('kiddo_user_role', role);
    navigate(role === 'parent' ? '/app/parent' : '/app/child');
  };

  const toggleGoal = (goalId: string) => {
    setGoals((current) => (current.includes(goalId) ? current.filter((id) => id !== goalId) : [...current, goalId]));
  };

  const handleOnboardingSubmit = () => {
    if (!childName) return;
    localStorage.setItem('kiddo_onboarding_child_name', childName);
    localStorage.setItem('kiddo_onboarding_child_age', childAge);
    localStorage.setItem('kiddo_onboarding_child_avatar', selectedAvatar);
    setStep('role');
  };

  const storedName = localStorage.getItem('kiddo_onboarding_child_name') || 'LEO';
  const storedAvatar = localStorage.getItem('kiddo_onboarding_child_avatar') || 'FOX';

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col px-4 py-6 md:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 border-4 border-black bg-white px-4 py-4 text-black">
          <button type="button" className="flex items-center gap-3 text-left" onClick={() => navigate('/')}>
            <div className="grid h-12 w-12 rotate-[3deg] place-items-center border-4 border-black bg-black text-white">
              <span className="font-display text-2xl leading-none">K</span>
            </div>
            <div>
              <div className="text-2xl font-extrabold leading-none">KidDo</div>
              <div className="mt-1 font-label text-[10px] font-bold">ACCESS LAYER</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="neo-shadow-black border-4 border-black bg-[#ccff00] px-4 py-3 font-label text-xs font-bold text-black transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            BACK
          </button>
        </header>

        <main className="my-auto grid gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <section className="hidden lg:block">
            <div className="neo-shadow-white border-8 border-black bg-[#ccff00] p-6 text-black">
              <div className="inline-flex rotate-[-3deg] border-4 border-black bg-white px-3 py-2 font-label text-xs font-bold">
                ENTRY BLUEPRINT
              </div>
              <h1 className="mt-6 font-display text-[96px] leading-[0.85]">
                AUTH
                <br />
                BUILD
                <br />
                SHIP
              </h1>
              <p className="mt-6 max-w-lg text-lg font-medium leading-relaxed">
                Every login, onboarding, and role transition now follows the same disruptor system used across the landing and download surfaces.
              </p>

              <div className="mt-8 grid gap-4">
                {[
                  'ACCOUNT ENTRY',
                  'CHILD PROFILE SETUP',
                  'WORKSPACE ROUTING',
                ].map((item, index) => (
                  <div key={item} className="neo-shadow-black grid gap-4 border-4 border-black bg-white p-4 sm:grid-cols-[72px_1fr] sm:items-start">
                    <div className="grid h-[72px] w-[72px] place-items-center border-4 border-black bg-black font-display text-4xl text-[#ccff00]">
                      0{index + 1}
                    </div>
                    <div className="pt-2 font-label text-sm font-bold text-black">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="w-full">
            <div className="neo-shadow-black border-8 border-black bg-white p-6 text-black md:p-8">
              <AnimatePresence mode="wait">
                {step === 'auth' && (
                  <motion.div
                    key="auth"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <div className="font-label text-xs font-bold">{mode === 'login' ? 'ACCESS SYSTEM' : 'CREATE FAMILY SPACE'}</div>
                      <h2 className="mt-4 font-display text-6xl leading-[0.85] md:text-[96px]">
                        {mode === 'login' ? 'LOG IN' : 'SIGN UP'}
                      </h2>
                      <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed">
                        {mode === 'login'
                          ? 'ENTER THE FAMILY DASHBOARD, CHILD MISSIONS, AND APPROVAL LOOP.'
                          : 'CREATE THE ACCOUNT FIRST, THEN CONFIGURE THE CHILD PROFILE AND WORKSPACE.'}
                      </p>
                    </div>

                    <form onSubmit={handleAuthSubmit} className="space-y-5">
                      <div className="space-y-4">
                        <label className="block space-y-2">
                          <span className="font-label text-xs font-bold">EMAIL</span>
                          <div className="flex items-center border-4 border-black bg-white">
                            <div className="border-r-4 border-black px-4 py-4">
                              <Mail size={18} />
                            </div>
                            <Input
                              type="email"
                              required
                              value={email}
                              onChange={(event) => setEmail(event.target.value)}
                              placeholder="NAME@FAMILY.COM"
                              className="h-14 border-0 bg-white px-4 font-label text-sm font-bold shadow-none outline-none"
                            />
                          </div>
                        </label>

                        <label className="block space-y-2">
                          <span className="font-label text-xs font-bold">PASSWORD</span>
                          <div className="flex items-center border-4 border-black bg-white">
                            <div className="border-r-4 border-black px-4 py-4">
                              <Lock size={18} />
                            </div>
                            <Input
                              type="password"
                              required
                              value={password}
                              onChange={(event) => setPassword(event.target.value)}
                              placeholder="PASSWORD"
                              className="h-14 border-0 bg-white px-4 font-label text-sm font-bold shadow-none outline-none"
                            />
                          </div>
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="neo-shadow-black inline-flex w-full items-center justify-center gap-3 border-4 border-black bg-[#ccff00] px-6 py-4 font-label text-sm font-bold text-black transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                      >
                        {mode === 'login' ? 'SEND ACCESS CODE' : 'CONTINUE SETUP'}
                        <ArrowRight size={16} />
                      </button>
                    </form>

                    <button
                      type="button"
                      onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                      className="neo-shadow-black inline-flex items-center justify-center border-4 border-black bg-white px-5 py-4 font-label text-xs font-bold text-black transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                    >
                      {mode === 'login' ? 'NEED AN ACCOUNT? START SETUP' : 'ALREADY HAVE AN ACCOUNT? SIGN IN'}
                    </button>
                  </motion.div>
                )}

                {step === 'otp' && (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <div className="font-label text-xs font-bold">VERIFICATION CHECK</div>
                      <h2 className="mt-4 font-display text-6xl leading-[0.85] md:text-[96px]">ENTER CODE</h2>
                      <p className="mt-4 text-base font-medium leading-relaxed">
                        Four digits. Direct confirmation. No soft modal behavior.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(event) => handleOtpChange(index, event.target.value)}
                          className="neo-shadow-black h-20 w-16 border-4 border-black bg-white text-center font-display text-4xl text-black outline-none"
                        />
                      ))}
                    </div>

                    <div className="border-4 border-black bg-[#ccff00] px-4 py-3 font-label text-xs font-bold text-black">
                      DEMO MODE: ANY FOUR DIGITS WILL CONTINUE.
                    </div>

                    <button type="button" onClick={() => setStep('auth')} className="font-label text-xs font-bold underline">
                      CHANGE EMAIL
                    </button>
                  </motion.div>
                )}

                {step === 'onboarding' && (
                  <motion.div
                    key="onboarding"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <div className="font-label text-xs font-bold">CHILD PROFILE</div>
                      <h2 className="mt-4 font-display text-6xl leading-[0.85] md:text-[96px]">CONFIGURE</h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="space-y-2">
                        <span className="font-label text-xs font-bold">NAME</span>
                        <Input
                          required
                          value={childName}
                          onChange={(event) => setChildName(event.target.value)}
                          placeholder="LEO"
                          className="h-14 border-4 border-black bg-white px-4 font-label text-sm font-bold shadow-none"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="font-label text-xs font-bold">AGE</span>
                        <Input
                          type="number"
                          value={childAge}
                          onChange={(event) => setChildAge(event.target.value)}
                          placeholder="8"
                          className="h-14 border-4 border-black bg-white px-4 font-label text-sm font-bold shadow-none"
                        />
                      </label>
                    </div>

                    <div className="space-y-3">
                      <div className="font-label text-xs font-bold">SELECT AVATAR</div>
                      <div className="grid grid-cols-4 gap-3">
                        {avatars.map((avatar) => (
                          <button
                            key={avatar}
                            type="button"
                            onClick={() => setSelectedAvatar(avatar)}
                            className={cn(
                              'border-4 border-black px-3 py-4 font-label text-xs font-bold transition-transform hover:translate-x-1 hover:translate-y-1',
                              selectedAvatar === avatar ? 'bg-[#ccff00] text-black' : 'bg-white text-black'
                            )}
                          >
                            {avatar}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="font-label text-xs font-bold">FAMILY GOALS</div>
                      <div className="grid gap-3">
                        {availableGoals.map((goal) => {
                          const active = goals.includes(goal.id);
                          return (
                            <button
                              key={goal.id}
                              type="button"
                              onClick={() => toggleGoal(goal.id)}
                              className={cn(
                                'flex items-center justify-between gap-4 border-4 border-black px-4 py-4 text-left font-label text-xs font-bold transition-transform hover:translate-x-1 hover:translate-y-1',
                                active ? 'bg-[#ccff00] text-black' : 'bg-white text-black'
                              )}
                            >
                              <span>{goal.label}</span>
                              {active ? <Check size={16} /> : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleOnboardingSubmit}
                      disabled={!childName}
                      className="neo-shadow-black inline-flex w-full items-center justify-center gap-3 border-4 border-black bg-[#ccff00] px-6 py-4 font-label text-sm font-bold text-black transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-50"
                    >
                      CONTINUE TO WORKSPACE
                      <ArrowRight size={16} />
                    </button>
                  </motion.div>
                )}

                {step === 'role' && (
                  <motion.div
                    key="role"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <div className="font-label text-xs font-bold">WORKSPACE SELECT</div>
                      <h2 className="mt-4 font-display text-6xl leading-[0.85] md:text-[96px]">CHOOSE MODE</h2>
                    </div>

                    <div className="grid gap-4">
                      <button
                        type="button"
                        onClick={() => handleRoleSelect('parent')}
                        className="neo-shadow-black group flex items-center gap-5 border-4 border-black bg-white p-5 text-left text-black transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                      >
                        <div className="grid h-16 w-16 place-items-center border-4 border-black bg-[#ccff00]">
                          <Users size={28} />
                        </div>
                        <div className="flex-1">
                          <div className="font-display text-4xl leading-[0.85]">PARENT</div>
                          <div className="mt-2 font-label text-xs font-bold">APPROVE / CONFIGURE / TRACK</div>
                        </div>
                        <ChevronRight className="transition-transform group-hover:translate-x-1" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRoleSelect('child')}
                        className="neo-shadow-black group flex items-center gap-5 border-4 border-black bg-[#ccff00] p-5 text-left text-black transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                      >
                        <div className="grid h-16 w-16 place-items-center border-4 border-black bg-white font-label text-xs font-bold">
                          {storedAvatar}
                        </div>
                        <div className="flex-1">
                          <div className="font-display text-4xl leading-[0.85]">{storedName}</div>
                          <div className="mt-2 font-label text-xs font-bold">MISSIONS / STREAKS / REWARDS</div>
                        </div>
                        <ChevronRight className="transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
