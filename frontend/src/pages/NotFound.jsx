import { Link } from 'react-router-dom';
import { Home, MoveLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <Helmet>
        <title>Page Not Found | IslamicNames</title>
        <meta name="description" content="The page you are looking for does not exist on IslamicNames." />
        <link rel="canonical" href="https://www.islamicnames.in/404" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Page Not Found | IslamicNames" />
        <meta property="og:description" content="The page you are looking for does not exist on IslamicNames." />
        <meta property="og:url" content="https://www.islamicnames.in/404" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.islamicnames.in/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Page Not Found | IslamicNames" />
        <meta name="twitter:description" content="The page you are looking for does not exist on IslamicNames." />
        <meta name="twitter:image" content="https://www.islamicnames.in/og-image.png" />
      </Helmet>
      <div className="relative mb-8">
        <h1 className="text-9xl font-black text-primary/10 select-none">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-3xl font-bold text-text">Page Not Found</p>
        </div>
      </div>
      
      <p className="text-text-muted mb-10 max-w-md mx-auto">
        Oops! The page you're looking for doesn't exist or has been moved. 
        Let's get you back on track.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          to="/" 
          className="flex items-center justify-center gap-2 bg-primary text-bg px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <Home size={20} /> Back to Home
        </Link>
        <button 
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-2 bg-card border border-border text-text px-8 py-3 rounded-lg font-bold hover:bg-bg transition-all"
        >
          <MoveLeft size={20} /> Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;