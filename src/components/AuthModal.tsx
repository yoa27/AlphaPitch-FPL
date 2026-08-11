import React, { useState } from 'react';
import { Language, User } from '../types';
import { TRANSLATIONS } from '../lib/i18n';
import { validateEmail, generateVerificationCode, verifyOTP } from '../lib/authService';
import { 
  X, 
  Mail, 
  ShieldCheck, 
  KeyRound, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Lock
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  language: Language;
  gatekeeperReason?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  language,
  gatekeeperReason
}) => {
  const t = TRANSLATIONS[language];
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [simulatedOTP, setSimulatedOTP] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const validation = validateEmail(email);
    if (!validation.isValid) {
      setErrorMsg(validation.errorKey ? t[validation.errorKey] : t.invalidEmailError);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const code = generateVerificationCode(email);
      setSimulatedOTP(code);
      setStep('otp');
      setIsSubmitting(false);
    }, 400);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (otpCode.trim().length !== 6) {
      setErrorMsg(t.invalidOtpError);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = verifyOTP(email, otpCode);
      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setErrorMsg(t.invalidOtpError);
      }
      setIsSubmitting(false);
    }, 400);
  };

  const handleResend = () => {
    const code = generateVerificationCode(email);
    setSimulatedOTP(code);
    setErrorMsg(null);
  };

  const handleReset = () => {
    setStep('email');
    setOtpCode('');
    setErrorMsg(null);
    setSimulatedOTP(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-surface-container-high border border-outline/30 rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden flex flex-col">
        {/* Glow effect header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-tertiary to-primary"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-highest transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
            {step === 'email' ? <Lock className="w-5 h-5" /> : <KeyRound className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="font-display font-black text-lg text-on-surface leading-tight">
              {step === 'email' 
                ? (mode === 'login' ? t.authModalTitleLogin : t.authModalTitleSignup) 
                : t.otpStepTitle}
            </h2>
            <p className="text-xs text-outline font-sans mt-0.5">
              {step === 'email' ? t.authModalSubtitle : `${t.otpStepSubtitle} ${email}`}
            </p>
          </div>
        </div>

        {/* Contextual Gatekeeper Notice if triggered by Watchlist */}
        {gatekeeperReason && step === 'email' && (
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-xs text-amber-400">
            <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{gatekeeperReason}</span>
          </div>
        )}

        {/* Simulated Live OTP Toast for Instant Demonstration */}
        {simulatedOTP && step === 'otp' && (
          <div className="mb-4 p-3 bg-primary/10 border border-primary/40 rounded-xl flex flex-col gap-1 text-xs text-primary animate-in slide-in-from-top-2">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.otpNotificationTitle}</span>
            </div>
            <div className="font-mono text-base font-black tracking-widest text-on-surface">
              {t.otpNotificationBody} <span className="text-primary bg-surface-container-highest px-2 py-0.5 rounded ml-1">{simulatedOTP}</span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-secondary/15 border border-secondary/40 rounded-xl flex items-start gap-2 text-xs text-secondary animate-in fade-in">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: EMAIL INPUT */}
        {step === 'email' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-outline mb-1.5 font-sans">
                {t.emailLabel}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  type="email"
                  required
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline/30 rounded-xl pl-9 pr-3 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary font-mono placeholder:text-outline/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-background font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <span>{t.btnContinue}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Mode Switcher */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-xs text-outline hover:text-primary transition-colors cursor-pointer"
              >
                {mode === 'login' ? t.needAccount : t.alreadyHaveAccount}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-outline mb-1.5 font-sans">
                {t.otpCodeLabel}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder={t.otpPlaceholder}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-surface-container-low border border-outline/30 rounded-xl pl-9 pr-3 py-2.5 text-lg font-black tracking-widest text-primary text-center focus:outline-none focus:border-primary font-mono placeholder:text-outline/40 placeholder:tracking-normal"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || otpCode.length !== 6}
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-background font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.btnVerify}</span>
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={handleReset}
                className="text-outline hover:text-on-surface cursor-pointer"
              >
                ← Changer d'email
              </button>

              <button
                type="button"
                onClick={handleResend}
                className="text-primary hover:underline font-semibold cursor-pointer"
              >
                {t.resendOtp}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
