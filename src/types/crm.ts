export type LeadType = 'general_enquiry' | 'test_drive' | 'private_viewing' | 'trade_in' | 'financing' | 'whatsapp_lead';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Appointment Scheduled' | 'Negotiation' | 'Won' | 'Lost';

export interface Lead {
  id: string;
  leadType: LeadType;
  status: LeadStatus;
  
  // Customer details
  fullName: string;
  email: string;
  phone: string; // e.g. "+92 300 1234567"
  city: string;
  preferredContactMethod: 'whatsapp' | 'phone' | 'email';
  
  // Vehicle association
  vehicleId?: string;
  vehicleTitle?: string;
  vehiclePrice?: number;
  
  // Specific payload for types
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
  preferredLocation?: 'Showroom Lounge' | 'Executive Doorstep VIP Delivery';
  
  // Trade-in details if trade_in
  tradeInVehicle?: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    registeredCity: string;
    expectedValuePKR?: number;
  };

  // Financing details if financing
  financingDetails?: {
    financingType: 'Islamic Ijarah' | 'Conventional Auto Loan';
    preferredBank: 'Meezan Bank' | 'Bank Alfalah' | 'HBL' | 'Dubai Islamic Bank';
    downPaymentPercentage: number;
    tenureYears: number;
    calculatedMonthlyInstallmentPKR: number;
  };

  // Internal dealership workflow
  assignedTo?: string;
  internalNotes?: string;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HeroSlideConfig {
  id: string;
  name: string;
  category: string;
  provenance: string;
  atelier: string;
  image: string;
  objectPosition?: string;
  vehicleId?: string;
  enabled?: boolean;
}

export interface ShowroomSettings {
  showroomName: string;
  tagline: string;
  taglineSubtitle: string;
  customLogoUrl?: string;
  customMonogram?: string;
  phone: string;
  whatsappNumber: string; // formatted with country code e.g. 923008456789
  displayWhatsappNumber: string; // e.g. "+92 300 8456789"
  email: string;
  currency: 'PKR';
  addresses: {
    city: string;
    branch: string;
    address: string;
    phone: string;
    timing: string;
  }[];
  socialLinks: {
    instagram: string;
    facebook: string;
    youtube: string;
    linkedin: string;
  };
  heroHeadlines: {
    eyebrow: string;
    headline: string;
    subhead: string;
    primaryCtaText: string;
    secondaryCtaText: string;
  };
  ourPhilosophy: {
    title: string;
    quote: string;
    body: string;
  };
  heroSlides?: HeroSlideConfig[];
  heroSlideDurationMs?: number;
  adminPassword?: string;
}
