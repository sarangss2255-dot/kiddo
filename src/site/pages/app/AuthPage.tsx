"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Sparkles,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Card, CardContent } from '../../../components/ui/Card';
import { Separator } from '../../../components/ui/Separator';
import { Alert, AlertDescription } from '../../../components/ui/Alert';
import { PhoneDashboard } from '../../landing/PhoneDashboard';
import { cn } from '../../../lib/utils';
import { api } from '../../../api';
import { auth, googleProvider } from '../../../firebase';
import { signInWithPopup } from 'firebase/auth';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
}

const avatars = ['FOX', 'PANDA', 'LION', 'KOALA', 'BEE', 'UNICORN', 'CAT', 'BEAR'];
const availableGoals = [
  { id: 'routines', label: 'Morning + bedtime routines' },
  { id: 'chores', label: 'Helping with chores' },
  { id: 'learning', label: 'Puzzles + daily learning' },
  { id: 'screen', label: 'Healthier screen balance' },
  { id: 'habits', label: 'Hygiene + consistency' },
];

export function AuthPage({ initialMode = 'login' }: AuthPageProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [step, setStep] = useState<'auth' | 'otp' | 'role' | 'onboarding'>('auth');
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [parentName, setParentName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('FOX');
  const [goals, setGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ease: "linear" | [number, number, number, number] = prefersReducedMotion
    ? "linear"
    : [0.22, 1, 0.36, 1];
  const fadeProps = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -16 } };

  const finishLogin = async (payload: any, options: { onboarding?: boolean } = {}) => {
    await api.setToken(payload.accessToken);
    localStorage.setItem('kiddo_auth_user', JSON.stringify(payload.user));

    if (['super_admin', 'manager', 'school_admin'].includes(payload.user.role)) {
      router.push('/admin');
      return;
    }

    if (payload.user.role === 'child') {
      localStorage.setItem('kiddo_user_role', 'child');
      router.push('/app/child');
      return;
    }

    localStorage.setItem('kiddo_user_role', 'parent');

    if (options.onboarding) {
      setStep('onboarding');
      return;
    }

    router.push('/app/parent');
  };

  const handleAuthSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) return;

    if (mode === 'signup') {
      const trimmedParentName = parentName.trim();
      const trimmedFamilyName = familyName.trim();

      if (trimmedParentName.length < 2) {
        setError('Please enter your name (at least 2 characters).');
        return;
      }
      if (trimmedFamilyName.length < 2) {
        setError('Please enter a family name (at least 2 characters).');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters.');
        return;
      }

      setLoading(true);
      setError('');
      try {
        const payload = await api.post('/auth/parent/register', {
          firstName: trimmedParentName,
          familyName: trimmedFamilyName,
          email: email.trim(),
          password,
        });
        await finishLogin(payload, { onboarding: true });
      } catch (err: any) {
        setError(err?.message || 'Unable to create your family account. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setError('');
    try {
      const payload = await api.post('/auth/login', {
        identifier: email,
        password,
        role: undefined,
      });
      await finishLogin(payload);
    } catch (err: any) {
      setError(err?.message || 'Unable to sign in. Check credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const idToken = await credential.user.getIdToken();
      const displayName = credential.user.displayName?.trim() || 'Parent';
      const [firstName, ...lastNameParts] = displayName.split(' ');
      const payload = await api.post('/auth/firebase', {
        idToken,
        ...(mode === 'signup'
          ? {
              firstName,
              lastName: lastNameParts.join(' '),
              familyName: familyName.trim() || `${firstName}'s Family`,
            }
          : {}),
      });
      await finishLogin(payload, { onboarding: mode === 'signup' });
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed. Check Firebase and backend configuration.');
    } finally {
      setLoading(false);
    }
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
    router.push(role === 'parent' ? '/app/parent' : '/app/child');
  };

  const toggleGoal = (goalId: string) => {
    setGoals((current) => (current.includes(goalId) ? current.filter((id) => id !== goalId) : [...current, goalId]));
  };

  const handleOnboardingSubmit = async () => {
    if (!childName) return;

    setLoading(true);
    setError('');
    try {
      const age = Number(childAge);
      const standard =
        Number.isFinite(age) && age > 0 ? Math.min(12, Math.max(1, Math.round(age) - 5)) : 1;

      await api.post('/auth/children', {
        firstName: childName.trim(),
        avatar: selectedAvatar,
        standard,
      });

      localStorage.setItem('kiddo_onboarding_child_name', childName);
      localStorage.setItem('kiddo_onboarding_child_age', childAge);
      localStorage.setItem('kiddo_onboarding_child_avatar', selectedAvatar);
      setStep('role');
    } catch (err: any) {
      setError(err?.message || 'Unable to add your child profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipOnboarding = () => {
    setError('');
    setStep('role');
  };

  const storedName =
    (typeof window !== 'undefined'
      ? localStorage.getItem('kiddo_onboarding_child_name')
      : null) || 'LEO';
  const storedAvatar =
    (typeof window !== 'undefined'
      ? localStorage.getItem('kiddo_onboarding_child_avatar')
      : null) || 'FOX';

  const isLoginStep = step === 'auth';

  return (
    <div className="min-h-screen bg-kiddo-warm">
      {/* Desktop: 50/50 split */}
      <div className="grid min-h-screen w-full md:grid-cols-2">
        {/* LEFT 50% — KidDo brand experience (tablet/desktop) */}
        <aside className="relative hidden md:flex flex-col overflow-hidden bg-gradient-to-br from-kiddo-sky/15 via-kiddo-warm to-kiddo-mint/40 p-10 xl:p-16">
          {/* Subtle decorative elements */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-kiddo-blue/10 blur-[90px]" />
            <div className="absolute bottom-[-10%] right-[5%] h-80 w-80 rounded-full bg-kiddo-orange/10 blur-[100px]" />
            <div className="absolute top-[38%] right-[12%] h-40 w-40 rounded-full bg-kiddo-mint blur-[70px]" />
            <Star className="absolute left-[12%] top-[30%] h-4 w-4 text-kiddo-blue/30" />
            <Star className="absolute right-[22%] top-[18%] h-3 w-3 text-kiddo-orange/40" />
            <Sparkles className="absolute left-[18%] top-[58%] h-4 w-4 text-kiddo-green/40" />
          </div>

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease }}
            className="relative z-10 flex items-center gap-2.5"
          >
            <img src="/kiddo-logo-64.png" alt="" className="h-10 w-10 rounded-xl shadow-sm" />
            <span className="text-2xl font-extrabold tracking-tight text-kiddo-navy">KidDo</span>
          </motion.div>

          {/* Copy */}
          <div className="relative z-10 mt-14 max-w-[460px]">
            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
            >
              <h1 className="text-[44px] font-extrabold leading-[1.08] tracking-tight text-kiddo-navy">
                Making everyday tasks feel like{' '}
                <span className="text-kiddo-blue">an adventure.</span>
              </h1>
              <p className="mt-5 text-[17px] leading-relaxed text-kiddo-muted">
                KidDo helps families turn everyday responsibilities into fun missions,
                rewards, and progress.
              </p>
            </motion.div>
          </div>

          {/* Real KidDo dashboard */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            className="relative z-10 mt-12 flex flex-1 items-end justify-start"
          >
            <div className="relative">
              {/* Soft glow behind the device */}
              <div className="absolute -inset-6 rounded-[40px] bg-kiddo-blue/15 blur-[45px]" />

              {/* Device-style frame around the real dashboard */}
              <div
                className="relative w-[300px] rounded-[38px] p-2.5 shadow-[0_40px_80px_-20px_rgba(27,58,75,0.35)]"
                style={{ background: 'linear-gradient(145deg, #2a2a2a, #111)' }}
              >
                <div className="overflow-hidden rounded-[30px]">
                  <PhoneDashboard variant="screen" />
                </div>
              </div>

              {/* Floating callouts */}
              <div className="absolute -right-10 top-10 hidden xl:flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3.5 py-2.5 shadow-[0_8px_24px_rgba(27,58,75,0.10)]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-kiddo-orange/15 text-kiddo-orange">
                  <Zap className="h-3.5 w-3.5" />
                </span>
                <span className="text-[13px] font-bold text-kiddo-navy">+30 points earned</span>
              </div>
              <div className="absolute -left-12 bottom-24 hidden xl:flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3.5 py-2.5 shadow-[0_8px_24px_rgba(27,58,75,0.10)]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-kiddo-green/15 text-kiddo-green">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-[13px] font-bold text-kiddo-navy">Mission complete</span>
              </div>
            </div>
          </motion.div>
        </aside>

        {/* RIGHT 50% — Auth */}
        <section className="relative flex flex-col bg-white">
          {/* Top bar: back to home */}
          <div className="flex items-center justify-between px-6 py-5 md:px-10">
            <div className="md:hidden flex items-center gap-2">
              <img src="/kiddo-logo-64.png" alt="" className="h-8 w-8 rounded-lg" />
              <span className="text-xl font-extrabold tracking-tight text-kiddo-navy">KidDo</span>
            </div>
            <Button asChild variant="ghost" size="sm" className="ml-auto">
              <Link href="/">← Back to home</Link>
            </Button>
          </div>

          {/* Centered auth container */}
          <div className="flex flex-1 items-center justify-center px-5 pb-14 pt-4 sm:px-8">
            <div className="w-full max-w-md">
              <AnimatePresence mode="wait">
                {isLoginStep && (
                  <motion.div
                    key="auth"
                    {...fadeProps}
                    transition={{ duration: 0.35, ease }}
                    aria-live="polite"
                  >
                    {/* Header */}
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-kiddo-sky/20 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-kiddo-blue">
                      <Sparkles className="h-3.5 w-3.5" />
                      {mode === 'signup' ? 'Get started' : 'Welcome back'}
                    </span>
                    <h2 className="mt-5 text-[32px] font-extrabold leading-tight tracking-tight text-kiddo-navy">
                      {mode === 'signup' ? 'Create your family account' : 'Log in to KidDo'}
                    </h2>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-kiddo-muted">
                      {mode === 'signup'
                        ? 'Set up your family, add your first child, and start building better habits together.'
                        : 'Enter your family dashboard, child missions, and the approval loop.'}
                    </p>

                    {/* Form */}
                    <form onSubmit={handleAuthSubmit} className="mt-8 space-y-5" noValidate={false}>
                      {mode === 'signup' ? (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="auth-name">Your name</Label>
                            <Input
                              id="auth-name"
                              autoComplete="name"
                              required
                              value={parentName}
                              onChange={(event) => setParentName(event.target.value)}
                              placeholder="Sarah"
                              className="h-12"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="auth-family">Family name</Label>
                            <Input
                              id="auth-family"
                              autoComplete="organization"
                              required
                              value={familyName}
                              onChange={(event) => setFamilyName(event.target.value)}
                              placeholder="The Johnsons"
                              className="h-12"
                            />
                          </div>
                        </>
                      ) : null}

                      <div className="space-y-2">
                        <Label htmlFor="auth-email">Email</Label>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-kiddo-muted" />
                          <Input
                            id="auth-email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="name@family.com"
                            className="h-12 pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="auth-password">Password</Label>
                          {mode === 'login' ? (
                            <span className="text-[13px] font-semibold text-kiddo-muted">Forgot?</span>
                          ) : (
                            <span className="text-[13px] font-semibold text-kiddo-muted">
                              Min. 8 characters
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-kiddo-muted" />
                          <Input
                            id="auth-password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                            required
                            minLength={mode === 'signup' ? 8 : 6}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Password"
                            className="h-12 pl-10 pr-11"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            aria-pressed={showPassword}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-lg text-kiddo-muted hover:text-kiddo-navy hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {error ? (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      ) : null}

                      <Button
                        type="submit"
                        size="xl"
                        isLoading={loading}
                        disabled={loading}
                        className="w-full"
                      >
                        {loading
                          ? mode === 'signup'
                            ? 'Creating account...'
                            : 'Signing in...'
                          : mode === 'signup'
                            ? 'Create account'
                            : 'Sign in'}
                        {!loading ? <ArrowRight /> : null}
                      </Button>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                      <Separator className="flex-1" />
                      <span className="text-xs font-bold uppercase tracking-wide text-kiddo-muted">or</span>
                      <Separator className="flex-1" />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="xl"
                      className="w-full bg-white"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                    >
                      <Shield className="h-4 w-4 text-kiddo-blue" />
                      {mode === 'signup' ? 'Sign up with Google' : 'Continue with Google'}
                    </Button>

                    <p className="mt-7 text-center text-[15px] text-kiddo-muted">
                      {mode === 'signup' ? (
                        <>
                          Already have a family account?{' '}
                          <button
                            type="button"
                            onClick={() => {
                              setMode('login');
                              setError('');
                            }}
                            className="font-bold text-kiddo-blue underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                          >
                            Sign in
                          </button>
                        </>
                      ) : (
                        <>
                          New to KidDo?{' '}
                          <button
                            type="button"
                            onClick={() => {
                              setMode('signup');
                              setError('');
                            }}
                            className="font-bold text-kiddo-blue underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                          >
                            Create a family account
                          </button>
                        </>
                      )}
                    </p>
                  </motion.div>
                )}

                {step === 'otp' && (
                  <motion.div
                    key="otp"
                    {...fadeProps}
                    transition={{ duration: 0.35, ease }}
                  >
                    <h2 className="text-[28px] font-extrabold tracking-tight text-kiddo-navy">
                      Enter the code
                    </h2>
                    <p className="mt-2 text-[15px] text-kiddo-muted">
                      Four digits. Direct confirmation.
                    </p>

                    <div className="mt-7 flex gap-3">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={1}
                          value={digit}
                          onChange={(event) => handleOtpChange(index, event.target.value)}
                          className="h-16 w-14 rounded-xl border-2 border-slate-200 bg-white text-center text-2xl font-extrabold text-kiddo-navy outline-none focus:border-kiddo-blue focus:ring-2 focus:ring-kiddo-blue/25"
                        />
                      ))}
                    </div>

                    <div className="mt-6 rounded-xl bg-kiddo-sky/15 px-4 py-3 text-xs font-bold text-kiddo-blue">
                      Demo mode: any four digits will continue.
                    </div>

                    <Button type="button" variant="ghost" size="sm" className="mt-4" onClick={() => setStep('auth')}>
                      Change email
                    </Button>
                  </motion.div>
                )}

                {step === 'onboarding' && (
                  <motion.div
                    key="onboarding"
                    {...fadeProps}
                    transition={{ duration: 0.35, ease }}
                  >
                    <h2 className="text-[28px] font-extrabold tracking-tight text-kiddo-navy">
                      Child profile
                    </h2>
                    <p className="mt-2 text-[15px] text-kiddo-muted">
                      Set up your first child in a couple of steps.
                    </p>

                    <div className="mt-7 grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="onboard-name">Name</Label>
                        <Input
                          id="onboard-name"
                          required
                          value={childName}
                          onChange={(event) => setChildName(event.target.value)}
                          placeholder="Leo"
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="onboard-age">Age</Label>
                        <Input
                          id="onboard-age"
                          type="number"
                          value={childAge}
                          onChange={(event) => setChildAge(event.target.value)}
                          placeholder="8"
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <Label>Select an avatar</Label>
                      <div className="grid grid-cols-4 gap-2.5">
                        {avatars.map((avatar) => (
                          <button
                            key={avatar}
                            type="button"
                            onClick={() => setSelectedAvatar(avatar)}
                            aria-pressed={selectedAvatar === avatar}
                            className={cn(
                              'rounded-xl border-2 px-3 py-3.5 text-xs font-extrabold tracking-wide transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                              selectedAvatar === avatar
                                ? 'border-kiddo-blue bg-kiddo-sky/20 text-kiddo-blue'
                                : 'border-slate-200 bg-white text-kiddo-muted hover:border-slate-300'
                            )}
                          >
                            {avatar}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <Label>Family goals</Label>
                      <div className="grid gap-2.5">
                        {availableGoals.map((goal) => {
                          const active = goals.includes(goal.id);
                          return (
                            <button
                              key={goal.id}
                              type="button"
                              onClick={() => toggleGoal(goal.id)}
                              aria-pressed={active}
                              className={cn(
                                'flex items-center justify-between gap-4 rounded-xl border-2 px-4 py-3.5 text-left text-sm font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                active
                                  ? 'border-kiddo-green bg-kiddo-green/10 text-kiddo-navy'
                                  : 'border-slate-200 bg-white text-kiddo-muted hover:border-slate-300'
                              )}
                            >
                              <span>{goal.label}</span>
                              {active ? <Check className="h-4 w-4 text-kiddo-green" /> : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {error ? (
                      <Alert variant="destructive" className="mt-6">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    ) : null}

                    <Button
                      type="button"
                      size="xl"
                      className="mt-7 w-full"
                      onClick={handleOnboardingSubmit}
                      isLoading={loading}
                      disabled={!childName || loading}
                    >
                      {loading ? 'Adding child...' : 'Continue to workspace'}
                      {!loading ? <ArrowRight /> : null}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={handleSkipOnboarding}
                      disabled={loading}
                    >
                      Skip for now
                    </Button>
                  </motion.div>
                )}

                {step === 'role' && (
                  <motion.div
                    key="role"
                    {...fadeProps}
                    transition={{ duration: 0.35, ease }}
                  >
                    <h2 className="text-[28px] font-extrabold tracking-tight text-kiddo-navy">
                      Choose a workspace
                    </h2>
                    <p className="mt-2 text-[15px] text-kiddo-muted">
                      Where would you like to go?
                    </p>

                    <div className="mt-7 grid gap-3">
                      <button
                        type="button"
                        onClick={() => handleRoleSelect('parent')}
                        className="group flex items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white p-5 text-left transition-all hover:border-kiddo-blue hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-kiddo-sky/20 text-kiddo-blue">
                          <Users className="h-6 w-6" />
                        </span>
                        <span className="flex-1">
                          <span className="block text-lg font-extrabold text-kiddo-navy">Parent</span>
                          <span className="text-[13px] font-semibold text-kiddo-muted">
                            Approve, configure and track
                          </span>
                        </span>
                        <ChevronRight className="text-kiddo-muted transition-transform group-hover:translate-x-1" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRoleSelect('child')}
                        className="group flex items-center gap-4 rounded-2xl border-2 border-kiddo-blue bg-kiddo-sky/10 p-5 text-left transition-all hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xs font-extrabold text-kiddo-blue">
                          {storedAvatar}
                        </span>
                        <span className="flex-1">
                          <span className="block text-lg font-extrabold text-kiddo-navy">{storedName}</span>
                          <span className="text-[13px] font-semibold text-kiddo-muted">
                            Missions, streaks and rewards
                          </span>
                        </span>
                        <ChevronRight className="text-kiddo-blue transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Child hint (login step only) */}
              {isLoginStep && (
                <p className="mt-8 text-center text-[13px] leading-relaxed text-kiddo-muted">
                  Is your child using KidDo? They sign in with their magic code{' '}
                  <span className="font-semibold text-kiddo-navy">inside the app</span>.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
