import { useState } from 'react';
import { Check } from 'lucide-react';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

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

    // Logic: Premium users cannot buy Basic
    if (currentStatus === 'premium' && planId === 'basic') {
      toast.error('You already have a higher tier plan (Premium)');
      return;
    }

    try {
      setLoadingPlan(planId);
      const res = await api.post('/subscriptions/create-checkout', {
        planId,
        billingCycle: isYearly ? 'yearly' : 'monthly'
      });
      
      // Redirect to Stripe checkout
      window.location.assign(res.data.url);
    } catch {
      toast.error('Could not initiate checkout');
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
      id: 'basic',
      name: 'Basic',
      priceMonthly: 4.99,
      priceYearly: 39.99,
      features: [
        'Unlimited names',
        'Full historical backgrounds',
        'Quranic references',
        'Save unlimited favorites'
      ],
      buttonText: currentStatus === 'premium' 
        ? 'Already have Premium' 
        : currentStatus === 'basic' ? 'Current Plan' : 'Upgrade to Basic',
      isPopular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      priceMonthly: 9.99,
      priceYearly: 79.99,
      features: [
        'Everything in Basic',
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
    <div className="py-12 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">Choose Your Plan</h1>
        <p className="text-lg text-text-muted mb-8">
          Unlock the rich history, precise Quranic references, and deep meanings of thousands of authentic Islamic names.
        </p>

        {/* Toggle */}
        <div className="inline-flex items-center bg-card border border-border rounded-full p-1 relative">
          <button 
            className={`relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-colors ${!isYearly ? 'text-bg' : 'text-text-muted'}`}
            onClick={() => setIsYearly(false)}
          >
            Monthly
          </button>
          <button 
            className={`relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-colors ${isYearly ? 'text-bg' : 'text-text-muted'}`}
            onClick={() => setIsYearly(true)}
          >
            Yearly <span className="text-accent text-xs ml-1">-20%</span>
          </button>
          
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary rounded-full transition-transform duration-300 ease-in-out ${isYearly ? 'translate-x-full' : 'translate-x-0'}`}
          ></div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isCurrentPlan = currentStatus === plan.id;
          const isDowngrade = currentStatus === 'premium' && plan.id === 'basic';
          
          return (
            <div 
              key={plan.id} 
              className={`relative bg-card rounded-2xl border ${plan.isPopular ? 'border-primary shadow-xl shadow-primary/10' : 'border-border'} ${isCurrentPlan ? 'ring-2 ring-primary ring-offset-4 ring-offset-bg' : ''} p-8 flex flex-col`}
            >
              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-bg px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                  <Check size={12} strokeWidth={3} /> Your Current Plan
                </div>
              )}
              
              {!isCurrentPlan && plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-bg px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-text mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-text">
                  ${isYearly ? plan.priceYearly : plan.priceMonthly}
                </span>
                <span className="text-text-muted">/{isYearly ? 'yr' : 'mo'}</span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={20} className="text-primary shrink-0" />
                    <span className="text-text-muted">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => !isCurrentPlan && !isDowngrade && plan.id !== 'free' && handleCheckout(plan.id)}
                disabled={loadingPlan === plan.id || isCurrentPlan || isDowngrade || (plan.id === 'free' && currentStatus === 'free')}
                className={`w-full py-3 rounded-lg font-bold transition-all ${
                  isCurrentPlan
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 cursor-default'
                    : isDowngrade
                      ? 'bg-bg text-text-muted cursor-not-allowed border border-border opacity-50'
                      : plan.id === 'free' 
                        ? 'bg-bg text-text-muted cursor-not-allowed border border-border' 
                        : plan.isPopular 
                          ? 'bg-primary hover:bg-opacity-90 text-bg shadow-lg shadow-primary/20' 
                          : 'bg-card border-2 border-primary text-primary hover:bg-primary hover:text-bg'
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