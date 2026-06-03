import { useEffect, useRef, useState } from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';

// Poll every 2s, give up after 30s (15 attempts)
const POLL_INTERVAL_MS = 2000;
const MAX_ATTEMPTS     = 15;

const Success = () => {
  const navigate    = useNavigate();
  const { user, updateUser } = useAuthStore();

  // 'waiting' | 'confirmed' | 'timeout'
  const [status, setStatus]   = useState('waiting');
  const [attempts, setAttempts] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const res = await api.get('/subscriptions/status');
        const sub = res.data?.data;

        // Webhook has fired — subscription is no longer free
        if (sub?.status && sub.status !== 'free' && sub.status !== 'cancelled') {
          clearInterval(intervalRef.current);
          setStatus('confirmed');

          // Sync Zustand store so Account page shows the right plan immediately
          // Fix: Ensure we pass the updated user object, not a function
          updateUser({ ...user, subscription: sub });

          // Give user 2s to read the confirmation, then redirect
          setTimeout(() => navigate('/account'), 2000);
          return;
        }
      } catch (err) {
        // Network/auth error — don't crash, just keep polling
        console.warn('[Success] Status poll failed:', err.message);
      }

      setAttempts((prev) => {
        const next = prev + 1;
        if (next >= MAX_ATTEMPTS) {
          clearInterval(intervalRef.current);
          setStatus('timeout');
        }
        return next;
      });
    };

    // Run once immediately, then every POLL_INTERVAL_MS
    checkSubscription();
    intervalRef.current = setInterval(checkSubscription, POLL_INTERVAL_MS);

    return () => clearInterval(intervalRef.current);
  }, [user, updateUser, navigate]);

  // ── UI states ────────────────────────────────────────────────────────────────

  if (status === 'confirmed') {
    return (
      <Screen>
        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-5" />
        <h1 className="text-2xl font-black text-text mb-2">You're all set!</h1>
        <p className="text-text-muted text-sm mb-1">Your subscription is active.</p>
        <p className="text-text-muted text-xs">Taking you to your account…</p>
      </Screen>
    );
  }

  if (status === 'timeout') {
    return (
      <Screen>
        <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-5" />
        <h1 className="text-2xl font-black text-text mb-3">Almost there…</h1>
        <p className="text-text-muted text-sm mb-6 max-w-xs mx-auto leading-relaxed">
          Payment received! Your subscription may take a minute to activate.
          If your plan doesn't update within 5 minutes, please contact support.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/account')}
            className="px-6 py-3 bg-primary text-bg rounded-xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Go to Account
          </button>
          <button
            onClick={() => {
              setStatus('waiting');
              setAttempts(0);
            }}
            className="px-6 py-3 border border-border text-text-muted rounded-xl font-black text-sm uppercase tracking-widest hover:bg-card transition-colors"
          >
            Check Again
          </button>
        </div>
      </Screen>
    );
  }

  // status === 'waiting'
  const progress = Math.round((attempts / MAX_ATTEMPTS) * 100);

  return (
    <Screen>
      {/* Animated ring */}
      <div className="relative w-20 h-20 mx-auto mb-6">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor"
            className="text-border" strokeWidth="5" />
          <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor"
            className="text-primary transition-all duration-500"
            strokeWidth="5"
            strokeDasharray={`${2 * Math.PI * 34}`}
            strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
            strokeLinecap="round" />
        </svg>
        <Clock className="absolute inset-0 m-auto w-8 h-8 text-primary" />
      </div>

      <h1 className="text-2xl font-black text-text mb-2">Confirming your payment…</h1>
      <p className="text-text-muted text-sm mb-6 max-w-xs mx-auto leading-relaxed">
        Please wait while we activate your subscription.
        This usually takes just a few seconds.
      </p>

      {/* Animated dots */}
      <div className="flex justify-center gap-1.5 mb-8">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-primary opacity-40"
            style={{ animation: `bounce 1.2s ${i * 0.2}s infinite` }}
          />
        ))}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </Screen>
  );
};

// Shared centered wrapper that matches your site's card style
const Screen = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center px-4 bg-bg">
    <div className="text-center bg-card border border-border rounded-3xl p-10 max-w-sm w-full shadow-sm">
      {children}
    </div>
  </div>
);

export default Success;