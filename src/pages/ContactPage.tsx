import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { ShowroomSettings } from '../types/crm';
import { StorageService } from '../services/storageService';
import { generateWhatsAppLink, isValidPakistaniPhone } from '../utils/formatters';

interface ContactPageProps {
  settings: ShowroomSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Lahore');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!phone.trim() || !isValidPakistaniPhone(phone)) {
      setError('Please provide a valid Pakistani contact number.');
      return;
    }

    StorageService.addLead({
      id: `lead-contact-${Date.now()}`,
      leadType: 'general_enquiry',
      status: 'New',
      fullName: fullName.trim(),
      email: email.trim() || 'concierge@client.pk',
      phone: phone.trim(),
      city,
      preferredContactMethod: 'whatsapp',
      message: message.trim() || 'General inquiry from Maison Motors website',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setSubmitted(true);
  };

  const whatsAppLink = generateWhatsAppLink(
    settings.whatsappNumber,
    'Assalam-o-Alaikum, I am contacting Maison Motors Concierge Desk.'
  );

  return (
    <div className="min-h-screen bg-[#0b0c0e] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center space-x-2 text-[#c5a880] text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            <span className="w-8 h-[1px] bg-[#c5a880]" />
            <span>Executive Dialogue</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-6xl font-bold text-white uppercase tracking-tight leading-tight">
            CONNECT WITH CONCIERGE.
          </h1>
          <p className="text-sm sm:text-base text-[#9ea3ae] mt-4 font-light leading-relaxed">
            Our Senior Automotive Curators in Lahore, Karachi, and Islamabad are at your disposal for private inquiries, custom vehicle sourcing, and executive appointments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 hairline-t pt-16">
          
          {/* Left Column: Direct Contact Info & Showrooms */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight">
                Direct Atelier Desks
              </h3>

              <div className="space-y-4 text-xs font-light">
                <a
                  href={whatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-[#25D366] hover:underline font-semibold py-2 hairline-b"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>VIP WhatsApp: {settings.displayWhatsappNumber}</span>
                </a>

                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="flex items-center space-x-3 text-white hover:text-[#c5a880] transition-colors py-2 hairline-b"
                >
                  <Phone className="w-4 h-4 text-[#c5a880]" />
                  <span>UAN Hotline: {settings.phone}</span>
                </a>

                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center space-x-3 text-[#9ea3ae] hover:text-white transition-colors py-2 hairline-b"
                >
                  <Mail className="w-4 h-4 text-[#c5a880]" />
                  <span>{settings.email}</span>
                </a>
              </div>
            </div>

            {/* Atelier Lounges */}
            <div className="space-y-4 text-xs font-light">
              <h3 className="font-display text-xl font-bold text-white uppercase tracking-tight">
                Pakistan Showrooms
              </h3>
              {settings.addresses.map((loc, idx) => (
                <div key={idx} className="py-3 hairline-b">
                  <span className="text-white font-medium block">{loc.city} ({loc.branch})</span>
                  <span className="text-[#9ea3ae] block mt-0.5">{loc.address}</span>
                  <span className="text-[10px] text-[#c5a880] block mt-0.5">{loc.timing}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#c5a880]/10 border border-[#c5a880] mx-auto flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-[#c5a880]" />
                </div>
                <h3 className="font-display text-2xl font-bold text-white">
                  Message Transmitted
                </h3>
                <p className="text-xs text-[#9ea3ae] max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-white font-medium">{fullName}</span>. A Maison Concierge will respond to your inquiry via WhatsApp or phone at <span className="text-white font-medium">{phone}</span> shortly.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="font-display text-2xl font-bold text-white mb-2">
                  Initiate an Inquiry
                </h3>
                <p className="text-xs text-[#9ea3ae] mb-6">
                  Please submit your specifications or inquiry below. We maintain absolute client discretion.
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-950/50 border border-red-500/40 text-red-200 text-xs">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase text-[10px] text-[#9ea3ae] mb-1 font-semibold">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bilal Ahmed"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#0b0c0e] border border-white/10 p-3 text-white outline-none focus:border-[#c5a880]"
                      />
                    </div>
                    <div>
                      <label className="block uppercase text-[10px] text-[#9ea3ae] mb-1 font-semibold">
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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase text-[10px] text-[#9ea3ae] mb-1 font-semibold">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. bilal@corporate.pk"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#0b0c0e] border border-white/10 p-3 text-white outline-none focus:border-[#c5a880]"
                      />
                    </div>
                    <div>
                      <label className="block uppercase text-[10px] text-[#9ea3ae] mb-1 font-semibold">
                        City of Interest
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#0b0c0e] border border-white/10 p-3 text-white outline-none focus:border-[#c5a880]"
                      >
                        <option value="Lahore">Lahore (Gulberg III)</option>
                        <option value="Karachi">Karachi (Clifton)</option>
                        <option value="Islamabad">Islamabad (F-6)</option>
                        <option value="Other">Other City / Overseas Pakistani</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase text-[10px] text-[#9ea3ae] mb-1 font-semibold">
                      Your Message or Specification Request
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Specify the automobile you wish to inspect, custom import requirements, or financing questions..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-[#0b0c0e] border border-white/10 p-3 text-white outline-none focus:border-[#c5a880]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 bg-[#f4f2ec] hover:bg-white text-black font-bold uppercase tracking-widest text-xs transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Transmit Inquiry</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
