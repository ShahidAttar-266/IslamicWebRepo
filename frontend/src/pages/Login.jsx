import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';

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

      // After login, fetch user profile (cookie is set automatically)
      const userRes = await api.get('/auth/me');

      setAuth(userRes.data.data);
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (err) {      toast.error(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-card p-8 rounded-2xl border border-border shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-text mb-2">Welcome Back</h1>
          <p className="text-text-muted italic text-sm">Meaningful Names. Timeless Legacy.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-text">Password</label>
              <button 
                type="button"
                onClick={() => toast.success('Password reset feature coming soon!')}
                className="text-sm text-text-muted hover:text-primary transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <input 
              {...register('password')} 
              type="password" 
              className={`w-full bg-bg border ${errors.password ? 'border-danger' : 'border-border'} focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-2.5 text-text outline-none transition-all`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-danger text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-opacity-90 text-bg font-bold py-3 rounded-lg transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-text-muted text-sm mt-6">
          Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;