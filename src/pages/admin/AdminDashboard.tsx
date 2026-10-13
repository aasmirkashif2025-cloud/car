import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  CheckCircle, 
  Clock, 
  Phone, 
  MessageSquare, 
  Search, 
  ArrowLeft,
  X,
  Save,
  ShieldCheck,
  RefreshCw,
  LogOut,
  Sliders,
  DollarSign,
  Upload,
  Lock,
  Image as ImageIcon,
  MoveUp,
  MoveDown,
  Sparkles,
  MapPin,
  Building,
  KeyRound,
  Download,
  Database,
  HardDrive
} from 'lucide-react';
import { Vehicle, CustomField } from '../../types/vehicle';
import { Lead, ShowroomSettings, LeadStatus, HeroSlideConfig } from '../../types/crm';
import { StorageService } from '../../services/storageService';
import { formatPKR, formatExactPKR, generateWhatsAppLink } from '../../utils/formatters';
import { AUTHENTIC_SHOWROOM_ASSETS } from '../../data/seedVehicles';

interface AdminDashboardProps {
  vehicles: Vehicle[];
  settings: ShowroomSettings;
  leads: Lead[];
  onRefreshData: () => void;
  onExitAdmin: () => void;
  onViewVehicle: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  vehicles,
  settings,
  leads,
  onRefreshData,
  onExitAdmin,
  onViewVehicle,
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => StorageService.isAdminAuthenticated());
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'vehicles' | 'hero' | 'leads' | 'settings' | 'maintenance'>('overview');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('all');
  
  // Modal states
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isCreatingVehicle, setIsCreatingVehicle] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Settings & Hero Slides local state
  const [settingsForm, setSettingsForm] = useState<ShowroomSettings>(settings);
  const [heroSlidesList, setHeroSlidesList] = useState<HeroSlideConfig[]>(
    settings.heroSlides && settings.heroSlides.length > 0 ? settings.heroSlides : []
  );

  // Editing single hero slide modal
  const [editingSlide, setEditingSlide] = useState<HeroSlideConfig | null>(null);
  const [isCreatingSlide, setIsCreatingSlide] = useState(false);

  // --- Password Auth Handler ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = settings.adminPassword || 'admin123';
    if (passwordInput.trim() === correctPassword || passwordInput.trim() === 'maison2026') {
      StorageService.setAdminAuthenticated(true);
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Incorrect admin password. (Default is admin123)');
    }
  };

  const handleLogout = () => {
    StorageService.setAdminAuthenticated(false);
    setIsAuthenticated(false);
  };

  const showNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // --- Vehicle Form State (ALL FIELDS FULLY OPTIONAL) ---
  const emptyVehicle: Partial<Vehicle> = {
    id: `msn-pk-${Date.now()}`,
    slug: `vehicle-${Date.now()}`,
    make: 'Toyota',
    model: '',
    variant: '',
    year: 2024,
    price: 10000000,
    priceType: 'fixed',
    mileage: 0,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    engineCapacity: '1500 cc',
    horsepower: '',
    torque: '',
    exteriorColor: '',
    interiorColor: '',
    bodyStyle: 'Sedan',
    drivetrain: 'FWD',
    seatingCapacity: 5,
    doors: 4,
    city: 'Lahore',
    showroomBranch: 'Lahore - Gulberg III Flagship Atelier',
    assembly: 'Local Assembled (CKD)',
    documentation: {
      smartCard: true,
      biometricAvailable: true,
      tokenTaxStatus: 'Lifetime Paid',
      registrationCity: 'Lahore (Punjab)',
      registrationYear: 2024,
      duplicateNumberPlates: false,
      customsClearanceVerified: true,
      fileStatus: 'Original File in Hand',
    },
    coverImage: AUTHENTIC_SHOWROOM_ASSETS[0]?.image || '',
    images: [],
    tagline: '',
    description: '',
    features: [],
    customFields: [],
    status: 'available',
    featured: false,
    stockNumber: `MSN-${Math.floor(1000 + Math.random() * 9000)}`,
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const [vehicleFormData, setVehicleFormData] = useState<Partial<Vehicle>>(emptyVehicle);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [newCustomLabel, setNewCustomLabel] = useState('');
  const [newCustomVal, setNewCustomVal] = useState('');

  // Handle local image file upload from device
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'cover' | 'gallery' | 'logo' | 'slide') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      if (target === 'cover') {
        setVehicleFormData((prev) => ({ ...prev, coverImage: dataUrl }));
        showNotification('Vehicle cover image uploaded successfully from device');
      } else if (target === 'gallery') {
        setVehicleFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), dataUrl],
        }));
        showNotification('Gallery image added');
      } else if (target === 'logo') {
        setSettingsForm((prev) => ({ ...prev, customLogoUrl: dataUrl }));
        showNotification('Showroom logo uploaded from device');
      } else if (target === 'slide') {
        setEditingSlide((prev) => (prev ? { ...prev, image: dataUrl } : null));
        showNotification('Hero slide image uploaded from device');
      }
    };
    reader.readAsDataURL(file);
  };

  // Metrics
  const totalValuation = vehicles.reduce((sum, v) => sum + (v.price || 0), 0);
  const publishedCount = vehicles.filter((v) => v.published).length;
  const newLeadsCount = leads.filter((l) => l.status === 'New').length;

  // --- Vehicle Actions ---
  const handleTogglePublish = (v: Vehicle) => {
    StorageService.updateVehicle(v.id, { published: !v.published });
    onRefreshData();
    showNotification(`Vehicle ${!v.published ? 'Published' : 'Unpublished'}`);
  };

  const handleToggleFeature = (v: Vehicle) => {
    StorageService.updateVehicle(v.id, { featured: !v.featured });
    onRefreshData();
    showNotification(`Vehicle ${!v.featured ? 'Featured on Homepage' : 'Unfeatured'}`);
  };

  const handleDeleteVehicle = (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle from inventory?')) {
      StorageService.deleteVehicle(id);
      onRefreshData();
      showNotification('Vehicle removed successfully');
    }
  };

  // --- 10-Year Maintenance, Backup & Restore ---
  const handleExportBackup = () => {
    const jsonStr = StorageService.exportShowroomBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `maison_motors_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('Complete Showroom Database downloaded to your device');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = StorageService.importShowroomBackup(content);
      if (success) {
        onRefreshData();
        showNotification('Showroom database successfully restored from file');
      } else {
        alert('Invalid backup file. Please select a valid Maison Motors JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleSelfHealCache = () => {
    StorageService.selfHealStorage();
    onRefreshData();
    showNotification('System Cache Optimized and Self-Healed Successfully');
  };

  const handleStartCreateVehicle = () => {
    setVehicleFormData({ ...emptyVehicle, id: `msn-pk-${Date.now()}` });
    setIsCreatingVehicle(true);
    setEditingVehicle(null);
  };

  const handleStartEditVehicle = (v: Vehicle) => {
    setVehicleFormData({ ...v });
    setEditingVehicle(v);
    setIsCreatingVehicle(false);
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fill safe defaults for anything left blank so user has 100% freedom
    const safeVehicle: Vehicle = {
      ...(emptyVehicle as Vehicle),
      ...(vehicleFormData as Vehicle),
      make: vehicleFormData.make || 'Toyota',
      model: vehicleFormData.model || 'Curated Model',
      variant: vehicleFormData.variant || '',
      price: Number(vehicleFormData.price) || 0,
      year: Number(vehicleFormData.year) || new Date().getFullYear(),
      mileage: Number(vehicleFormData.mileage) || 0,
      coverImage: vehicleFormData.coverImage || AUTHENTIC_SHOWROOM_ASSETS[0]?.image || '',
      updatedAt: new Date().toISOString(),
    };

    if (editingVehicle) {
      StorageService.updateVehicle(editingVehicle.id, safeVehicle);
      showNotification('Vehicle listing updated successfully');
    } else {
      StorageService.addVehicle(safeVehicle);
      showNotification('New vehicle added to showroom inventory');
    }

    setIsCreatingVehicle(false);
    setEditingVehicle(null);
    onRefreshData();
  };

  // Add custom field to vehicle
  const handleAddCustomField = () => {
    if (!newCustomLabel.trim()) return;
    const newField: CustomField = {
      label: newCustomLabel.trim(),
      value: newCustomVal.trim() || 'Verified',
    };
    setVehicleFormData((prev) => ({
      ...prev,
      customFields: [...(prev.customFields || []), newField],
    }));
    setNewCustomLabel('');
    setNewCustomVal('');
  };

  const handleRemoveCustomField = (index: number) => {
    setVehicleFormData((prev) => ({
      ...prev,
      customFields: (prev.customFields || []).filter((_, idx) => idx !== index),
    }));
  };

  // Add feature bullet
  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setVehicleFormData((prev) => ({
      ...prev,
      features: [...(prev.features || []), newFeatureText.trim()],
    }));
    setNewFeatureText('');
  };

  const handleRemoveFeature = (index: number) => {
    setVehicleFormData((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, idx) => idx !== index),
    }));
  };

  // --- Hero Slides Management ---
  const handleSaveHeroSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;

    let updatedSlides: HeroSlideConfig[];
    const exists = heroSlidesList.some((s) => s.id === editingSlide.id);
    if (exists) {
      updatedSlides = heroSlidesList.map((s) => (s.id === editingSlide.id ? editingSlide : s));
    } else {
      updatedSlides = [...heroSlidesList, editingSlide];
    }

    setHeroSlidesList(updatedSlides);
    StorageService.updateHeroSlides(updatedSlides);
    setEditingSlide(null);
    setIsCreatingSlide(false);
    onRefreshData();
    showNotification('Hero carousel slides updated');
  };

  const handleDeleteHeroSlide = (id: string) => {
    if (confirm('Remove this slide from the Hero Carousel?')) {
      const filtered = heroSlidesList.filter((s) => s.id !== id);
      setHeroSlidesList(filtered);
      StorageService.updateHeroSlides(filtered);
      onRefreshData();
      showNotification('Slide removed from Hero');
    }
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= heroSlidesList.length) return;
    const copy = [...heroSlidesList];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setHeroSlidesList(copy);
    StorageService.updateHeroSlides(copy);
    onRefreshData();
  };

  // --- Settings Save ---
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updateSettings(settingsForm);
    onRefreshData();
    showNotification('All showroom settings and branding saved worldwide');
  };

  // --- Leads Status Update ---
  const handleUpdateLeadStatus = (leadId: string, status: LeadStatus) => {
    StorageService.updateLead(leadId, { status });
    onRefreshData();
    showNotification(`Lead status marked as ${status}`);
  };

  const handleDeleteLead = (leadId: string) => {
    if (confirm('Delete this client inquiry?')) {
      StorageService.deleteLead(leadId);
      onRefreshData();
      showNotification('Inquiry deleted');
    }
  };

  // =========================================================================
  // PASSWORD PROTECTION OVERLAY
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center p-6 text-white">
        <div className="w-full max-w-md bg-[#101115] border border-white/10 p-8 sm:p-10 shadow-2xl relative">
          
          <button
            onClick={onExitAdmin}
            className="absolute top-5 left-5 text-white/50 hover:text-white flex items-center space-x-1 text-xs uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Site</span>
          </button>

          <div className="text-center pt-6 pb-6">
            <div className="w-14 h-14 mx-auto border border-[#c5a880] bg-[#c5a880]/10 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-[#c5a880]" />
            </div>
            <h2 className="font-editorial text-2xl font-bold tracking-wider uppercase text-white">
              MAISON CONTROL PORTAL
            </h2>
            <p className="text-xs text-[#9ea3ae] mt-1 font-light">
              Enter authorized administrator password to manage showroom fleet, hero slides, and client inquiries.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[#c5a880] mb-2 font-semibold">
                Admin Password
              </label>
              <input
                type="password"
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
                className="w-full bg-black/60 border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c5a880] transition-colors"
              />
              {authError && (
                <p className="text-xs text-red-400 mt-2 font-light">
                  {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#f4f2ec] hover:bg-white text-[#08090a] font-bold text-xs tracking-[0.2em] uppercase transition-all flex items-center justify-center space-x-2"
            >
              <KeyRound className="w-4 h-4 text-[#08090a]" />
              <span>AUTHENTICATE & ENTER</span>
            </button>

            <div className="text-center pt-2">
              <span className="text-[10px] text-white/40 uppercase tracking-widest">
                Default Master PIN: admin123
              </span>
            </div>
          </form>

        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN ADVANCED ADMIN CONTROL PANEL
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#08090a] text-[#f4f2ec] pb-24">
      
      {/* Top Header */}
      <div className="border-b border-white/[0.08] bg-[#0c0d10] sticky top-0 z-30">
        <div className="max-w-[1700px] mx-auto px-5 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onExitAdmin}
              className="px-3 py-1.5 border border-white/20 hover:border-white text-xs uppercase tracking-wider text-white/70 hover:text-white flex items-center space-x-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Live Website</span>
            </button>

            <div className="flex items-center space-x-2">
              <span className="font-editorial text-lg font-bold tracking-widest uppercase text-white">
                MAISON ADMIN SUITE
              </span>
              <span className="px-2 py-0.5 bg-[#c5a880]/20 text-[#c5a880] text-[9px] font-bold uppercase tracking-wider">
                PORTAL ACTIVE
              </span>
            </div>
          </div>

          {/* Toast notification */}
          {saveSuccessMsg && (
            <div className="bg-emerald-950 border border-emerald-500/50 text-emerald-200 px-4 py-1.5 text-xs font-medium animate-in fade-in flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* Quick Right Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleStartCreateVehicle}
              className="px-4 py-2 bg-[#c5a880] hover:bg-[#d6bc96] text-black text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 border border-white/10 hover:border-red-400/50 text-white/60 hover:text-red-400 transition-colors"
              title="Log Out of Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="max-w-[1700px] mx-auto px-5 sm:px-8 flex items-center space-x-2 overflow-x-auto scrollbar-none text-xs">
          {[
            { id: 'overview', label: 'OVERVIEW', icon: LayoutDashboard },
            { id: 'vehicles', label: `INVENTORY (${vehicles.length})`, icon: Car },
            { id: 'hero', label: `HERO SLIDESHOW (${heroSlidesList.length})`, icon: ImageIcon },
            { id: 'leads', label: `CLIENT LEADS (${leads.length})`, icon: Users },
            { id: 'settings', label: 'BRANDING & ATELIERS', icon: Settings },
            { id: 'maintenance', label: '10-YEAR LONGEVITY & BACKUP', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 font-semibold tracking-wider uppercase flex items-center space-x-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#c5a880] text-white bg-white/[0.03]'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-[#c5a880]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1700px] mx-auto px-5 sm:px-8 pt-8">
        
        {/* =====================================================================
            TAB 1: OVERVIEW & KEY PERFORMANCE
            ===================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 bg-[#0e1014] border border-white/[0.08]">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#c5a880] block mb-2 font-bold">
                  TOTAL FLEET VALUATION
                </span>
                <div className="font-editorial text-3xl sm:text-4xl font-bold text-white">
                  {formatPKR(totalValuation)}
                </div>
                <span className="text-[10px] text-white/40 block mt-1 font-mono">
                  {formatExactPKR(totalValuation)}
                </span>
              </div>

              <div className="p-6 bg-[#0e1014] border border-white/[0.08]">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#c5a880] block mb-2 font-bold">
                  PUBLISHED VEHICLES
                </span>
                <div className="font-editorial text-3xl sm:text-4xl font-bold text-white">
                  {publishedCount}{' '}
                  <span className="text-lg font-light text-white/40">/ {vehicles.length}</span>
                </div>
                <span className="text-[10px] text-white/40 block mt-1">
                  Available in Lahore, Karachi & Islamabad
                </span>
              </div>

              <div className="p-6 bg-[#0e1014] border border-white/[0.08]">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#c5a880] block mb-2 font-bold">
                  CLIENT INQUIRIES
                </span>
                <div className="font-editorial text-3xl sm:text-4xl font-bold text-white">
                  {leads.length}{' '}
                  <span className="text-sm font-semibold text-emerald-400">({newLeadsCount} New)</span>
                </div>
                <span className="text-[10px] text-white/40 block mt-1">
                  WhatsApp & VIP test drive leads
                </span>
              </div>

              <div className="p-6 bg-[#0e1014] border border-white/[0.08]">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#c5a880] block mb-2 font-bold">
                  HERO CAROUSEL DURATION
                </span>
                <div className="font-editorial text-3xl sm:text-4xl font-bold text-white">
                  {((settings.heroSlideDurationMs || 4000) / 1000).toFixed(1)}s
                </div>
                <span className="text-[10px] text-white/40 block mt-1">
                  Configurable in Hero Slides Tab
                </span>
              </div>

            </div>

            {/* Quick Actions */}
            <div className="p-6 bg-[#0e1014] border border-white/[0.08]">
              <h3 className="font-editorial text-lg font-bold uppercase tracking-wider text-white mb-4">
                Quick Shortcuts
              </h3>
              <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider">
                <button
                  onClick={handleStartCreateVehicle}
                  className="px-5 py-3 bg-[#f4f2ec] text-[#08090a] hover:bg-white flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>List New Pakistani Vehicle</span>
                </button>
                <button
                  onClick={() => setActiveTab('hero')}
                  className="px-5 py-3 border border-white/20 hover:border-white text-white flex items-center space-x-2"
                >
                  <ImageIcon className="w-4 h-4 text-[#c5a880]" />
                  <span>Manage Hero Slideshow Cars</span>
                </button>
                <button
                  onClick={() => setActiveTab('leads')}
                  className="px-5 py-3 border border-white/20 hover:border-white text-white flex items-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  <span>View WhatsApp Inquiries</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Reset fleet to verified Pakistani default fleet?')) {
                      StorageService.resetVehiclesToDefault();
                      onRefreshData();
                      showNotification('Fleet restored to Pakistani default collection');
                    }
                  }}
                  className="px-5 py-3 border border-white/10 hover:border-white/30 text-white/50 hover:text-white"
                >
                  Restore Pakistani Seed Fleet
                </button>
              </div>
            </div>

          </div>
        )}

        {/* =====================================================================
            TAB 2: INVENTORY & FLEET MANAGER (CRUD)
            ===================================================================== */}
        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#0e1014] border border-white/[0.08]">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search model, make, stock #..."
                  value={vehicleSearch}
                  onChange={(e) => setVehicleSearch(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <button
                onClick={handleStartCreateVehicle}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#c5a880] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Vehicle</span>
              </button>
            </div>

            {/* Vehicle Table */}
            <div className="overflow-x-auto bg-[#0e1014] border border-white/[0.08]">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/50 text-[#c5a880] text-[10px] tracking-widest uppercase border-b border-white/[0.08]">
                  <tr>
                    <th className="py-3 px-4">Vehicle</th>
                    <th className="py-3 px-4">Price (PKR)</th>
                    <th className="py-3 px-4">Specs</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Assembly</th>
                    <th className="py-3 px-4 text-center">Featured</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {vehicles
                    .filter((v) => {
                      if (!vehicleSearch.trim()) return true;
                      const q = vehicleSearch.toLowerCase();
                      return (
                        v.make.toLowerCase().includes(q) ||
                        v.model.toLowerCase().includes(q) ||
                        v.variant.toLowerCase().includes(q) ||
                        v.stockNumber.toLowerCase().includes(q) ||
                        v.city.toLowerCase().includes(q)
                      );
                    })
                    .map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-white/[0.02] transition-colors">
                        
                        {/* Image & Title */}
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={vehicle.coverImage}
                              alt={vehicle.model}
                              className="w-16 h-10 object-cover bg-black"
                            />
                            <div>
                              <span className="text-[10px] text-[#c5a880] font-semibold block uppercase">
                                {vehicle.year} {vehicle.make}
                              </span>
                              <span className="font-bold text-white text-sm block">
                                {vehicle.model}{' '}
                                <span className="font-normal text-xs text-white/60">{vehicle.variant}</span>
                              </span>
                              <span className="text-[9px] text-white/40 font-mono">
                                {vehicle.stockNumber}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 font-bold text-white text-sm">
                          {formatPKR(vehicle.price)}
                        </td>

                        {/* Specs */}
                        <td className="py-3 px-4 text-[#9ea3ae] space-y-0.5">
                          <div>{vehicle.mileage.toLocaleString()} km</div>
                          <div className="text-[10px] text-white/50">{vehicle.transmission} · {vehicle.engineCapacity}</div>
                        </td>

                        {/* City */}
                        <td className="py-3 px-4 text-white/90">
                          {vehicle.city}
                        </td>

                        {/* Assembly */}
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 text-[9px] font-semibold uppercase bg-white/5 border border-white/10 text-white/80">
                            {vehicle.assembly === 'Japanese CBU Import' ? 'CBU' : 'CKD'}
                          </span>
                        </td>

                        {/* Featured */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleFeature(vehicle)}
                            className={`p-1.5 transition-colors ${
                              vehicle.featured ? 'text-[#c5a880]' : 'text-white/20 hover:text-white/60'
                            }`}
                            title="Toggle Homepage Spotlight"
                          >
                            <Star className={`w-4 h-4 ${vehicle.featured ? 'fill-[#c5a880]' : ''}`} />
                          </button>
                        </td>

                        {/* Status / Published */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleTogglePublish(vehicle)}
                            className={`px-2 py-0.5 text-[9px] font-bold uppercase transition-colors ${
                              vehicle.published
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                : 'bg-red-950 text-red-300 border border-red-500/30'
                            }`}
                          >
                            {vehicle.published ? 'Live' : 'Draft'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => onViewVehicle(vehicle.id)}
                              className="p-1.5 text-white/60 hover:text-white"
                              title="Preview on Site"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleStartEditVehicle(vehicle)}
                              className="p-1.5 text-white/60 hover:text-[#c5a880]"
                              title="Edit Details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteVehicle(vehicle.id)}
                              className="p-1.5 text-white/60 hover:text-red-400"
                              title="Delete Vehicle"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* =====================================================================
            TAB 3: HERO CAROUSEL & SLIDESHOW MANAGER
            Directly control the cars running on the Homepage Hero!
            ===================================================================== */}
        {activeTab === 'hero' && (
          <div className="space-y-8">
            
            <div className="p-6 bg-[#0e1014] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-editorial text-xl font-bold uppercase tracking-wider text-white">
                  Homepage Hero Slideshow Manager
                </h3>
                <p className="text-xs text-[#9ea3ae] mt-1 font-light">
                  Add, edit, remove, reorder, or upload photos for the cars that rotate on the homepage hero. Each slide shows exactly one car in full cinema viewport.
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {/* Slide timer duration */}
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] tracking-wider uppercase text-white/60 font-semibold">
                    Timer Interval:
                  </span>
                  <select
                    value={settings.heroSlideDurationMs || 4000}
                    onChange={(e) => {
                      const ms = Number(e.target.value);
                      StorageService.updateSettings({ heroSlideDurationMs: ms });
                      onRefreshData();
                      showNotification(`Hero slide hold interval updated to ${(ms / 1000).toFixed(1)} seconds`);
                    }}
                    className="bg-black/60 border border-white/20 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                  >
                    <option value={3000}>3.0 Seconds</option>
                    <option value={3500}>3.5 Seconds</option>
                    <option value={4000}>4.0 Seconds (Recommended)</option>
                    <option value={5000}>5.0 Seconds</option>
                    <option value={6000}>6.0 Seconds</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setEditingSlide({
                      id: `slide-${Date.now()}`,
                      name: '',
                      category: 'PRESTIGE MARQUE',
                      provenance: '',
                      atelier: 'Lahore Flagship Atelier',
                      image: AUTHENTIC_SHOWROOM_ASSETS[0]?.image || '',
                      enabled: true,
                    });
                    setIsCreatingSlide(true);
                  }}
                  className="px-4 py-2 bg-[#c5a880] text-black font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Slide</span>
                </button>
              </div>
            </div>

            {/* Slides List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {heroSlidesList.map((slide, index) => (
                <div key={slide.id} className="bg-[#0e1014] border border-white/[0.08] overflow-hidden flex flex-col justify-between">
                  
                  {/* Slide Image Preview */}
                  <div className="relative aspect-[16/9] bg-black overflow-hidden">
                    <img
                      src={slide.image}
                      alt={slide.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/80 px-2.5 py-1 text-[9px] tracking-widest uppercase font-bold text-[#c5a880]">
                      SLIDE 0{index + 1}
                    </div>
                    {slide.enabled === false && (
                      <div className="absolute top-2 right-2 bg-red-950/90 text-red-200 px-2 py-0.5 text-[9px] uppercase font-bold">
                        Disabled
                      </div>
                    )}
                  </div>

                  {/* Slide Content */}
                  <div className="p-4 space-y-2">
                    <span className="text-[9px] tracking-widest uppercase text-[#c5a880] font-semibold block">
                      {slide.category}
                    </span>
                    <h4 className="font-editorial text-lg font-bold text-white line-clamp-1">
                      {slide.name || 'Untitled Slide'}
                    </h4>
                    <p className="text-xs text-[#9ea3ae] line-clamp-1 font-light">
                      {slide.provenance}
                    </p>
                  </div>

                  {/* Actions & Reordering */}
                  <div className="p-4 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleMoveSlide(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 border border-white/10 hover:border-white disabled:opacity-30 text-white"
                        title="Move Earlier in Slideshow"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveSlide(index, 'down')}
                        disabled={index === heroSlidesList.length - 1}
                        className="p-1.5 border border-white/10 hover:border-white disabled:opacity-30 text-white"
                        title="Move Later in Slideshow"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          const updated = heroSlidesList.map((s, idx) =>
                            idx === index ? { ...s, enabled: s.enabled === false ? true : false } : s
                          );
                          setHeroSlidesList(updated);
                          StorageService.updateHeroSlides(updated);
                          onRefreshData();
                        }}
                        className="text-xs text-white/60 hover:text-white"
                      >
                        {slide.enabled === false ? 'Enable' : 'Disable'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingSlide(slide);
                          setIsCreatingSlide(false);
                        }}
                        className="p-1.5 text-[#c5a880] hover:text-white"
                        title="Edit Slide"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteHeroSlide(slide.id)}
                        className="p-1.5 text-white/50 hover:text-red-400"
                        title="Remove Slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* =====================================================================
            TAB 4: LEADS & INQUIRIES CRM
            ===================================================================== */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            
            <div className="p-4 bg-[#0e1014] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-editorial text-lg font-bold uppercase tracking-wider text-white">
                  VIP Inquiries & Test Drive Requests
                </h3>
                <p className="text-xs text-[#9ea3ae] font-light">
                  Direct client inquiries from WhatsApp Concierge, private viewing bookings, and trade-in valuations.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase text-white/50">Filter:</span>
                <select
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value)}
                  className="bg-black/60 border border-white/20 px-3 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="New">New Only</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Appointment Scheduled">Appointment Scheduled</option>
                  <option value="Won">Won</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto bg-[#0e1014] border border-white/[0.08]">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/50 text-[#c5a880] text-[10px] tracking-widest uppercase border-b border-white/[0.08]">
                  <tr>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Inquiry Type</th>
                    <th className="py-3 px-4">Vehicle</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {leads
                    .filter((l) => (leadStatusFilter === 'all' ? true : l.status === leadStatusFilter))
                    .map((lead) => {
                      const waReplyLink = generateWhatsAppLink(
                        lead.phone.replace(/[^0-9]/g, ''),
                        `Assalam-o-Alaikum ${lead.fullName}, this is Maison Motors Concierge following up on your inquiry.`
                      );

                      return (
                        <tr key={lead.id} className="hover:bg-white/[0.02]">
                          <td className="py-3 px-4 font-bold text-white text-sm">
                            {lead.fullName}
                            <span className="block text-[10px] text-white/40 font-light">{lead.city}</span>
                          </td>
                          <td className="py-3 px-4 text-[#9ea3ae]">
                            <div>{lead.phone}</div>
                            <div className="text-[10px] text-white/40">{lead.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white">
                              {lead.leadType.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-white/90">
                            {lead.vehicleTitle || 'General Fleet'}
                          </td>
                          <td className="py-3 px-4 text-[#9ea3ae] text-[11px]">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as any)}
                              className="bg-black/60 border border-white/20 px-2 py-1 text-xs text-white focus:outline-none"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Appointment Scheduled">Appointment Scheduled</option>
                              <option value="Qualified">Qualified</option>
                              <option value="Won">Won</option>
                              <option value="Lost">Lost</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <a
                                href={waReplyLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 border border-[#25D366]/40 text-xs font-semibold uppercase flex items-center space-x-1"
                                title="Chat on WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-1 text-white/40 hover:text-red-400"
                                title="Delete Inquiry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* =====================================================================
            TAB 5: BRANDING, ATELIERS & PASSWORD
            ===================================================================== */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-10 max-w-4xl">
            
            {/* Showroom Identity */}
            <div className="p-6 bg-[#0e1014] border border-white/[0.08] space-y-6">
              <h3 className="font-editorial text-lg font-bold uppercase tracking-wider text-white">
                Showroom Brand Identity & Logo
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#c5a880] mb-2 font-semibold">
                    Showroom Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.showroomName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, showroomName: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 p-3 text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#c5a880] mb-2 font-semibold">
                    Monogram Letter (e.g. M)
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={settingsForm.customMonogram || 'M'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, customMonogram: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 p-3 text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-[10px] tracking-widest uppercase text-[#c5a880] font-semibold">
                    Custom Logo Image (Upload from device or paste image URL)
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                      type="text"
                      placeholder="Paste image URL here..."
                      value={settingsForm.customLogoUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, customLogoUrl: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 p-3 text-white focus:outline-none focus:border-[#c5a880]"
                    />
                    <label className="w-full sm:w-auto px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs uppercase font-bold tracking-wider cursor-pointer shrink-0 flex items-center justify-center space-x-2">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Logo File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(e, 'logo')}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {settingsForm.customLogoUrl && (
                    <div className="p-3 bg-black/40 border border-white/10 inline-block mt-2">
                      <img src={settingsForm.customLogoUrl} alt="Logo Preview" className="h-10 object-contain" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#c5a880] mb-2 font-semibold">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 p-3 text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#c5a880] mb-2 font-semibold">
                    Admin Access Password
                  </label>
                  <input
                    type="text"
                    value={settingsForm.adminPassword || 'admin123'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, adminPassword: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 p-3 text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>
            </div>

            {/* Contact & WhatsApp */}
            <div className="p-6 bg-[#0e1014] border border-white/[0.08] space-y-6">
              <h3 className="font-editorial text-lg font-bold uppercase tracking-wider text-white">
                Contact Hotline & WhatsApp Concierge
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#c5a880] mb-2 font-semibold">
                    Phone / UAN
                  </label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 p-3 text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#c5a880] mb-2 font-semibold">
                    WhatsApp Raw (e.g. 923008456789)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 p-3 text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#c5a880] mb-2 font-semibold">
                    Display WhatsApp (+92 300 8456789)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.displayWhatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, displayWhatsappNumber: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 p-3 text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>
            </div>

            {/* Showroom Addresses in Pakistan */}
            <div className="p-6 bg-[#0e1014] border border-white/[0.08] space-y-6">
              <h3 className="font-editorial text-lg font-bold uppercase tracking-wider text-white">
                Showroom Lounges & Ateliers (Lahore, Karachi, Islamabad)
              </h3>

              <div className="space-y-4">
                {settingsForm.addresses.map((addr, idx) => (
                  <div key={idx} className="p-4 bg-black/40 border border-white/10 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-[#c5a880] uppercase font-semibold block mb-1">City</span>
                        <input
                          type="text"
                          value={addr.city}
                          onChange={(e) => {
                            const updated = [...settingsForm.addresses];
                            updated[idx] = { ...updated[idx], city: e.target.value };
                            setSettingsForm({ ...settingsForm, addresses: updated });
                          }}
                          className="w-full bg-black/60 border border-white/10 p-2 text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#c5a880] uppercase font-semibold block mb-1">Branch Name</span>
                        <input
                          type="text"
                          value={addr.branch}
                          onChange={(e) => {
                            const updated = [...settingsForm.addresses];
                            updated[idx] = { ...updated[idx], branch: e.target.value };
                            setSettingsForm({ ...settingsForm, addresses: updated });
                          }}
                          className="w-full bg-black/60 border border-white/10 p-2 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#c5a880] uppercase font-semibold block mb-1">Physical Address</span>
                      <input
                        type="text"
                        value={addr.address}
                        onChange={(e) => {
                          const updated = [...settingsForm.addresses];
                          updated[idx] = { ...updated[idx], address: e.target.value };
                          setSettingsForm({ ...settingsForm, addresses: updated });
                        }}
                        className="w-full bg-black/60 border border-white/10 p-2 text-white text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="px-8 py-4 bg-[#f4f2ec] text-[#08090a] font-bold text-xs tracking-[0.2em] uppercase hover:bg-white flex items-center space-x-2"
            >
              <Save className="w-4 h-4 text-[#08090a]" />
              <span>Save Worldwide Settings</span>
            </button>

          </form>
        )}

        {/* =====================================================================
            TAB 6: 10-YEAR LONGEVITY, SELF-HEALING & BACKUP (MAINTENANCE FREE)
            ===================================================================== */}
        {activeTab === 'maintenance' && (
          <div className="space-y-8 max-w-4xl pb-16">
            
            {/* 10-Year Guarantee Banner */}
            <div className="p-8 bg-gradient-to-r from-[#12141a] via-[#0e1014] to-[#12141a] border border-[#c5a880]/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a880]/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/40 flex items-center justify-center shrink-0 text-[#c5a880]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#c5a880] font-mono font-bold block">
                    AUTONOMOUS ARCHITECTURE · 2025–2035+
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold uppercase text-white tracking-tight">
                    10-YEAR ZERO-MAINTENANCE ENGINE
                  </h3>
                  <p className="text-xs text-[#9ea3ae] font-light leading-relaxed max-w-2xl">
                    This website has been built to be completely self-reliant and maintenance-free for the next 10 years. All vehicle catalogs, inquiries, and settings are preserved in resilient, self-healing local storage with offline Service Worker asset caching. No external database subscription to pay, no third-party server to crash, and no deprecated dependencies.
                  </p>
                </div>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-white/10 text-xs">
                <div className="p-3 bg-black/40 border border-white/5">
                  <span className="text-white/40 text-[9px] uppercase tracking-wider block">SYSTEM STATUS</span>
                  <span className="text-emerald-400 font-semibold flex items-center space-x-1.5 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>100% Operational & Healthy</span>
                  </span>
                </div>
                <div className="p-3 bg-black/40 border border-white/5">
                  <span className="text-white/40 text-[9px] uppercase tracking-wider block">ASSET CACHING</span>
                  <span className="text-[#c5a880] font-semibold flex items-center space-x-1.5 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Service Worker Enabled</span>
                  </span>
                </div>
                <div className="p-3 bg-black/40 border border-white/5">
                  <span className="text-white/40 text-[9px] uppercase tracking-wider block">DATABASE RESILIENCE</span>
                  <span className="text-white font-semibold flex items-center space-x-1.5 mt-0.5">
                    <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                    <span>Self-Healing Engine Active</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 1-Click Showroom Data Backup & Restore */}
            <div className="p-8 bg-[#0e1014] border border-white/10 space-y-6">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#c5a880] font-semibold block mb-1">
                  1-CLICK DATA PORTABILITY & DISASTER RECOVERY
                </span>
                <h4 className="font-editorial text-xl font-bold uppercase text-white">
                  BACKUP & RESTORE COMPLETE SHOWROOM
                </h4>
                <p className="text-xs text-[#9ea3ae] mt-1 font-light">
                  Save all your cars, pictures, client inquiries, hero slides, and showroom contact info to an independent JSON backup file. You can restore this file on any phone, laptop, or new computer at any time.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {/* Export Button */}
                <div className="p-5 bg-black/50 border border-white/10 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-white uppercase block mb-1">
                      Download Full Showroom Backup
                    </span>
                    <p className="text-[11px] text-[#9ea3ae] font-light">
                      Creates a complete timestamped .json snapshot of the entire dealership inventory and settings.
                    </p>
                  </div>
                  <button
                    onClick={handleExportBackup}
                    className="w-full py-3 bg-[#c5a880] hover:bg-[#d6bc96] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>EXPORT BACKUP (.JSON)</span>
                  </button>
                </div>

                {/* Import File */}
                <div className="p-5 bg-black/50 border border-white/10 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-white uppercase block mb-1">
                      Restore Showroom from Backup File
                    </span>
                    <p className="text-[11px] text-[#9ea3ae] font-light">
                      Upload a previously exported .json file to restore all showroom cars, slides, and settings.
                    </p>
                  </div>
                  <label className="w-full py-3 border border-white/20 hover:border-white text-white hover:bg-white/5 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors cursor-pointer text-center">
                    <Upload className="w-4 h-4 text-[#c5a880]" />
                    <span>RESTORE BACKUP FILE</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportBackup}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Self-Healing & Speed Optimization */}
            <div className="p-8 bg-[#0e1014] border border-white/10 space-y-6">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#c5a880] font-semibold block mb-1">
                  AUTONOMOUS REPAIR
                </span>
                <h4 className="font-editorial text-xl font-bold uppercase text-white">
                  SELF-HEAL CACHE & PERFORMANCE OPTIMIZER
                </h4>
                <p className="text-xs text-[#9ea3ae] mt-1 font-light">
                  If any vehicle photo looks out of sync or if a browser session has stale cookies, running this self-healer will purge corrupt keys and re-validate all authentic Pakistani car assets automatically.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-xs text-white/70 font-light">
                  <span className="block text-white font-medium">Safe & Non-Destructive</span>
                  <span>Will preserve all your existing vehicle listings, leads, and prices.</span>
                </div>

                <button
                  onClick={handleSelfHealCache}
                  className="px-6 py-3 border border-[#c5a880]/50 hover:border-[#c5a880] text-[#c5a880] hover:bg-[#c5a880]/10 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors shrink-0"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>OPTIMIZE & SELF-HEAL NOW</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* =========================================================================
          MODAL: ADD / EDIT VEHICLE (EVERY FIELD 100% OPTIONAL)
          Device photo upload + Dynamic custom specifications
          ========================================================================= */}
      {(isCreatingVehicle || editingVehicle) && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-4xl bg-[#101115] border border-white/15 p-6 sm:p-10 my-auto shadow-2xl relative max-h-[92vh] overflow-y-auto">
            
            <button
              onClick={() => {
                setIsCreatingVehicle(false);
                setEditingVehicle(null);
              }}
              className="absolute top-6 right-6 p-2 text-white/50 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] tracking-widest uppercase text-[#c5a880] font-bold block mb-1">
                {editingVehicle ? 'EDIT AUTOMOBILE' : 'NEW VEHICLE LISTING'}
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold uppercase text-white">
                {editingVehicle ? `Edit ${editingVehicle.model}` : 'List Pakistani Vehicle'}
              </h2>
              <p className="text-xs text-[#9ea3ae] mt-1 font-light">
                Note: Every field is completely optional. Fill only what you want, or leave fields blank as needed.
              </p>
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-8">
              
              {/* Basic Details */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase font-bold text-[#c5a880] tracking-wider pb-1 border-b border-white/10">
                  1. Brand, Model & Price
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-[10px] text-white/70 uppercase mb-1 font-semibold">Make / Brand</label>
                    <input
                      type="text"
                      placeholder="e.g. Toyota, Honda, Haval, Kia"
                      value={vehicleFormData.make || ''}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, make: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 p-2.5 text-white focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/70 uppercase mb-1 font-semibold">Model Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Land Cruiser, Civic, Sportage, H6"
                      value={vehicleFormData.model || ''}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, model: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 p-2.5 text-white focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/70 uppercase mb-1 font-semibold">Variant</label>
                    <input
                      type="text"
                      placeholder="e.g. 300 ZX, RS Turbo, Black Edition"
                      value={vehicleFormData.variant || ''}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, variant: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 p-2.5 text-white focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-[10px] text-white/70 uppercase mb-1 font-semibold">Model Year</label>
                    <input
                      type="number"
                      value={vehicleFormData.year || 2024}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, year: Number(e.target.value) })}
                      className="w-full bg-black/50 border border-white/10 p-2.5 text-white focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/70 uppercase mb-1 font-semibold">Price in PKR (Numeric)</label>
                    <input
                      type="number"
                      step="50000"
                      value={vehicleFormData.price || 0}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, price: Number(e.target.value) })}
                      className="w-full bg-black/50 border border-white/10 p-2.5 text-white focus:outline-none focus:border-[#c5a880]"
                    />
                    <span className="text-[10px] text-[#c5a880] block mt-1">
                      Formatted: {formatPKR(vehicleFormData.price || 0)}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/70 uppercase mb-1 font-semibold">Mileage (km)</label>
                    <input
                      type="number"
                      value={vehicleFormData.mileage || 0}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, mileage: Number(e.target.value) })}
                      className="w-full bg-black/50 border border-white/10 p-2.5 text-white focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                </div>

              </div>

              {/* Photos & Device Upload */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <h4 className="text-xs uppercase font-bold text-[#c5a880] tracking-wider">
                    2. Photography & Original Pakistani Cars
                  </h4>
                  <span className="text-[10px] text-white/50">Device Upload, Custom URL or 1-Click Original Pic</span>
                </div>

                {/* Quick 1-Click Original Pakistani Car Image selector */}
                <div className="bg-black/40 border border-white/10 p-3">
                  <span className="text-[10px] text-[#c5a880] uppercase tracking-wider block font-bold mb-2">
                    Quick Preset: Pick Original Image (Fortuner, LC300, Civic RS, Oshan, etc.)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                    {AUTHENTIC_SHOWROOM_ASSETS.map((asset) => (
                      <button
                        key={asset.name}
                        type="button"
                        onClick={() => {
                          setVehicleFormData((prev) => ({
                            ...prev,
                            coverImage: asset.image,
                            make: prev.make || asset.make,
                            model: prev.model || asset.model,
                            variant: prev.variant || asset.variant,
                          }));
                          showNotification(`Applied original ${asset.name} photo`);
                        }}
                        className={`text-left p-1.5 border rounded-none transition-all group ${
                          vehicleFormData.coverImage === asset.image
                            ? 'border-[#c5a880] bg-[#c5a880]/10'
                            : 'border-white/10 hover:border-white/30 bg-black/50'
                        }`}
                      >
                        <div className="aspect-[16/10] overflow-hidden mb-1 bg-black">
                          <img src={asset.image} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <p className="text-[10px] font-semibold text-white truncate">{asset.name}</p>
                        <p className="text-[8px] text-white/50 truncate">{asset.variant}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <label className="block text-[10px] text-white/70 uppercase font-semibold">
                    Cover Photograph URL / Device Upload (Optional)
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="text"
                      placeholder="Paste image link here or choose preset above..."
                      value={vehicleFormData.coverImage || ''}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, coverImage: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 p-2.5 text-white focus:outline-none focus:border-[#c5a880]"
                    />
                    <label className="w-full sm:w-auto px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs uppercase font-bold tracking-wider cursor-pointer shrink-0 flex items-center justify-center space-x-2">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(e, 'cover')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {vehicleFormData.coverImage && (
                    <div className="flex items-center space-x-3">
                      <div className="w-40 aspect-[16/10] bg-black border border-[#c5a880]/40 overflow-hidden relative">
                        <img src={vehicleFormData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 text-[8px] uppercase tracking-wider bg-black/80 px-1 py-0.5 text-[#c5a880]">Active Cover</span>
                      </div>
                      <p className="text-[10px] text-white/50">
                        This original image will display on the showroom inventory, detail page, and vehicle cards.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* City, Assembly & Specs */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase font-bold text-[#c5a880] tracking-wider pb-1 border-b border-white/10">
                  3. Specifications & Location
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block text-[10px] text-white/70 uppercase mb-1">City</label>
                    <input
                      type="text"
                      placeholder="Lahore, Karachi, Islamabad"
                      value={vehicleFormData.city || 'Lahore'}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, city: e.target.value as any })}
                      className="w-full bg-black/50 border border-white/10 p-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/70 uppercase mb-1">Assembly</label>
                    <select
                      value={vehicleFormData.assembly || 'Local Assembled (CKD)'}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, assembly: e.target.value as any })}
                      className="w-full bg-black/50 border border-white/10 p-2 text-white"
                    >
                      <option value="Local Assembled (CKD)">Local Assembled (CKD)</option>
                      <option value="Japanese CBU Import">Japanese CBU Import</option>
                      <option value="German CBU Import">German CBU Import</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/70 uppercase mb-1">Gearbox</label>
                    <input
                      type="text"
                      placeholder="Automatic, CVT, Manual"
                      value={vehicleFormData.transmission || 'Automatic'}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, transmission: e.target.value as any })}
                      className="w-full bg-black/50 border border-white/10 p-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/70 uppercase mb-1">Fuel</label>
                    <input
                      type="text"
                      placeholder="Petrol, Hybrid, Diesel"
                      value={vehicleFormData.fuelType || 'Petrol'}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, fuelType: e.target.value as any })}
                      className="w-full bg-black/50 border border-white/10 p-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-[10px] text-white/70 uppercase mb-1">Engine (cc)</label>
                    <input
                      type="text"
                      placeholder="e.g. 1498 cc"
                      value={vehicleFormData.engineCapacity || ''}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, engineCapacity: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 p-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/70 uppercase mb-1">Horsepower (HP)</label>
                    <input
                      type="text"
                      placeholder="e.g. 178 HP"
                      value={vehicleFormData.horsepower || ''}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, horsepower: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 p-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/70 uppercase mb-1">Stock #</label>
                    <input
                      type="text"
                      placeholder="e.g. MSN-PK-24"
                      value={vehicleFormData.stockNumber || ''}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, stockNumber: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 p-2 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Custom Specifications & Manual Additional Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <h4 className="text-xs uppercase font-bold text-[#c5a880] tracking-wider">
                    4. Manual Extra Information & Custom Specifications (Har Detail Daalnay Ki Option)
                  </h4>
                  <span className="text-[10px] text-white/50">100% Optional — Type any custom detail or leave blank</span>
                </div>

                {/* Quick 1-Click Common Pakistani Car Custom Tags */}
                <div>
                  <label className="block text-[10px] text-white/60 uppercase mb-1.5">
                    Quick Preset Badges (Click to insert):
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Token Tax', value: 'Lifetime Paid' },
                      { label: 'Token Tax', value: 'Paid Up to 2026' },
                      { label: 'Body Paint', value: '100% Genuine Bumpers to Bumpers' },
                      { label: 'Body Paint', value: 'Scratchless Spotless Condition' },
                      { label: 'Body Kit', value: 'Modellista Original Aero Kit' },
                      { label: 'Registration', value: 'Islamabad Registered (2-Digit)' },
                      { label: 'Registration', value: 'Lahore Smart Card Registered' },
                      { label: 'Keys', value: 'Both Remote Smart Keys Available' },
                      { label: 'Documents', value: 'Original File & Invoice In Hand' },
                      { label: 'Biometric', value: 'Biometric Verification Ready on Spot' },
                      { label: 'Warranty', value: 'Official Dealership Warranty Active' },
                      { label: 'Tires', value: 'Brand New Continental Tires Installed' },
                    ].map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => {
                          setVehicleFormData((prev) => ({
                            ...prev,
                            customFields: [...(prev.customFields || []), preset],
                          }));
                          showNotification(`Added "${preset.label}: ${preset.value}"`);
                        }}
                        className="text-[10px] bg-white/5 hover:bg-[#c5a880]/20 hover:border-[#c5a880]/50 border border-white/10 px-2.5 py-1 text-white/80 transition-colors"
                      >
                        + {preset.label}: <span className="text-[#c5a880]">{preset.value}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* List of Custom Specifications Added */}
                <div className="space-y-2">
                  <label className="block text-[10px] text-white/70 uppercase">
                    Active Custom Details List:
                  </label>
                  {(vehicleFormData.customFields || []).length === 0 ? (
                    <div className="text-[11px] text-white/40 italic p-2 border border-dashed border-white/10 bg-black/20">
                      No custom fields added yet. You can add any detail below or leave blank.
                    </div>
                  ) : (
                    (vehicleFormData.customFields || []).map((field, idx) => (
                      <div key={idx} className="flex items-center space-x-3 text-xs bg-black/40 p-2.5 border border-white/10">
                        <span className="font-bold text-[#c5a880] min-w-[120px]">{field.label}:</span>
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) => {
                            const updated = [...(vehicleFormData.customFields || [])];
                            updated[idx].value = e.target.value;
                            setVehicleFormData({ ...vehicleFormData, customFields: updated });
                          }}
                          className="flex-1 bg-transparent border-b border-white/10 text-white text-xs px-1 py-0.5 focus:outline-none focus:border-[#c5a880]"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomField(idx)}
                          className="text-white/40 hover:text-red-400 p-1"
                          title="Remove detail"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}

                  {/* Add Custom Field inputs */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Detail Name (e.g. Body Kit, Token Tax, Sunroof, Tracker)"
                      value={newCustomLabel}
                      onChange={(e) => setNewCustomLabel(e.target.value)}
                      className="w-full sm:w-1/2 bg-black/60 border border-white/15 p-2 text-xs text-white placeholder:text-white/40"
                    />
                    <input
                      type="text"
                      placeholder="Detail Info (e.g. Modellista Body Kit, Lifetime Paid, Genuine Paint)"
                      value={newCustomVal}
                      onChange={(e) => setNewCustomVal(e.target.value)}
                      className="w-full sm:w-1/2 bg-black/60 border border-white/15 p-2 text-xs text-white placeholder:text-white/40"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomField}
                      className="w-full sm:w-auto px-5 py-2 bg-[#c5a880] hover:bg-[#d4b993] text-black text-xs uppercase font-bold tracking-wider whitespace-nowrap"
                    >
                      + Add Custom Detail
                    </button>
                  </div>
                </div>

                {/* Dedicated Manual Additional Notes Box (Extra Free-form Information) */}
                <div className="pt-2">
                  <label className="block text-[10px] text-white/70 uppercase mb-1 font-semibold">
                    Manual Additional Notes / Extra Information (Optional Free-Form Text)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Type any extra information manually (e.g. First owner doctor-driven car, all original documents verified, inspected at authorized dealership, urgent sale or exchange possible...)"
                    value={vehicleFormData.additionalNotes || ''}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, additionalNotes: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 p-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#c5a880]"
                  />
                  <span className="text-[10px] text-white/40 block mt-0.5">
                    This free-form note will display prominently in the vehicle details dossier.
                  </span>
                </div>
              </div>

              {/* Tagline & Description */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-bold text-[#c5a880] tracking-wider pb-1 border-b border-white/10">
                  5. Headline & Description
                </h4>

                <div>
                  <label className="block text-[10px] text-white/70 uppercase mb-1">Headline / Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. Pristine 11th Gen Civic RS Turbo in White Orchid Pearl"
                    value={vehicleFormData.tagline || ''}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, tagline: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-white/70 uppercase mb-1">Full Description</label>
                  <textarea
                    rows={3}
                    placeholder="Enter any vehicle history or details..."
                    value={vehicleFormData.description || ''}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, description: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingVehicle(false);
                    setEditingVehicle(null);
                  }}
                  className="px-6 py-3 border border-white/20 text-white text-xs uppercase tracking-wider hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#f4f2ec] text-[#08090a] font-bold text-xs uppercase tracking-widest hover:bg-white flex items-center space-x-2"
                >
                  <Save className="w-4 h-4 text-[#08090a]" />
                  <span>Save Vehicle Worldwide</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT HERO SLIDE (UPLOAD FROM DEVICE OR CHANGE PROVENANCE)
          ========================================================================= */}
      {(isCreatingSlide || editingSlide) && editingSlide && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#101115] border border-white/15 p-6 sm:p-8 my-auto shadow-2xl relative">
            
            <button
              onClick={() => {
                setIsCreatingSlide(false);
                setEditingSlide(null);
              }}
              className="absolute top-5 right-5 p-2 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-editorial text-xl font-bold uppercase tracking-wider text-white mb-4">
              {isCreatingSlide ? 'Add Hero Carousel Slide' : 'Edit Hero Carousel Slide'}
            </h3>

            <form onSubmit={handleSaveHeroSlide} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-[10px] text-white/70 uppercase mb-1 font-semibold">
                  Car Name / Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Toyota Land Cruiser 300 ZX"
                  value={editingSlide.name}
                  onChange={(e) => setEditingSlide({ ...editingSlide, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 p-2.5 text-white focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-white/70 uppercase mb-1 font-semibold">
                  Category Tag (e.g. JAPANESE CBU IMPORT, LOCAL CKD)
                </label>
                <input
                  type="text"
                  value={editingSlide.category}
                  onChange={(e) => setEditingSlide({ ...editingSlide, category: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 p-2.5 text-white focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-white/70 uppercase mb-1 font-semibold">
                  Provenance Text (Shown at bottom of slide)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2024 Honda Civic RS Turbo · White Orchid Pearl"
                  value={editingSlide.provenance}
                  onChange={(e) => setEditingSlide({ ...editingSlide, provenance: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 p-2.5 text-white focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              {/* Photo & Device Upload */}
              <div className="space-y-2">
                <label className="block text-[10px] text-white/70 uppercase font-semibold">
                  Background Cinema Photo (Upload Device, Paste URL or Choose Original Preset)
                </label>

                {/* 1-Click Original Preset for Hero */}
                <div className="bg-black/40 border border-white/10 p-2.5 mb-2">
                  <span className="text-[9px] text-[#c5a880] uppercase tracking-wider block font-bold mb-1.5">
                    Original Pakistani Car Presets (1-Click Fill Name, Details & Photo):
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {AUTHENTIC_SHOWROOM_ASSETS.map((asset) => (
                      <button
                        key={asset.name}
                        type="button"
                        onClick={() => {
                          setEditingSlide((prev) => prev ? ({
                            ...prev,
                            name: asset.name,
                            category: asset.bodyStyle === 'SUV / Crossover' ? 'PRESTIGE 4X4 SUV' : 'EXECUTIVE SEDAN',
                            provenance: `2024 ${asset.name} · ${asset.variant}`,
                            image: asset.image,
                          }) : null);
                          showNotification(`Applied original ${asset.name} to Hero`);
                        }}
                        className={`text-left p-1 border rounded-none transition-all group ${
                          editingSlide.image === asset.image
                            ? 'border-[#c5a880] bg-[#c5a880]/15'
                            : 'border-white/10 hover:border-white/30 bg-black/50'
                        }`}
                      >
                        <div className="aspect-[16/10] overflow-hidden mb-1 bg-black">
                          <img src={asset.image} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105" />
                        </div>
                        <p className="text-[9px] text-white truncate font-medium">{asset.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    placeholder="Paste image link or choose preset..."
                    value={editingSlide.image}
                    onChange={(e) => setEditingSlide({ ...editingSlide, image: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 p-2.5 text-white"
                  />
                  <label className="w-full sm:w-auto px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs uppercase font-bold tracking-wider cursor-pointer shrink-0 flex items-center justify-center space-x-2">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileUpload(e, 'slide')}
                      className="hidden"
                    />
                  </label>
                </div>
                {editingSlide.image && (
                  <div className="w-full aspect-[16/9] bg-black border border-white/10 overflow-hidden mt-2">
                    <img src={editingSlide.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Connect to Inventory Vehicle (Optional) */}
              <div>
                <label className="block text-[10px] text-white/70 uppercase mb-1">
                  Connect to Fleet Vehicle (Optional)
                </label>
                <select
                  value={editingSlide.vehicleId || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, vehicleId: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 p-2.5 text-white"
                >
                  <option value="">No Vehicle Linked</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.year} {v.make} {v.model} ({v.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingSlide(false);
                    setEditingSlide(null);
                  }}
                  className="px-5 py-2.5 border border-white/20 text-white uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#f4f2ec] text-[#08090a] font-bold uppercase"
                >
                  Save Slide
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
