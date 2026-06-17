import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import { Helmet } from 'react-helmet-async';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const Register = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password
      });

      const { user, token } = res.data;
      setAuth(user, token);

      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('/auth/google', {
        idToken: credentialResponse.credential
      });
      const { user, token } = res.data;
      setAuth(user, token);
      toast.success('Successfully registered with Google!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Google registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-4 sm:mt-10 px-4 sm:px-0">
      <Helmet>
        <title>Register | IslamicNames</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Create an account on IslamicNames to save names, receive recommendations, and create custom lists." />
        <link rel="canonical" href="https://www.islamicnames.in/register" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Register | IslamicNames" />
        <meta property="og:description" content="Create an account on IslamicNames to save names, receive recommendations, and create custom lists." />
        <meta property="og:url" content="https://www.islamicnames.in/register" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.islamicnames.in/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Register | IslamicNames" />
        <meta name="twitter:description" content="Create an account on IslamicNames to save names, receive recommendations, and create custom lists." />
        <meta name="twitter:image" content="https://www.islamicnames.in/og-image.png" />

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.islamicnames.in/" },
              { "@type": "ListItem", "position": 2, "name": "Register", "item": "https://www.islamicnames.in/register" }
            ]
          })}
        </script>
      </Helmet>
      <div className="bg-card p-5 sm:p-8 rounded-3xl border border-border shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-text mb-2">Create Account</h1>
          <p className="text-text-muted italic text-sm">Join to save favorites & compare names easily</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-text mb-2">Full Name</label>
            <input 
              {...register('name')} 
              className={`w-full bg-bg border ${errors.name ? 'border-danger' : 'border-border'} focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3.5 text-text outline-none transition-all text-base`}
              placeholder="John Doe"
            />
            {errors.name && <p className="text-danger text-xs font-bold mt-2 ml-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-text mb-2">Email Address</label>
            <input 
              {...register('email')} 
              type="email" 
              className={`w-full bg-bg border ${errors.email ? 'border-danger' : 'border-border'} focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3.5 text-text outline-none transition-all text-base`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-danger text-xs font-bold mt-2 ml-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-text mb-2">Password</label>
            <input 
              {...register('password')} 
              type="password" 
              className={`w-full bg-bg border ${errors.password ? 'border-danger' : 'border-border'} focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3.5 text-text outline-none transition-all text-base`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-danger text-xs font-bold mt-2 ml-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-text mb-2">Confirm Password</label>
            <input 
              {...register('confirmPassword')} 
              type="password" 
              className={`w-full bg-bg border ${errors.confirmPassword ? 'border-danger' : 'border-border'} focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3.5 text-text outline-none transition-all text-base`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="text-danger text-xs font-bold mt-2 ml-1">{errors.confirmPassword.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-opacity-90 text-bg font-black py-4 rounded-xl transition-all mt-4 disabled:opacity-50 min-h-[48px] uppercase tracking-widest shadow-lg shadow-primary/20"
          >
            {isSubmitting ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
            <span className="px-4 bg-card text-text-muted">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google registration failed')}
            useOneTap
            theme="filled_blue"
            shape="pill"
            text="signup_with"
          />
        </div>

        <p className="text-center text-text-muted text-sm mt-8">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;