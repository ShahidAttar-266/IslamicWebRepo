import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';

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

      // Use the user and token directly from the register response
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
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-card p-8 rounded-2xl border border-border shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Create Account</h1>
          <p className="text-text-muted">Join to save favorites and unlock features</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Full Name</label>
            <input 
              {...register('name')} 
              className={`w-full bg-bg border ${errors.name ? 'border-danger' : 'border-border'} focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-2.5 text-text outline-none transition-all`}
              placeholder="John Doe"
            />
            {errors.name && <p className="text-danger text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Email</label>
            <input 
              {...register('email')} 
              type="email" 
              className={`w-full bg-bg border ${errors.email ? 'border-danger' : 'border-border'} focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-2.5 text-text outline-none transition-all`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-danger text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Password</label>
            <input 
              {...register('password')} 
              type="password" 
              className={`w-full bg-bg border ${errors.password ? 'border-danger' : 'border-border'} focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-2.5 text-text outline-none transition-all`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-danger text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Confirm Password</label>
            <input 
              {...register('confirmPassword')} 
              type="password" 
              className={`w-full bg-bg border ${errors.confirmPassword ? 'border-danger' : 'border-border'} focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-2.5 text-text outline-none transition-all`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="text-danger text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-opacity-90 text-bg font-bold py-3 rounded-lg transition-all mt-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-text-muted">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google login failed')}
            useOneTap
            theme="filled_blue"
            shape="pill"
            text="signup_with"
          />
        </div>

        <p className="text-center text-text-muted text-sm mt-6">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;