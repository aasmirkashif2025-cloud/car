export type BodyStyle = 'Sedan' | 'SUV / Crossover' | 'Coupe' | 'Hatchback' | 'Electric' | 'Convertible';
export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Plug-in Hybrid' | 'Electric';
export type Transmission = 'Automatic' | 'Manual' | 'Dual Clutch' | 'e-CVT';
export type Drivetrain = 'FWD' | 'RWD' | 'AWD' | '4WD';
export type VehicleCondition = 'Brand New / Zero Meter' | 'Certified Pre-Owned' | 'Collector Grade';
export type AssemblyType = 'Local Assembled (CKD)' | 'Japanese CBU Import' | 'German CBU Import' | 'UK CBU Import';
export type PakistanCity = 'Lahore' | 'Karachi' | 'Islamabad' | 'Rawalpindi' | 'Faisalabad' | 'Peshawar' | 'Multan';
export type VehicleStatus = 'available' | 'reserved' | 'sold';

export interface AuctionSheet {
  grade: string;
  interiorGrade: string;
  exteriorGrade: string;
  auctionHouse: string;
  lotNumber: string;
  verified: boolean;
  sheetUrl?: string;
  notes?: string;
}

export interface InspectionReport {
  score: number; // Out of 100
  inspectedBy: string;
  inspectionDate: string;
  paintCondition: string;
  engineHealth: string;
  suspensionHealth: string;
  electricalHealth: string;
  tiresCondition: string;
  verifiableUrl?: string;
}

export interface PakistanDocumentation {
  smartCard: boolean;
  biometricAvailable: boolean;
  tokenTaxStatus: 'Lifetime Paid' | 'Paid up to 2026' | 'Paid up to 2025' | 'Unpaid / Due';
  registrationCity: string;
  registrationYear: number;
  duplicateNumberPlates: boolean;
  customsClearanceVerified: boolean;
  fileStatus: 'Original File in Hand' | 'Excise Office Return' | 'Duplicate File';
}

export interface CustomField {
  label: string;
  value: string;
}

export interface Vehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  price: number; // in PKR numeric
  priceType: 'fixed' | 'negotiable' | 'on_request';
  mileage: number; // in km
  transmission: Transmission;
  fuelType: FuelType;
  engineCapacity: string; // e.g. "1498 cc"
  horsepower: string; // e.g. "178 HP"
  torque?: string; // e.g. "240 Nm"
  acceleration0to100?: string; // e.g. "7.8s"
  topSpeed?: string; // e.g. "210 km/h"
  exteriorColor: string;
  interiorColor: string;
  bodyStyle: BodyStyle;
  drivetrain: Drivetrain;
  seatingCapacity: number;
  doors: number;
  
  // Pakistan specific
  city: PakistanCity;
  showroomBranch: string;
  assembly: AssemblyType;
  importYear?: number;
  documentation: PakistanDocumentation;
  auctionSheet?: AuctionSheet;
  inspectionReport?: InspectionReport;

  // Media & presentation
  coverImage: string;
  images: string[];
  videoUrl?: string;
  has360View?: boolean;
  
  // Editorial & description
  tagline: string;
  description: string;
  additionalNotes?: string;
  features: string[];
  customFields?: CustomField[];
  
  // Administrative & state
  status: VehicleStatus;
  featured: boolean;
  isCollectorGrade?: boolean;
  isNewArrival?: boolean;
  stockNumber: string;
  vin?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;

  // SEO
  seoTitle?: string;
  seoDescription?: string;
}

export interface VehicleFilterState {
  search: string;
  city: string;
  make: string;
  bodyStyle: string;
  fuelType: string;
  transmission: string;
  assembly: string;
  minPrice: number | null;
  maxPrice: number | null;
  minYear: number | null;
  maxYear: number | null;
  status: string;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'year_desc' | 'mileage_asc' | 'recently_added';
}
