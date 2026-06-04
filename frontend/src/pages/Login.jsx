import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import { Helmet } from 'react-helmet-async';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/login', data);
      const { user, token } = res.data;
      setAuth(user, token);
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('/auth/google', {
        idToken: credentialResponse.credential
      });
      const { user, token } = res.data;
      setAuth(user, token);
      toast.success('Successfully logged in with Google!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Google login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-4 sm:mt-10 px-4 sm:px-0">
      <Helmet>
        <title>Login | IslamicNames</title>
        <meta name="description" content="Sign in to your IslamicNames account to save your favorite names, access premium tools, and more." />
        <link rel="canonical" href="https://www.islamicnames.in/login" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Login | IslamicNames" />
        <meta property="og:description" content="Sign in to your IslamicNames account to save your favorite names, access premium tools, and more." />
        <meta property="og:url" content="https://www.islamicnames.in/login" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.islamicnames.in/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Login | IslamicNames" />
        <meta name="twitter:description" content="Sign in to your IslamicNames account to save your favorite names, access premium tools, and more." />
        <meta name="twitter:image" content="https://www.islamicnames.in/og-image.png" />
      </Helmet>
      <div className="bg-card p-5 sm:p-8 rounded-3xl border border-border shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-text mb-2">Welcome Back</h1>
          <p className="text-text-muted italic text-sm">Meaningful Names. Timeless Legacy.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-text">Password</label>
              <button 
                type="button"
                onClick={() => toast.success('Password reset feature coming soon!')}
                className="text-xs font-bold text-text-muted hover:text-primary transition-colors cursor-pointer"
              >
                Forgot?
              </button>
            </div>
            <input 
              {...register('password')} 
              type="password" 
              className={`w-full bg-bg border ${errors.password ? 'border-danger' : 'border-border'} focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3.5 text-text outline-none transition-all text-base`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-danger text-xs font-bold mt-2 ml-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-opacity-90 text-bg font-black py-4 rounded-xl transition-all disabled:opacity-50 min-h-[48px] uppercase tracking-widest shadow-lg shadow-primary/20"
          >
            {isSubmitting ? 'Verifying...' : 'Login'}
          </button>
        </form>

        <div className="relative my-10">
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
            onError={() => toast.error('Google login failed')}
            useOneTap
            theme="filled_blue"
            shape="pill"
            text="signin_with"
          />
        </div>

        <p className="text-center text-text-muted text-sm mt-8">
          Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;