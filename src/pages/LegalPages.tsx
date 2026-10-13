import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck, HelpCircle, FileText, Lock } from 'lucide-react';
import { ShowroomSettings } from '../types/crm';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: 'How does Maison Motors verify Japanese CBU auction sheets?',
    a: 'Every Japanese imported vehicle in our fleet is accompanied by an authenticated auction sheet directly cross-referenced with Japanese auction databases (USS Tokyo, CAA, TAA, etc.). We provide clients with the original auction lot number, auction date, inspection grade (e.g. 4.5, 5.0, S), and interior/exterior grade. We guarantee zero odometer tampering and zero unreported accident history.',
  },
  {
    q: 'How does vehicle ownership transfer, biometric, and Excise work in Pakistan?',
    a: 'We ensure 100% legal compliance with Punjab, Sindh, and ICT (Islamabad) Excise & Taxation Departments. All documents including the computerized smart card, original invoice, customs clearance certificate (for CBU imports), and biometric verification from the registered owner are in hand. We facilitate seamless biometric transfers at our showroom or your residence.',
  },
  {
    q: 'Can I purchase a car in Lahore and receive it in Karachi or Islamabad?',
    a: 'Yes. We operate an exclusive inter-city transit service utilizing dedicated single-car enclosed hydraulic carriers. Your automobile is fully transit-insured and delivered directly to your residence in Karachi, Islamabad, Peshawar, or Faisalabad with zero added road mileage.',
  },
  {
    q: 'How does Islamic Auto Ijarah financing work?',
    a: 'We coordinate directly with premier Islamic financial institutions including Meezan Bank Car Ijarah, Bank Alfalah Islamic, and Dubai Islamic Bank. Ijarah operates under the Shariah principle of Diminishing Musharakah or Lease-to-Own, where monthly rentals are paid against vehicle usage without conventional interest (Riba). We assist in fast-tracking documentation and preferential KIBOR benchmark margin rates.',
  },
  {
    q: 'What is the Maison 210-Point Technical Inspection?',
    a: 'Our certified master diagnostic team inspects 210 individual checkpoints using digital paint depth gauges (to detect repainted panels or filler), OBD-II electronic diagnostic computers, hydraulic lift suspension analysis, and high-temperature powertrain compression tests. A comprehensive report is handed over to every buyer.',
  },
];

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#0b0c0e] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center space-x-2 text-[#c5a880] text-xs font-semibold uppercase tracking-[0.25em] mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Client Clarity</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white uppercase tracking-tight">
            FREQUENTLY ASKED QUESTIONS.
          </h1>
          <p className="text-xs sm:text-sm text-[#9ea3ae] mt-2">
            Essential information regarding Pakistani automotive laws, Japanese imports, biometric transfers, and Islamic Ijarah.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[#121316] border border-white/[0.08] transition-colors"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-display text-base font-bold text-white hover:text-[#c5a880] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-[#c5a880] shrink-0" /> : <ChevronDown className="w-5 h-5 text-white/50 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#9ea3ae] leading-relaxed border-t border-white/[0.04]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC<{ settings: ShowroomSettings }> = ({ settings }) => {
  return (
    <div className="min-h-screen bg-[#0b0c0e] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs text-[#9ea3ae] leading-relaxed">
        <div>
          <div className="flex items-center space-x-2 text-[#c5a880] text-xs font-semibold uppercase tracking-[0.25em] mb-2">
            <Lock className="w-4 h-4" />
            <span>Client Discretion</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white uppercase tracking-tight">
            PRIVACY & CONFIDENTIALITY.
          </h1>
          <p className="mt-2 text-white/60">Last updated: October 2026 • Registered with SECP Pakistan</p>
        </div>

        <div className="bg-[#121316] border border-white/[0.08] p-8 space-y-6">
          <h3 className="font-display text-lg font-bold text-white">1. Executive Discretion Protocol</h3>
          <p>
            At {settings.showroomName}, we recognize that our clients include prominent business leaders, diplomats, and collectors who require complete privacy. We never publish, broadcast, or disclose customer names, transaction values, or residential addresses under any circumstances without prior written authorization.
          </p>

          <h3 className="font-display text-lg font-bold text-white">2. Information Collection & Usage</h3>
          <p>
            Contact details, phone numbers, and vehicle inquiry records collected via our web platform or WhatsApp desk are strictly utilized to coordinate vehicle viewings, Islamic financing applications, or trade-in assessments. We do not sell or exchange customer data with third-party marketing companies.
          </p>

          <h3 className="font-display text-lg font-bold text-white">3. Biometric & Excise Data</h3>
          <p>
            Government-mandated biometric verification data and CNIC details are utilized solely for registration and ownership transfer with relevant provincial Excise and Taxation authorities (Punjab, Sindh, ICT) and are stored in accordance with Pakistani statutory standards.
          </p>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC<{ settings: ShowroomSettings }> = ({ settings }) => {
  return (
    <div className="min-h-screen bg-[#0b0c0e] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs text-[#9ea3ae] leading-relaxed">
        <div>
          <div className="flex items-center space-x-2 text-[#c5a880] text-xs font-semibold uppercase tracking-[0.25em] mb-2">
            <FileText className="w-4 h-4" />
            <span>Dealership Governance</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white uppercase tracking-tight">
            TERMS & CONDITIONS.
          </h1>
          <p className="mt-2 text-white/60">Maison Motors (Pvt) Ltd. Showroom Governance</p>
        </div>

        <div className="bg-[#121316] border border-white/[0.08] p-8 space-y-6">
          <h3 className="font-display text-lg font-bold text-white">1. Inventory & Pricing</h3>
          <p>
            All listed prices are displayed in Pakistani Rupees (PKR) and encompass applicable commercial import customs duties, luxury taxes, and documentation unless explicitly indicated otherwise. While we strive for complete accuracy, listing prices and availability are subject to prior sale or confirmation at our ateliers.
          </p>

          <h3 className="font-display text-lg font-bold text-white">2. Inspection & Provenance Guarantee</h3>
          <p>
            Every client is entitled to an independent pre-purchase inspection by their appointed technician or automotive engineer at our Lahore, Karachi, or Islamabad lounges prior to execution of sale.
          </p>

          <h3 className="font-display text-lg font-bold text-white">3. Vehicle Reservation & Deposits</h3>
          <p>
            Vehicles may be reserved for a period of up to 72 hours upon execution of an official booking token. In the event of a cancellation due to verifiable misrepresentation of vehicle specifications, tokens are refunded in full.
          </p>
        </div>
      </div>
    </div>
  );
};
