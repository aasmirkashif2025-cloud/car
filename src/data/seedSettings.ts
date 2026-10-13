import { ShowroomSettings, HeroSlideConfig } from '../types/crm';
import fortunerImg from '../assets/images/toyota_fortuner_legender.webp';
import lc300Img from '../assets/images/toyota_land_cruiser_300.webp';
import civicRsImg from '../assets/images/honda_civic_rs.webp';
import altisGrandeImg from '../assets/images/toyota_corolla_altis.webp';
import havalH6Img from '../assets/images/haval_h6_hev.webp';
import sportageImg from '../assets/images/kia_sportage_awd.webp';
import oshanX7Img from '../assets/images/changan_oshan_x7.webp';
import jaecooJ7Img from '../assets/images/jaecoo_j7.webp';
import swiftImg from '../assets/images/suzuki_swift_glx.webp';
import yarisImg from '../assets/images/toyota_yaris_ativ.webp';
import cityImg from '../assets/images/honda_city_aspire.webp';

export const DEFAULT_HERO_SLIDES: HeroSlideConfig[] = [
  {
    id: 'slide-fortuner-legender',
    name: 'Toyota Fortuner Legender 4x4',
    category: 'PRESTIGE 4X4 SUV',
    provenance: '2024 Toyota Fortuner Legender 2.8 Diesel · Attitude Black & Super White',
    atelier: 'Lahore Flagship Atelier',
    image: fortunerImg,
    objectPosition: 'center',
    vehicleId: 'toyota-fortuner-legender-2024',
    enabled: true,
  },
  {
    id: 'slide-lc300',
    name: 'Toyota Land Cruiser 300 ZX',
    category: 'JAPANESE CBU IMPORT',
    provenance: '2024 Toyota Land Cruiser 300 ZX · USS Tokyo Grade 5.0 CBU',
    atelier: 'Islamabad Diplomatic Lounge',
    image: lc300Img,
    objectPosition: 'center',
    vehicleId: 'toyota-land-cruiser-lc300-2024',
    enabled: true,
  },
  {
    id: 'slide-civic-rs',
    name: 'Honda Civic RS 1.5 Turbo',
    category: 'LOCAL CKD ASSEMBLED',
    provenance: '2024 Honda Civic RS 1.5 VTEC Turbo · White Orchid Pearl',
    atelier: 'Lahore Flagship Atelier',
    image: civicRsImg,
    objectPosition: 'center right',
    vehicleId: 'honda-civic-rs-2024',
    enabled: true,
  },
  {
    id: 'slide-haval-h6',
    name: 'Haval H6 HEV Hybrid',
    category: 'HYBRID ELECTRIC SUV',
    provenance: '2024 Haval H6 HEV 1.5T Hybrid · 530 Nm Torque · Level 2 ADAS',
    atelier: 'Lahore Flagship Atelier',
    image: havalH6Img,
    objectPosition: 'center',
    vehicleId: 'haval-h6-hev-2024',
    enabled: true,
  },
  {
    id: 'slide-jaecoo-j7',
    name: 'Jaecoo J7 Flagship AWD',
    category: 'JAPANESE CBU IMPORT',
    provenance: '2024 Jaecoo J7 AWD · 540° Transparent Chassis · ARDIS All-Road',
    atelier: 'Islamabad Diplomatic Lounge',
    image: jaecooJ7Img,
    objectPosition: 'center',
    vehicleId: 'jaecoo-j7-awd-2024',
    enabled: true,
  },
  {
    id: 'slide-swift-glx',
    name: 'Suzuki Swift GLX CVT',
    category: 'AGILE HATCHBACK',
    provenance: '2024 Suzuki Swift GLX 1.2L · Phoenix Red Pearl · 6 SRS Airbags',
    atelier: 'Lahore Flagship Atelier',
    image: swiftImg,
    objectPosition: 'center',
    vehicleId: 'suzuki-swift-glx-2024',
    enabled: true,
  },
  {
    id: 'slide-yaris-ativ',
    name: 'Toyota Yaris ATIV X',
    category: 'EXECUTIVE COMPACT',
    provenance: '2024 Toyota Yaris ATIV X 1.5 Dual VVT-i · Super White',
    atelier: 'Karachi Waterfront Gallery',
    image: yarisImg,
    objectPosition: 'center',
    vehicleId: 'toyota-yaris-ativ-x-2024',
    enabled: true,
  },
  {
    id: 'slide-city-aspire',
    name: 'Honda City 1.5 Aspire',
    category: 'EXECUTIVE SEDAN',
    provenance: '2024 Honda City 1.5 Aspire CVT · Modern Steel Metallic',
    atelier: 'Islamabad Diplomatic Lounge',
    image: cityImg,
    objectPosition: 'center',
    vehicleId: 'honda-city-aspire-2024',
    enabled: true,
  },
  {
    id: 'slide-corolla-altis',
    name: 'Toyota Corolla Altis Grande',
    category: 'EXECUTIVE SEDAN',
    provenance: '2024 Toyota Corolla Altis Grande 1.8 · Islamabad Registered',
    atelier: 'Islamabad Diplomatic Lounge',
    image: altisGrandeImg,
    objectPosition: 'center',
    vehicleId: 'toyota-corolla-altis-grande-2024',
    enabled: true,
  },
  {
    id: 'slide-sportage-black',
    name: 'Kia Sportage Black Edition',
    category: 'ALL-WHEEL DRIVE',
    provenance: '2024 Kia Sportage AWD Black Edition · Karachi Waterfront Gallery',
    atelier: 'Karachi Waterfront Gallery',
    image: sportageImg,
    objectPosition: 'center',
    vehicleId: 'kia-sportage-black-edition-2024',
    enabled: true,
  },
  {
    id: 'slide-changan-oshan',
    name: 'Changan Oshan X7 FutureSense',
    category: '7-SEATER LUXURY',
    provenance: '2024 Changan Oshan X7 FutureSense · BlueCore 1.5T',
    atelier: 'Lahore Flagship Atelier',
    image: oshanX7Img,
    objectPosition: 'center',
    vehicleId: 'changan-oshan-x7-2024',
    enabled: true,
  },
];

