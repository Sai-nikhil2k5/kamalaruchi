import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    signIn, 
    signUp, 
    signInPreviewDemo,
    isOperationNotAllowed 
  } = useAuth();

  const [isLogin, setIsLogin] = useState(authModalMode === 'signin');
  const [email, setEmail] = useState('kruchimade@gmail.com');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('Kamala Ruchi');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOperationNotAllowedGuide, setShowOperationNotAllowedGuide] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Sync mode whenever modal opens
  React.useEffect(() => {
    setIsLogin(authModalMode === 'signin');
    setIsForgotPassword(false);
    setResetSent(false);
    setError(null);
    setShowOperationNotAllowedGuide(isOperationNotAllowed);
    if (!email) {
      setEmail('kruchimade@gmail.com');
    }
  }, [authModalMode, isAuthModalOpen, isOperationNotAllowed]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowOperationNotAllowedGuide(false);

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    if (!isLogin && password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, displayName);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Authentication failed';
      if (errorMsg.includes('auth/operation-not-allowed') || errorMsg.includes('operation-not-allowed')) {
        setShowOperationNotAllowedGuide(true);
        setError(null);
      } else if (errorMsg.includes('auth/invalid-credential') || errorMsg.includes('auth/wrong-password')) {
        setError('Invalid email or password. Please verify and try again.');
      } else if (errorMsg.includes('auth/email-already-in-use')) {
        setError('This email is already registered. Please sign in instead.');
      } else if (errorMsg.includes('auth/invalid-email')) {
        setError('Please enter a valid email address.');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetSent(false);

    if (!email) {
      setError('Please provide your email address to reset password.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to send reset email';
      if (errorMsg.includes('auth/user-not-found') || errorMsg.includes('auth/invalid-email')) {
        setError('No account found with this email.');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('kruchimade@gmail.com');
    setPassword('AdminKamala2026!');
    setIsLogin(false);
    setDisplayName('Kamala Ruchi (Admin)');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#fffbf6] text-[#241a04] rounded-2xl shadow-2xl border-2 border-[#e3c193] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-[#241a04] px-6 py-5 text-white flex items-center justify-between border-b border-[#ebd3aa]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ffebcb] p-0.5 border border-[#e3c193] overflow-hidden shrink-0">
              <img src="/logo_icon_chef.jpg" alt="Kamala Ruchi Matriarch" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-headline-sm text-xl text-[#ffefd5]">
                {isForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create an Account'}
              </h3>
              <p className="text-[11px] text-[#e3c193] tracking-wide">
                {isForgotPassword
                  ? 'We will send you a link to reset your password'
                  : isLogin
                    ? 'Sign in to order heirloom Andhra spices'
                    : 'Join the Kamala Ruchi Spice Family'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="text-[#ffdcc2] hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-6 max-h-[85vh] overflow-y-auto">
          {/* Operation Not Allowed Diagnostic & Immediate Fix Banner */}
          {showOperationNotAllowedGuide && (
            <div className="mb-5 p-4 rounded-xl bg-[#fff8e1] border-2 border-[#e6a817] text-[#533f03] text-xs space-y-2.5 shadow-sm">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#b78103] shrink-0 mt-0.5">
                  admin_panel_settings
                </span>
                <div>
                  <h4 className="font-bold text-sm text-[#856404]">
                    Firebase Setup: Enable Email/Password Sign-In
                  </h4>
                  <p className="text-[11px] text-[#6d5203] mt-0.5">
                    Firebase returned <code className="bg-black/10 px-1 py-0.5 rounded font-mono text-[10px]">auth/operation-not-allowed</code> because the <strong>Email/Password</strong> provider is not toggled on in the Firebase Console.
                  </p>
                </div>
              </div>

              <div className="bg-white/80 p-3 rounded-lg border border-[#ebd3aa] text-[11px] space-y-1.5 text-[#423101]">
                <p className="font-bold text-[#856404]">Quick 30-Second Fix in Firebase Console:</p>
                <ol className="list-decimal list-inside space-y-1 pl-1">
                  <li>
                    Open the{' '}
                    <a 
                      href="https://console.firebase.google.com/project/gen-lang-client-0688045035/authentication/providers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#af1820] font-bold underline hover:text-[#8e1319]"
                    >
                      Firebase Console &rarr; Authentication &rarr; Sign-in method
                    </a>
                  </li>
                  <li>Click on <strong>Email/Password</strong> (under Native providers).</li>
                  <li>Toggle the <strong>Enable</strong> switch to ON and click <strong>Save</strong>.</li>
                </ol>
              </div>

              <div className="pt-2 border-t border-[#e6a817]/40">
                <p className="text-[11px] font-bold text-[#856404] mb-1.5">
                  Or continue immediately without waiting:
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => signInPreviewDemo('kruchimade@gmail.com', 'Kamala Ruchi (Admin)')}
                    className="flex-1 bg-[#af1820] hover:bg-[#8e1319] text-white py-2 px-3 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">shield_person</span>
                    <span>Sign in as Admin (kruchimade@gmail.com)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => signInPreviewDemo('customer@kamalaruchi.com', 'Smt. Lakshmi Devi')}
                    className="bg-[#5a431f] hover:bg-[#3b2f16] text-[#ffddb1] py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">person</span>
                    <span>Customer Demo</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#410002] text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#ba1a1a] shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          {isForgotPassword ? (
            resetSent ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                  <span className="material-symbols-outlined text-3xl">mark_email_read</span>
                </div>
                <h3 className="font-headline-sm text-xl text-[#241a04] mb-2">Check Your Email</h3>
                <p className="text-sm text-[#5a431f] mb-6">
                  We've sent a password reset link to <strong>{email}</strong>.
                </p>
                <button
                  onClick={() => setIsForgotPassword(false)}
                  className="bg-[#af1820] hover:bg-[#8e1319] text-white py-2 px-6 rounded-xl font-bold transition-all shadow-md cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#5a431f] uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7b5804]">
                      <span className="material-symbols-outlined text-[18px]">mail</span>
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#d6be95] rounded-lg text-sm text-[#241a04] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#af1820]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-[#af1820] hover:bg-[#8e1319] text-white py-2.5 px-4 rounded-xl font-bold tracking-wide transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-block animate-spin material-symbols-outlined text-[18px]">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  )}
                  <span>Send Reset Link</span>
                </button>
                <div className="mt-4 pt-3 border-t border-[#ebd3aa]/60 text-center">
                  <button
                    type="button"
                    onClick={() => { setIsForgotPassword(false); setError(null); }}
                    className="text-xs font-bold text-[#af1820] hover:underline cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )
          ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-[#5a431f] uppercase tracking-wider mb-1">
                  Full Name / Household Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7b5804]">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                  </span>
                  <input
                    type="text"
                    required={!isLogin}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Smt. Lakshmi Devi"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#d6be95] rounded-lg text-sm text-[#241a04] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#af1820]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#5a431f] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7b5804]">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#d6be95] rounded-lg text-sm text-[#241a04] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#af1820]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-[#5a431f] uppercase tracking-wider">
                  Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => { setIsForgotPassword(true); setError(null); }}
                    className="text-[11px] text-[#af1820] cursor-pointer hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7b5804]">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? '••••••••' : 'Min. 6 characters'}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#d6be95] rounded-lg text-sm text-[#241a04] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#af1820]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#af1820] hover:bg-[#8e1319] text-white py-2.5 px-4 rounded-xl font-bold tracking-wide transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block animate-spin material-symbols-outlined text-[18px]">
                  progress_activity
                </span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">
                  {isLogin ? 'login' : 'how_to_reg'}
                </span>
              )}
              <span>{isLogin ? 'Sign In & Continue' : 'Create My Account'}</span>
            </button>
          </form>

          {/* Toggle Login / Signup */}
          <div className="mt-4 pt-3 border-t border-[#ebd3aa]/60 text-center">
            <p className="text-xs text-[#5a431f]">
              {isLogin ? "Don't have an account yet?" : 'Already have a Kamala Ruchi account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="font-bold text-[#af1820] hover:underline cursor-pointer ml-1"
              >
                {isLogin ? 'Create one now' : 'Sign in here'}
              </button>
            </p>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
};
