import { useState } from 'react';
import { Check } from 'lucide-react';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { loadRazorpay } from '../utils/loadRazorpay';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  const currentStatus = user?.subscription?.status || 'free';

  const handleCheckout = async (planId) => {
    if (!isAuthenticated) {
      toast('Please login to subscribe', { icon: '🔒' });
      navigate('/login');
      return;
    }

    if (currentStatus === planId) {
      toast.success('You are already on this plan!');
      return;
    }

    try {
      setLoadingPlan(planId);

      // Load Razorpay dynamically
      const res = await loadRazorpay();
      if (!res || !window.Razorpay) {
        toast.error('Razorpay SDK failed to load. Please check your internet connection or disable ad-blockers.');
        setLoadingPlan(null);
        return;
      }

      // 1. Create subscription on backend
      const { data } = await api.post('/subscriptions/create-checkout', {
        planId,
        billingCycle: isYearly ? 'yearly' : 'monthly'
      });

      const options = {
        key: data.data.key,
        subscription_id: data.data.id,
        name: data.data.name,
        description: data.data.description,
        image: "/favicon.png", // Path to your logo
        handler: async function (response) {
          // This only runs on success
          console.log("[RAZORPAY_SUCCESS]", response);
          
          try {
            toast.loading('Verifying payment...', { id: 'verify-payment' });
            
            // 2. Call backend to verify signature and upgrade user
            const verifyRes = await api.post('/subscriptions/verify-subscription', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
              planId: planId
            });

            if (verifyRes.data.success) {
              toast.success('Payment Verified! You have been upgraded.', { id: 'verify-payment' });
              
              // Refresh auth state to reflect new subscription
              useAuthStore.getState().getMe();

              setTimeout(() => {
                navigate('/account');
              }, 2000);
            }
          } catch (verifyError) {
            console.error("[VERIFY_ERROR]", verifyError);
            toast.error('Payment succeeded but verification failed. Please contact support.', { id: 'verify-payment' });
          } finally {
            setLoadingPlan(null);
          }
        },
        prefill: data.data.prefill,
        notes: {
          planId: planId,
        },
        theme: data.data.theme,
        modal: {
          ondismiss: function () {
            setLoadingPlan(null);
            toast('Payment cancelled', { icon: 'ℹ️' });
          }
        },
        // Explicitly force display of all payment methods
        config: {
          display: {
            blocks: {
              upi: {
                name: 'UPI / Google Pay / PhonePe',
                instruments: [{ method: 'upi' }]
              },
              card: {
                name: 'Debit / Credit Card',
                instruments: [{ method: 'card' }]
              },
              netbanking: {
                name: 'Net Banking',
                instruments: [{ method: 'netbanking' }]
              }
            },
            sequence: ['block.upi', 'block.card', 'block.netbanking'],
            preferences: {
              show_default_blocks: true
            }
          }
        },
        remember_customer: true,
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        console.error("[RAZORPAY_FAILED]", response.error);
        toast.error(`Payment Failed: ${response.error.description}`);
        setLoadingPlan(null);
      });

      rzp.open();
    } catch (error) {
      console.error("[CHECKOUT_ERROR]", error);
      const message = error.response?.data?.error || 'Could not initiate checkout';
      toast.error(message);
      setLoadingPlan(null);
    }
  };
  const plans = [
    {
      id: 'free',
      name: 'Free',
      priceMonthly: 0,
      priceYearly: 0,
      features: [
        'Browse 50 basic names',
        'Basic name meanings',
        'Search by gender',
        'Save up to 10 favorites'
      ],
      buttonText: currentStatus === 'free' ? 'Current Plan' : 'Active Plan',
      isPopular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      priceMonthly: 500,
      priceYearly: 4999,
      features: [
        'Unlimited names',
        'Full historical backgrounds',
        'Quranic references',
        'Save unlimited favorites',
        'Famous personalities list',
        'Side-by-side name comparison',
        'Export favorites to PDF',
        'Birth guidance notes'
      ],
      buttonText: currentStatus === 'premium' ? 'Current Plan' : 'Get Premium',
      isPopular: true
    }
  ];

  return (
    <div className="py-8 md:py-16 lg:py-24 max-w-7xl mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text mb-6 tracking-tight">Choose Your Plan</h1>
        <p className="text-base md:text-lg text-text-muted mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto">
          Unlock the rich history, precise Quranic references, and deep meanings of thousands of authentic Islamic names.
        </p>

        {/* Toggle */}
        <div className="inline-flex items-center bg-card border border-border rounded-full p-1.5 relative shadow-inner">
          <button 
            className={`relative z-10 px-6 sm:px-8 py-2.5 rounded-full text-sm font-black transition-all duration-300 ${!isYearly ? 'text-bg' : 'text-text-muted hover:text-text'}`}
            onClick={() => setIsYearly(false)}
          >
            Monthly
          </button>
          <button 
            className={`relative z-10 px-6 sm:px-8 py-2.5 rounded-full text-sm font-black transition-all duration-300 ${isYearly ? 'text-bg' : 'text-text-muted hover:text-text'}`}
            onClick={() => setIsYearly(true)}
          >
            Yearly <span className={`${isYearly ? 'text-bg/80' : 'text-primary'} text-[10px] ml-1.5 bg-white/10 px-1.5 py-0.5 rounded-full`}>-20%</span>
          </button>
          
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-primary rounded-full shadow-lg transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isYearly ? 'translate-x-full' : 'translate-x-0'}`}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-sm md:max-w-4xl mx-auto">
        {plans.map((plan) => {
          const isCurrentPlan = currentStatus === plan.id;
          
          return (
            <div 
              key={plan.id} 
              className={`relative bg-card rounded-3xl border transition-all duration-300 flex flex-col p-6 sm:p-8 ${
                plan.isPopular 
                  ? 'border-primary shadow-2xl shadow-primary/10 scale-100 lg:scale-105 z-10' 
                  : 'border-border'
              } ${isCurrentPlan ? 'ring-2 ring-primary ring-offset-4 ring-offset-bg' : ''}`}
            >
              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-bg px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg whitespace-nowrap">
                  <Check size={12} strokeWidth={3} /> Your Current Plan
                </div>
              )}
              
              {!isCurrentPlan && plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-bg px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl md:text-2xl font-black text-text mb-4 uppercase tracking-wider">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-black text-text">
                    ₹{isYearly ? plan.priceYearly : plan.priceMonthly}
                  </span>
                  <span className="text-text-muted font-medium text-sm">/{isYearly ? 'yr' : 'mo'}</span>
                </div>
                {isYearly && plan.priceYearly > 0 && (
                  <p className="text-[10px] text-primary font-bold mt-2 bg-primary/10 px-2 py-0.5 rounded-full inline-block">
                    Only ₹{(plan.priceYearly / 12).toFixed(2)} / month
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 p-0.5 bg-primary/10 rounded-full">
                      <Check size={14} className="text-primary shrink-0" strokeWidth={4} />
                    </div>
                    <span className="text-sm text-text-muted font-medium leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => !isCurrentPlan && plan.id !== 'free' && handleCheckout(plan.id)}
                disabled={loadingPlan === plan.id || isCurrentPlan || (plan.id === 'free' && currentStatus === 'free')}
                className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all min-h-[48px] ${
                  isCurrentPlan
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 cursor-default'
                    : plan.id === 'free' 
                      ? 'bg-bg text-text-muted cursor-not-allowed border border-border opacity-50' 
                      : plan.isPopular 
                        ? 'bg-primary hover:bg-opacity-90 text-bg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95' 
                        : 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-bg hover:scale-[1.02] active:scale-95'
                }`}
              >
                {loadingPlan === plan.id ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-bg border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : plan.buttonText}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pricing;