export const DEFAULT_SHOWROOM_SETTINGS: ShowroomSettings = {
  showroomName: 'Maison Motors',
  tagline: 'The Art of Performance',
  taglineSubtitle: 'Pakistan’s Premier Automotive Atelier & Curated Dealership',
  phone: '+92 42 3578 9000',
  whatsappNumber: '923008456789',
  displayWhatsappNumber: '+92 300 8456789',
  email: 'concierge@maisonmotors.pk',
  currency: 'PKR',
  adminPassword: 'admin123',
  heroSlideDurationMs: 4000, // 4.0 seconds
  heroSlides: DEFAULT_HERO_SLIDES,
  socialLinks: {
    instagram: 'https://instagram.com/maisonmotorspk',
    facebook: 'https://facebook.com/maisonmotorspk',
    youtube: 'https://youtube.com/@maisonmotorspk',
    linkedin: 'https://linkedin.com/company/maison-motors-pk',
  },
  heroHeadlines: {
    eyebrow: 'EXCLUSIVE AUTOMOTIVE ATELIER',
    headline: 'DRIVEN BY DISTINCTION.',
    subhead: 'Exceptional automobiles. A more considered way to drive in Pakistan.',
    primaryCtaText: 'EXPLORE FLEET ↗',
    secondaryCtaText: 'REQUEST VIP PRIVATE VIEWING',
  },
  ourPhilosophy: {
    title: 'THE ATELIER STANDARD',
    quote: 'True automotive prestige is not merely possessed; it is curated, documented, and lived.',
    body: 'Maison Motors curates only the foremost verified vehicles in Pakistan — from immaculate Japanese CBU imports to top-tier factory-assembled flagships. Every automobile undergoes our exhaustive 210-point mechanical inspection with genuine biometric transparency.',
  },
  addresses: [
    {
      city: 'Lahore',
      branch: 'Gulberg III Flagship Atelier',
      address: 'Plot 12-A, Main Boulevard, Gulberg III, Lahore, Punjab',
      phone: '+92 42 3578 9000',
      timing: 'Mon – Sat: 10:00 AM – 9:00 PM | Sun: By Private Appointment',
    },
    {
      city: 'Karachi',
      branch: 'Clifton Waterfront Gallery',
      address: 'Suite 4B, Block 4, Clifton Marine Drive, Karachi, Sindh',
      phone: '+92 21 3582 4000',
      timing: 'Mon – Sat: 11:00 AM – 10:00 PM',
    },
    {
      city: 'Islamabad',
      branch: 'F-6 Diplomatic Enclave Lounge',
      address: 'Super Market Commercial Sector, School Road, F-6/2, Islamabad, ICT',
      phone: '+92 51 2822 500',
      timing: 'Mon – Sat: 10:00 AM – 8:00 PM',
    },
  ],
};

