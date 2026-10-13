import { Vehicle } from '../types/vehicle';
import { Lead, ShowroomSettings, HeroSlideConfig } from '../types/crm';
import { SEED_VEHICLES } from '../data/seedVehicles';
import { DEFAULT_SHOWROOM_SETTINGS, DEFAULT_HERO_SLIDES, POPULAR_BRANDS, BrandInfo } from '../data/seedSettings';

const STORAGE_KEYS = {
  VEHICLES: 'maison_vehicles_v10',
  LEADS: 'maison_leads_v3',
  SETTINGS: 'maison_settings_v6',
  BRANDS: 'maison_brands_v3',
  FAVORITES: 'maison_favorites_v3',
  COMPARISON: 'maison_comparison_v3',
  ADMIN_SESSION: 'maison_admin_auth_v3',
};

// Initial Pakistani client sample seed leads
const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    leadType: 'test_drive',
    status: 'Appointment Scheduled',
    fullName: 'Malik Tariq Aziz',
    email: 'tariq.aziz@consultants.pk',
    phone: '+92 300 8441122',
    city: 'Lahore',
    preferredContactMethod: 'whatsapp',
    vehicleId: 'honda-civic-rs-2024',
    vehicleTitle: '2024 Honda Civic RS 1.5 VTEC Turbo',
    vehiclePrice: 9850000,
    preferredDate: '2024-10-18',
    preferredTime: '04:00 PM',
    preferredLocation: 'Showroom Lounge',
    message: 'Interested in evaluating the 11th Gen Civic RS Turbo. Requesting private viewing in Gulberg III.',
    internalNotes: 'Client verified via WhatsApp. Executive coffee lounge booked for 4 PM.',
    assignedTo: 'Hamza Farooq (Senior Concierge)',
    followUpDate: '2024-10-18',
    createdAt: '2024-10-08T11:20:00Z',
    updatedAt: '2024-10-09T09:15:00Z',
  },
  {
    id: 'lead-102',
    leadType: 'financing',
    status: 'Qualified',
    fullName: 'Dr. Shahzad Qureshi',
    email: 'shahzad.qureshi@shifa.org.pk',
    phone: '+92 321 5567890',
    city: 'Islamabad',
    preferredContactMethod: 'phone',
    vehicleId: 'toyota-land-cruiser-lc300-2024',
    vehicleTitle: '2024 Toyota Land Cruiser 300 ZX V6 Twin Turbo',
    vehiclePrice: 115000000,
    financingDetails: {
      financingType: 'Islamic Ijarah',
      preferredBank: 'Meezan Bank',
      downPaymentPercentage: 40,
      tenureYears: 3,
      calculatedMonthlyInstallmentPKR: 2450000,
    },
    message: 'Seeking Islamic Ijarah quotation through Meezan Bank Premium Banking.',
    internalNotes: 'Sent Meezan Bank Islamic Auto Ijarah schedule. Awaiting bank approval.',
    assignedTo: 'Bilal Khan (Finance Desk)',
    createdAt: '2024-10-07T14:40:00Z',
    updatedAt: '2024-10-08T16:00:00Z',
  },
  {
    id: 'lead-103',
    leadType: 'trade_in',
    status: 'New',
    fullName: 'Kamran Haider',
    email: 'k.haider@textiles.com.pk',
    phone: '+92 333 4210987',
    city: 'Lahore',
    preferredContactMethod: 'whatsapp',
    vehicleId: 'haval-h6-hev-2024',
    vehicleTitle: '2024 Haval H6 HEV 1.5T Hybrid Electric',
    vehiclePrice: 11800000,
    tradeInVehicle: {
      make: 'Kia',
      model: 'Sportage FWD',
      year: 2021,
      mileage: 38000,
      registeredCity: 'Lahore',
      expectedValuePKR: 6200000,
    },
    message: 'Would like to exchange my 2021 Sportage FWD for the Haval H6 HEV Hybrid.',
    internalNotes: 'High-intent buyer. Schedule door-step valuation with technical inspection team.',
    assignedTo: 'Zainab Mir (VIP Client Executive)',
    createdAt: '2024-10-09T08:30:00Z',
    updatedAt: '2024-10-09T08:30:00Z',
  },
];

