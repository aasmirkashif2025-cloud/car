import React, { useState } from 'react';
import { RefreshCw, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Vehicle } from '../types/vehicle';
import { StorageService } from '../services/storageService';
import { isValidPakistaniPhone } from '../utils/formatters';

interface TradeInPageProps {
  vehicles: Vehicle[];
  onSelectVehicle: (id: string) => void;
}

export const TradeInPage: React.FC<TradeInPageProps> = ({ vehicles }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Lahore');
  
  // Existing Car Details
  const [tradeMake, setTradeMake] = useState('Toyota');
  const [tradeModel, setTradeModel] = useState('');
  const [tradeYear, setTradeYear] = useState('2021');
  const [tradeMileage, setTradeMileage] = useState('');
  const [tradeRegCity, setTradeRegCity] = useState('Lahore');
  const [expectedValue, setExpectedValue] = useState('');
  const [targetVehicleId, setTargetVehicleId] = useState(vehicles[0]?.id || '');

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!phone.trim() || !isValidPakistaniPhone(phone)) {
      setError('Please provide a valid Pakistani mobile number.');
      return;
    }
    if (!tradeModel.trim()) {
      setError('Please enter your existing car model name.');
      return;
    }

    const targetCar = vehicles.find((v) => v.id === targetVehicleId);

    StorageService.addLead({
      id: `lead-trade-${Date.now()}`,
      leadType: 'trade_in',
      status: 'New',
      fullName: fullName.trim(),
      email: email.trim() || 'tradein@client.pk',
      phone: phone.trim(),
      city,
      preferredContactMethod: 'whatsapp',
      vehicleId: targetCar?.id,
      vehicleTitle: targetCar ? `${targetCar.year} ${targetCar.make} ${targetCar.model}` : 'Open Exchange',
      vehiclePrice: targetCar?.price,
      tradeInVehicle: {
        make: tradeMake,
        model: tradeModel.trim(),
        year: Number(tradeYear),
        mileage: Number(tradeMileage) || 0,
        registeredCity: tradeRegCity,
        expectedValuePKR: Number(expectedValue) || 0,
      },
      message: `Client requests trade-in valuation for ${tradeYear} ${tradeMake} ${tradeModel} towards ${targetCar?.make} ${targetCar?.model}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0c0e] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-2 text-[#c5a880] text-xs font-semibold uppercase tracking-[0.25em] mb-2">
            <RefreshCw className="w-4 h-4" />
            <span>Seamless Exchange</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-white uppercase tracking-tight">
            VEHICLE TRADE-IN VALUATION.
          </h1>
          <p className="text-xs sm:text-sm text-[#9ea3ae] mt-3 leading-relaxed">
            Exchange your current luxury vehicle towards a model in our collection. We offer rigorous scientific appraisals, immediate bank transfers, and seamless excise biometric transfers.
          </p>
        </div>

        {submitted ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#c5a880]/10 border border-[#c5a880] mx-auto flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-[#c5a880]" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white uppercase">
              Valuation Request Received
            </h3>
            <p className="text-xs text-[#9ea3ae] max-w-md mx-auto leading-relaxed font-light">
              Thank you, <span className="text-white font-medium">{fullName}</span>. Our Technical Valuation Director will review your {tradeYear} {tradeMake} {tradeModel} and contact you at <span className="text-white font-medium">{phone}</span> to schedule a free doorstep paint inspection.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-12">
            
            {error && (
              <div className="p-3 bg-red-950/50 border border-red-500/40 text-red-200 text-xs">
                {error}
              </div>
            )}

            {/* Section 1: Target Vehicle */}
            <div className="py-6 hairline-b">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#c5a880] mb-4">
                1. Desired Automobile from Maison Fleet
              </h3>
              <div>
                <label className="block text-[11px] text-[#9ea3ae] uppercase mb-1">
                  Target Vehicle for Exchange
                </label>
                <select
                  value={targetVehicleId}
                  onChange={(e) => setTargetVehicleId(e.target.value)}
                  className="w-full bg-[#0b0c0e] border border-white/10 p-3 text-white text-xs outline-none focus:border-[#c5a880]"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.year} {v.make} {v.model} {v.variant} ({v.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section 2: Current Vehicle */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#c5a880] mb-4 pb-2 border-b border-white/[0.08]">
                2. Your Existing Vehicle Specifications
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-4">
                <div>
                  <label className="block text-[10px] text-[#9ea3ae] uppercase mb-1 font-semibold">
                    Make *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toyota, Honda, Porsche"
                    value={tradeMake}
                    onChange={(e) => setTradeMake(e.target.value)}
                    className="w-full bg-[#0b0c0e] border border-white/10 p-3 text-white outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#9ea3ae] uppercase mb-1 font-semibold">
                    Model & Variant *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fortuner Legender / Civic RS"
                    value={tradeModel}
                    onChange={(e) => setTradeModel(e.target.value)}
                    className="w-full bg-[#0b0c0e] border border-white/10 p-3 text-white outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#9ea3ae] uppercase mb-1 font-semibold">
                    Model Year *
                  </label>
                  <input
                    type="number"
                    required
                    min="2010"
                    max="2025"
                    value={tradeYear}
                    onChange={(e) => setTradeYear(e.target.value)}
                    className="w-full bg-[#0b0c0e] border border-white/10 p-3 text-white outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-[10px] text-[#9ea3ae] uppercase mb-1 font-semibold">
                    Current Mileage (km)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 24000"
                    value={tradeMileage}
                    onChange={(e) => setTradeMileage(e.target.value)}
                    className="w-full bg-[#0b0c0e] border border-white/10 p-3 text-white outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#9ea3ae] uppercase mb-1 font-semibold">
                    Registered Province / City
                  </label>
                  <select
                    value={tradeRegCity}
                    onChange={(e) => setTradeRegCity(e.target.value)}
                    className="w-full bg-[#0b0c0e] border border-white/10 p-3 text-white outline-none focus:border-[#c5a880]"
                  >
                    <option value="Lahore">Lahore (Punjab)</option>
                    <option value="Islamabad">Islamabad (ICT)</option>
                    <option value="Karachi">Karachi (Sindh)</option>
                    <option value="Other">Other Province</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-[#9ea3ae] uppercase mb-1 font-semibold">
                    Expected Value in PKR (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1.2 Crore or 95 Lac"
                    value={expectedValue}
                    onChange={(e) => setExpectedValue(e.target.value)}
                    className="w-full bg-[#0b0c0e] border border-white/10 p-3 text-white outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Contact Details */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#c5a880] mb-4 pb-2 border-b border-white/[0.08]">
                3. Client Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-[10px] text-[#9ea3ae] uppercase mb-1 font-semibold">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asad Ullah Khan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#0b0c0e] border border-white/10 p-3 text-white outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#9ea3ae] uppercase mb-1 font-semibold">
                    Pakistani Mobile / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0300 8456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0b0c0e] border border-white/10 p-3 text-white outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#9ea3ae] uppercase mb-1 font-semibold">
                    City of Inspection
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#0b0c0e] border border-white/10 p-3 text-white outline-none focus:border-[#c5a880]"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 bg-[#f4f2ec] hover:bg-white text-black font-bold uppercase tracking-widest text-xs transition-colors flex items-center justify-center space-x-2"
              >
                <span>Submit Vehicle for Inspection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center space-x-2 text-[10px] text-[#9ea3ae] pt-2">
              <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
              <span>Zero obligation appraisal • Doorstep digital paint thickness meter evaluation</span>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