export interface BrandInfo {
  name: string;
  origin: string;
  presenceInPakistan: string;
  speciality: string;
  slug: string;
}

export const POPULAR_BRANDS: BrandInfo[] = [
  {
    name: 'Toyota',
    origin: 'Japan (Indus Motor Company / CBU)',
    presenceInPakistan: 'Over 34 Years of Dominance · Karachi Assembly & Japanese Imports',
    speciality: 'Land Cruiser 300, Fortuner Legender, Corolla Altis Grande, Hilux Revo Rocco, Yaris',
    slug: 'toyota',
  },
  {
    name: 'Honda',
    origin: 'Japan (Honda Atlas Cars Pakistan)',
    presenceInPakistan: 'Since 1992 · Manga Mandi Lahore Assembly',
    speciality: 'Civic RS Turbo, City Aspire, HR-V VTi-S, BR-V',
    slug: 'honda',
  },
  {
    name: 'Haval',
    origin: 'Great Wall Motors (Sazgar Engineering Works)',
    presenceInPakistan: 'Since 2021 · First Local Hybrid CKD Assembly',
    speciality: 'Haval H6 HEV (530 Nm Hybrid), Haval Jolion HEV',
    slug: 'haval',
  },
  {
    name: 'Kia',
    origin: 'South Korea (Lucky Motor Corporation)',
    presenceInPakistan: 'Since 2018 · Bin Qasim Karachi Assembly',
    speciality: 'Sportage Black Edition AWD, Sorento 3.5 V6, Stonic, Carnival',
    slug: 'kia',
  },
  {
    name: 'Hyundai',
    origin: 'South Korea (Hyundai Nishat Motor)',
    presenceInPakistan: 'Since 2019 · Faisalabad Plant',
    speciality: 'Santa Fe Hybrid AWD, Tucson Ultimate, Sonata 2.5, Elantra',
    slug: 'hyundai',
  },
  {
    name: 'Changan',
    origin: 'China (Master Changan Motors)',
    presenceInPakistan: 'Since 2018 · Port Qasim Karachi Plant',
    speciality: 'Oshan X7 FutureSense, Alsvin Lumiere',
    slug: 'changan',
  },
  {
    name: 'Jaecoo',
    origin: 'Chery Global Group',
    presenceInPakistan: '2024 Launch · Official Luxury SUV Network',
    speciality: 'Jaecoo J7 All-Road AWD, Omoda E5 Electric',
    slug: 'jaecoo',
  },
  {
    name: 'Suzuki',
    origin: 'Japan (Pak Suzuki Motor Company)',
    presenceInPakistan: 'Since 1983 · Pakistan’s Largest Automobile Manufacturer',
    speciality: 'Swift GLX CVT, Cultus AGS, Alto VXR/VXL',
    slug: 'suzuki',
  },
];
