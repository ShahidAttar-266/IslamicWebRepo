import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect to account after 5 seconds
    const timer = setTimeout(() => {
      navigate('/account');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-4">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your subscription. Your account has been upgraded successfully.
        </p>
        <p className="text-sm text-gray-500">
          Redirecting to your account in 5 seconds...
        </p>
        <button
          onClick={() => navigate('/account')}
          className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Go to Account Now
        </button>
      </div>
    </div>
  );
};

export default Success;