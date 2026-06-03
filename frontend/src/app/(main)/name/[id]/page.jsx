import NameDetailClient from '@/components/NameDetailClient';

async function getName(id) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  const res = await fetch(`${baseUrl}/names/${id}`, { next: { revalidate: 3600 } });
  
  if (!res.ok) {
    return null;
  }
  
  const data = await res.json();
  return data?.data;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const name = await getName(id);

  if (!name) {
    return {
      title: 'Name Not Found | IslamicNames',
    };
  }

  return {
    title: `${name.nameEnglish} (${name.nameArabic}) Meaning, Origin & History | IslamicNames`,
    description: `Find the meaning, origin, pronunciation, and Quranic reference for the Islamic name ${name.nameEnglish}. Explore deep historical background and naming etiquette. Search Islamic names with meanings.`,
    alternates: {
      canonical: `https://www.islamicnames.in/name/${name.slug || id}`,
    },
    robots: name.history ? 'index, follow' : 'noindex, follow',
    openGraph: {
      title: `${name.nameEnglish} (${name.nameArabic}) Meaning & History | IslamicNames`,
      description: `Discover the deep meaning and historical context of the name ${name.nameEnglish}. Verified Islamic name with Quranic roots.`,
      url: `https://www.islamicnames.in/name/${name.slug || id}`,
      type: 'article',
      images: [
        {
          url: 'https://www.islamicnames.in/logo-120.webp',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name.nameEnglish} (${name.nameArabic}) Meaning & History | IslamicNames`,
      description: `Discover the deep meaning and historical context of the name ${name.nameEnglish}.`,
      images: ['https://www.islamicnames.in/logo-120.webp'],
    },
  };
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <NameDetailClient params={resolvedParams} />;
}