export const StorageService = {
  // --- VEHICLES ---
  getVehicles(): Vehicle[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VEHICLES);
      if (!data) {
        // If older storage existed, preserve custom admin-added cars
        const oldData = localStorage.getItem('maison_vehicles_v7') || localStorage.getItem('maison_vehicles_v8');
        if (oldData) {
          try {
            const oldList = JSON.parse(oldData);
            const seedIds = new Set(SEED_VEHICLES.map((s) => s.id));
            const customCars = Array.isArray(oldList) ? oldList.filter((c: any) => !seedIds.has(c.id)) : [];
            const merged = [...SEED_VEHICLES, ...customCars];
            localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(merged));
            return merged;
          } catch (_) {}
        }
        localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(SEED_VEHICLES));
        return SEED_VEHICLES;
      }
      const parsed = JSON.parse(data);
      // Ensure it is an array with items
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Sync seed vehicles to their pristine authentic photography
        const seedMap = new Map(SEED_VEHICLES.map((s) => [s.id, s]));
        const synced = parsed.map((item: Vehicle) => {
          const seed = seedMap.get(item.id);
          if (seed) {
            return {
              ...item,
              coverImage: seed.coverImage,
              images: seed.images,
            };
          }
          return item;
        });
        return synced;
      }
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(SEED_VEHICLES));
      return SEED_VEHICLES;
    } catch (e) {
      console.warn('StorageService error reading vehicles, fallback to seed', e);
      return SEED_VEHICLES;
    }
  },

  getVehicleById(id: string): Vehicle | undefined {
    const vehicles = this.getVehicles();
    return vehicles.find((v) => v.id === id);
  },

  addVehicle(vehicle: Vehicle): Vehicle {
    const vehicles = this.getVehicles();
    const updated = [vehicle, ...vehicles];
    try {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save vehicle to localStorage', e);
    }
    return vehicle;
  },

  updateVehicle(id: string, updates: Partial<Vehicle>): Vehicle | undefined {
    const vehicles = this.getVehicles();
    const index = vehicles.findIndex((v) => v.id === id);
    if (index === -1) return undefined;

    vehicles[index] = {
      ...vehicles[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
    } catch (e) {
      console.error('Failed to update vehicle in localStorage', e);
    }
    return vehicles[index];
  },

  deleteVehicle(id: string): boolean {
    const vehicles = this.getVehicles();
    const filtered = vehicles.filter((v) => v.id !== id);
    if (filtered.length === vehicles.length) return false;

    try {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to delete vehicle', e);
    }
    return true;
  },

  resetVehiclesToDefault(): Vehicle[] {
    try {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(SEED_VEHICLES));
    } catch (e) {
      console.error('Failed to reset vehicles', e);
    }
    return SEED_VEHICLES;
  },

  // --- SETTINGS ---
  getSettings(): ShowroomSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SHOWROOM_SETTINGS));
        return DEFAULT_SHOWROOM_SETTINGS;
      }
      const parsed = JSON.parse(data);
      // Ensure heroSlides have authentic high-resolution images
      const seedSlideMap = new Map(DEFAULT_HERO_SLIDES.map((s) => [s.id, s]));
      const healedSlides = (parsed.heroSlides && parsed.heroSlides.length > 0 ? parsed.heroSlides : DEFAULT_HERO_SLIDES).map((hs: HeroSlideConfig) => {
        const seedSlide = seedSlideMap.get(hs.id);
        if (seedSlide && (!hs.image || hs.image.includes('unsplash') || hs.image.includes('hero_honda_civic_studio') || hs.image.startsWith('http'))) {
          return {
            ...hs,
            image: seedSlide.image,
          };
        }
        return hs;
      });

      // Merge with defaults to ensure heroSlides, slideDuration, adminPassword are always present
      return {
        ...DEFAULT_SHOWROOM_SETTINGS,
        ...parsed,
        heroSlides: healedSlides,
        heroSlideDurationMs: parsed.heroSlideDurationMs || DEFAULT_SHOWROOM_SETTINGS.heroSlideDurationMs || 4000,
        adminPassword: parsed.adminPassword || DEFAULT_SHOWROOM_SETTINGS.adminPassword || 'admin123',
      };
    } catch (e) {
      return DEFAULT_SHOWROOM_SETTINGS;
    }
  },

  updateSettings(updates: Partial<ShowroomSettings>): ShowroomSettings {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
    return updated;
  },

  // --- HERO SLIDES CAROUSEL ---
  getHeroSlides(): HeroSlideConfig[] {
    const settings = this.getSettings();
    return settings.heroSlides && settings.heroSlides.length > 0
      ? settings.heroSlides
      : DEFAULT_HERO_SLIDES;
  },

  updateHeroSlides(slides: HeroSlideConfig[]): HeroSlideConfig[] {
    this.updateSettings({ heroSlides: slides });
    return slides;
  },

  // --- LEADS ---
  getLeads(): Lead[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEADS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(INITIAL_LEADS));
        return INITIAL_LEADS;
      }
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_LEADS;
    }
  },

  addLead(lead: Lead): Lead {
    const leads = this.getLeads();
    const updated = [lead, ...leads];
    try {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to add lead', e);
    }
    return lead;
  },

  updateLead(id: string, updates: Partial<Lead>): Lead | undefined {
    const leads = this.getLeads();
    const idx = leads.findIndex((l) => l.id === id);
    if (idx === -1) return undefined;

    leads[idx] = { ...leads[idx], ...updates, updatedAt: new Date().toISOString() };
    try {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    } catch (e) {
      console.error('Failed to update lead', e);
    }
    return leads[idx];
  },

  deleteLead(id: string): boolean {
    const leads = this.getLeads();
    const filtered = leads.filter((l) => l.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to delete lead', e);
    }
    return true;
  },

  // --- BRANDS ---
  getBrands(): BrandInfo[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BRANDS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(POPULAR_BRANDS));
        return POPULAR_BRANDS;
      }
      return JSON.parse(data);
    } catch (e) {
      return POPULAR_BRANDS;
    }
  },

  // --- FAVORITES ---
  getFavorites(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  toggleFavorite(vehicleId: string): string[] {
    const favs = this.getFavorites();
    const exists = favs.includes(vehicleId);
    const updated = exists ? favs.filter((id) => id !== vehicleId) : [...favs, vehicleId];
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    } catch (e) {}
    return updated;
  },

  // --- COMPARISON ---
  getComparisonIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPARISON);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  toggleComparison(vehicleId: string): string[] {
    const ids = this.getComparisonIds();
    const exists = ids.includes(vehicleId);
    let updated: string[];
    if (exists) {
      updated = ids.filter((id) => id !== vehicleId);
    } else {
      if (ids.length >= 3) {
        updated = [...ids.slice(1), vehicleId];
      } else {
        updated = [...ids, vehicleId];
      }
    }
    try {
      localStorage.setItem(STORAGE_KEYS.COMPARISON, JSON.stringify(updated));
    } catch (e) {}
    return updated;
  },

  clearComparison(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.COMPARISON);
    } catch (e) {}
  },

  // --- ADMIN AUTH STATE ---
  isAdminAuthenticated(): boolean {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
    } catch (e) {
      return false;
    }
  },

  setAdminAuthenticated(auth: boolean): void {
    try {
      if (auth) {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
      } else {
        sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
      }
    } catch (e) {}
  },

  // --- 10-YEAR LONGEVITY, SELF-HEALING & BACKUP SUITE ---
  exportShowroomBackup(): string {
    const backup = {
      appVersion: '2.0.0-longterm',
      exportTimestamp: new Date().toISOString(),
      vehicles: this.getVehicles(),
      settings: this.getSettings(),
      leads: this.getLeads(),
      brands: this.getBrands(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importShowroomBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') return false;

      if (Array.isArray(data.vehicles) && data.vehicles.length > 0) {
        localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(data.vehicles));
      }
      if (data.settings && typeof data.settings === 'object') {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      }
      if (Array.isArray(data.leads)) {
        localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(data.leads));
      }
      if (Array.isArray(data.brands) && data.brands.length > 0) {
        localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(data.brands));
      }
      return true;
    } catch (e) {
      console.error('Failed to import showroom backup:', e);
      return false;
    }
  },

  selfHealStorage(): boolean {
    try {
      // 1. Remove obsolete or corrupted temporary keys
      const allKeys = Object.keys(localStorage);
      for (const k of allKeys) {
        if (k.startsWith('maison_') && !Object.values(STORAGE_KEYS).includes(k)) {
          localStorage.removeItem(k);
        }
      }
      // 2. Refresh default settings and synchronize vehicle seed data
      this.getVehicles();
      this.getSettings();
      return true;
    } catch (e) {
      return false;
    }
  },
};
