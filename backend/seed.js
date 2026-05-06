require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Name = require('./src/models/Name');

const sampleNames = [
  {
    nameEnglish: 'Muhammad',
    nameArabic: 'محمد',
    gender: 'boy',
    meaning: 'Praiseworthy, Commendable',
    origin: 'Arabic',
    history: 'The name of the final Prophet of Islam. It is the most popular name in the world.',
    pronunciation: 'moo-HAH-med',
    isPremium: false,
    isActive: true
  },
  {
    nameEnglish: 'Aisha',
    nameArabic: 'عائشة',
    gender: 'girl',
    meaning: 'Living, Prosperous, Alive',
    origin: 'Arabic',
    history: 'Wife of Prophet Muhammad (PBUH) and a prominent scholar in Islamic history.',
    pronunciation: 'AH-ee-sha',
    isPremium: false,
    isActive: true
  },
  {
    nameEnglish: 'Omar',
    nameArabic: 'عمر',
    gender: 'boy',
    meaning: 'Flourishing, Long-lived',
    origin: 'Arabic',
    history: 'The second Caliph of Islam, known for his justice.',
    pronunciation: 'OH-mar',
    isPremium: true,
    isActive: true
  },
  {
    nameEnglish: 'Fatima',
    nameArabic: 'فاطمة',
    gender: 'girl',
    meaning: 'To abstain, Chaste',
    origin: 'Arabic',
    history: 'Daughter of Prophet Muhammad (PBUH).',
    pronunciation: 'FAH-tee-mah',
    isPremium: false,
    isActive: true
  },
  {
    nameEnglish: 'Ali',
    nameArabic: 'علي',
    gender: 'boy',
    meaning: 'High, Elevated, Champion',
    origin: 'Arabic',
    history: 'Cousin and son-in-law of Prophet Muhammad (PBUH), known for his bravery.',
    pronunciation: 'AH-lee',
    isPremium: false,
    isActive: true
  },
  {
    nameEnglish: 'Maryam',
    nameArabic: 'مريم',
    gender: 'girl',
    meaning: 'Pious, Mother of Jesus',
    origin: 'Hebrew/Arabic',
    history: 'The mother of Prophet Isa (Jesus). An entire chapter in the Quran is named after her.',
    pronunciation: 'MAR-yam',
    isPremium: true,
    isActive: true
  },
  {
    nameEnglish: 'Zayd',
    nameArabic: 'زيد',
    gender: 'boy',
    meaning: 'Abundance, Growth',
    origin: 'Arabic',
    history: 'Adopted son of the Prophet Muhammad (PBUH), the only companion mentioned by name in the Quran.',
    pronunciation: 'ZAYD',
    isPremium: false,
    isActive: true
  },
  {
    nameEnglish: 'Noor',
    nameArabic: 'نور',
    gender: 'unisex',
    meaning: 'Light, Illumination',
    origin: 'Arabic',
    history: 'A common name symbolizing the light of guidance. Also one of the names of Allah (Al-Noor).',
    pronunciation: 'NOOR',
    isPremium: false,
    isActive: true
  }
];

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB at:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to Database');
    
    // Clear existing to avoid duplicates
    await Name.deleteMany();
    console.log('Cleared existing names.');
    
    // Insert new
    await Name.insertMany(sampleNames);
    console.log('Successfully seeded database with sample names!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDB();