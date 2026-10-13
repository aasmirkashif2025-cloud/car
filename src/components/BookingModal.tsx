import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { Vehicle } from '../types/vehicle';
import { StorageService } from '../services/storageService';
import { isValidPakistaniPhone } from '../utils/formatters';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVehicle?: Vehicle;
  allVehicles: Vehicle[];
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedVehicle,
  allVehicles,
}) => {
  const [vehicleId, setVehicleId] = useState<string>(selectedVehicle?.id || (allVehicles[0]?.id || ''));
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Lahore');
  const [locationType, setLocationType] = useState<'Showroom Lounge' | 'Executive Doorstep VIP Delivery'>('Showroom Lounge');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('03:00 PM');
  const [notes, setNotes] = useState('');
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'phone' | 'email'>('whatsapp');
  
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!phone.trim() || !isValidPakistaniPhone(phone)) {
      setError('Please provide a valid Pakistani mobile number (e.g. 0300 1234567 or +92 300 1234567).');
      return;
    }
    if (!date) {
      setError('Please choose your preferred appointment date.');
      return;
    }

    const targetVehicle = allVehicles.find((v) => v.id === vehicleId);

    // Create lead in CRM
    StorageService.addLead({
      id: `lead-${Date.now()}`,
      leadType: 'test_drive',
      status: 'New',
      fullName: fullName.trim(),
      email: email.trim() || 'unspecified@client.pk',
      phone: phone.trim(),
      city,
      preferredContactMethod: contactMethod,
      vehicleId: targetVehicle?.id,
      vehicleTitle: targetVehicle ? `${targetVehicle.year} ${targetVehicle.make} ${targetVehicle.model} ${targetVehicle.variant}` : 'General Private Viewing',
      vehiclePrice: targetVehicle?.price,
      preferredDate: date,
      preferredTime: time,
      preferredLocation: locationType,
      message: notes || `Private Viewing request for ${targetVehicle?.make} ${targetVehicle?.model} in ${city}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#121316] border border-white/20 p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#9ea3ae] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#c5a880]/10 border border-[#c5a880] mx-auto flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-[#c5a880]" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white">
              Appointment Confirmed
            </h3>
            <p className="text-sm text-[#9ea3ae] max-w-md mx-auto leading-relaxed">
              Thank you, <span className="text-white font-medium">{fullName}</span>. Our Senior Automotive Concierge will connect with you via <span className="text-white capitalize font-medium">{contactMethod}</span> at <span className="text-white font-medium">{phone}</span> to confirm your private viewing in {city}.
            </p>
            <div className="pt-6">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-white text-black font-semibold text-xs tracking-widest uppercase hover:bg-[#c5a880] transition-colors"
              >
                Return to Showroom
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#c5a880] font-semibold block mb-1">
                VIP Private Concierge
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Book a Private Viewing
              </h2>
              <p className="text-xs text-[#9ea3ae] mt-1">
                Experience exceptional automobiles in an intimate, discreet atmosphere.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/50 border border-red-500/40 text-red-200 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Selected Vehicle */}
              <div>
                <label className="block uppercase tracking-wider text-[#9ea3ae] mb-1 font-semibold text-[10px]">
                  Automobile of Interest
                </label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full bg-[#0b0c0e] border border-white/10 px-3.5 py-2.5 text-white focus:border-[#c5a880] outline-none"
                >
                  {allVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.year} {v.make} {v.model} {v.variant} ({v.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-[#9ea3ae] mb-1 font-semibold text-[10px]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Mehmood"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#0b0c0e] border border-white/10 px-3.5 py-2.5 text-white focus:border-[#c5a880] outline-none"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[#9ea3ae] mb-1 font-semibold text-[10px]">
                    Pakistani Mobile / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0300 8456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0b0c0e] border border-white/10 px-3.5 py-2.5 text-white focus:border-[#c5a880] outline-none"
                  />
                </div>
              </div>

              {/* City & Location Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-[#9ea3ae] mb-1 font-semibold text-[10px]">
                    City
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#0b0c0e] border border-white/10 px-3.5 py-2.5 text-white focus:border-[#c5a880] outline-none"
                  >
                    <option value="Lahore">Lahore (Gulberg III)</option>
                    <option value="Karachi">Karachi (Clifton)</option>
                    <option value="Islamabad">Islamabad (F-6)</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[#9ea3ae] mb-1 font-semibold text-[10px]">
                    Experience Format
                  </label>
                  <select
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value as any)}
                    className="w-full bg-[#0b0c0e] border border-white/10 px-3.5 py-2.5 text-white focus:border-[#c5a880] outline-none"
                  >
                    <option value="Showroom Lounge">Showroom Private Lounge</option>
                    <option value="Executive Doorstep VIP Delivery">Executive Doorstep VIP Delivery</option>
                  </select>
                </div>
              </div>

              {/* Preferred Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-[#9ea3ae] mb-1 font-semibold text-[10px]">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#0b0c0e] border border-white/10 px-3.5 py-2.5 text-white focus:border-[#c5a880] outline-none"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[#9ea3ae] mb-1 font-semibold text-[10px]">
                    Preferred Time
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#0b0c0e] border border-white/10 px-3.5 py-2.5 text-white focus:border-[#c5a880] outline-none"
                  >
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                    <option value="07:00 PM">07:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Contact Method */}
              <div>
                <label className="block uppercase tracking-wider text-[#9ea3ae] mb-1 font-semibold text-[10px]">
                  Preferred Communication Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['whatsapp', 'phone', 'email'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setContactMethod(method)}
                      className={`py-2 text-[11px] font-semibold uppercase tracking-wider border transition-colors ${
                        contactMethod === method
                          ? 'border-[#c5a880] bg-[#c5a880]/10 text-[#c5a880]'
                          : 'border-white/10 text-[#9ea3ae] hover:border-white/20'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block uppercase tracking-wider text-[#9ea3ae] mb-1 font-semibold text-[10px]">
                  Special Requirements or Trade-In Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Also interested in evaluating exchange with my current vehicle..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#0b0c0e] border border-white/10 p-3 text-white focus:border-[#c5a880] outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#f4f2ec] hover:bg-white text-black font-semibold uppercase tracking-widest text-xs transition-all flex items-center justify-center space-x-2"
                >
                  <span>Confirm Private Viewing</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center space-x-1.5 text-[10px] text-[#9ea3ae] text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Strict Client Confidentiality Assured • No Obligations</span>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
