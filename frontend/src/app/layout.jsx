import '../index.css';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'Islamic Names | Meaningful Names for Boys & Girls | IslamicNames',
  description: 'Discover thousands of meaningful Islamic names for boys and girls. Search by Quranic reference, Arabic roots, and historical significance.',
  openGraph: {
    type: 'website',
    url: 'https://www.islamicnames.in/',
    title: 'Islamic Names | Meaningful Names for Boys & Girls',
    description: 'Explore thousands of authentic Islamic names with meanings, Quranic references, and historical contexts. Free for everyone.',
    images: [{ url: 'https://www.islamicnames.in/logo-120.webp' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Islamic Names | Meaningful Names for Boys & Girls',
    description: 'Explore thousands of authentic Islamic names with meanings, Quranic references, and historical contexts.',
    images: ['https://www.islamicnames.in/logo-120.webp'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
