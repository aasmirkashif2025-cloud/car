import React, { useState } from 'react';
import { Calculator, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatPKR, formatExactPKR } from '../utils/formatters';

interface FinancingCalculatorProps {
  initialPrice?: number;
  vehicleTitle?: string;
  onApplyFinancing?: (details: {
    financingType: 'Islamic Ijarah' | 'Conventional Auto Loan';
    preferredBank: 'Meezan Bank' | 'Bank Alfalah' | 'HBL' | 'Dubai Islamic Bank';
    downPaymentPercentage: number;
    tenureYears: number;
    calculatedMonthlyInstallmentPKR: number;
  }) => void;
}

export const FinancingCalculator: React.FC<FinancingCalculatorProps> = ({
  initialPrice = 9850000,
  vehicleTitle,
  onApplyFinancing,
}) => {
  const [price, setPrice] = useState<number>(initialPrice);
  const [financingType, setFinancingType] = useState<'Islamic Ijarah' | 'Conventional Auto Loan'>('Islamic Ijarah');
  const [preferredBank, setPreferredBank] = useState<'Meezan Bank' | 'Bank Alfalah' | 'HBL' | 'Dubai Islamic Bank'>('Meezan Bank');
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30);
  const [tenureYears, setTenureYears] = useState<number>(3);
  const [annualProfitRate, setAnnualProfitRate] = useState<number>(18.5); // KIBOR + margin prevailing benchmark

  // Calculations
  const downPaymentAmount = Math.round((price * downPaymentPercent) / 100);
  const financedPrincipal = price - downPaymentAmount;
  const totalMonths = tenureYears * 12;
  const monthlyRate = (annualProfitRate / 100) / 12;
  
  // Standard Amortization / Islamic Diminishing Musharakah monthly rental formula:
  // EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const monthlyInstallment = Math.round(
    (financedPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  const handleApply = () => {
    if (onApplyFinancing) {
      onApplyFinancing({
        financingType,
        preferredBank,
        downPaymentPercentage: downPaymentPercent,
        tenureYears,
        calculatedMonthlyInstallmentPKR: monthlyInstallment,
      });
    }
  };

  return (
    <div className="py-14 hairline-t relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 hairline-b">
        <div>
          <div className="flex items-center space-x-2 text-[#c5a880] text-xs font-semibold uppercase tracking-[0.2em] mb-1">
            <Calculator className="w-3.5 h-3.5" />
            <span>Pakistan Auto Finance Estimator</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
            Islamic Ijarah & Conventional Financing
          </h3>
          {vehicleTitle && (
            <p className="text-xs text-[#9ea3ae] mt-1">
              Configured for: <span className="text-white font-medium">{vehicleTitle}</span>
            </p>
          )}
        </div>

        {/* Financing Mode Switcher */}
        <div className="flex bg-[#0b0c0e] p-1 border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setFinancingType('Islamic Ijarah')}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
              financingType === 'Islamic Ijarah'
                ? 'bg-[#c5a880] text-black'
                : 'text-[#9ea3ae] hover:text-white'
            }`}
          >
            Islamic Ijarah (Shariah Compliant)
          </button>
          <button
            onClick={() => setFinancingType('Conventional Auto Loan')}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
              financingType === 'Conventional Auto Loan'
                ? 'bg-white text-black'
                : 'text-[#9ea3ae] hover:text-white'
            }`}
          >
            Conventional
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sliders and Configuration */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Vehicle Price Input */}
          <div>
            <div className="flex justify-between text-xs tracking-wider mb-2">
              <span className="text-[#9ea3ae] uppercase">Automobile Value (PKR)</span>
              <span className="font-bold text-white">{formatPKR(price)} ({formatExactPKR(price)})</span>
            </div>
            <input
              type="range"
              min="3000000"
              max="150000000"
              step="500000"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full accent-[#c5a880] h-1 bg-white/10 appearance-none cursor-pointer"
            />
          </div>

          {/* Down Payment % Slider */}
          <div>
            <div className="flex justify-between text-xs tracking-wider mb-2">
              <span className="text-[#9ea3ae] uppercase">Down Payment ({downPaymentPercent}%)</span>
              <span className="font-bold text-[#c5a880]">{formatPKR(downPaymentAmount)}</span>
            </div>
            <input
              type="range"
              min="20"
              max="70"
              step="5"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-[#c5a880] h-1 bg-white/10 appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-white/40 mt-1">
              <span>20% (SBP Min)</span>
              <span>50%</span>
              <span>70%</span>
            </div>
          </div>

          {/* Tenure Selection Buttons */}
          <div>
            <div className="flex justify-between text-xs tracking-wider mb-2">
              <span className="text-[#9ea3ae] uppercase">Financing Tenure</span>
              <span className="font-bold text-white">{tenureYears} Years ({totalMonths} Months)</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setTenureYears(yr)}
                  className={`py-2 text-xs font-semibold tracking-wider border transition-all ${
                    tenureYears === yr
                      ? 'border-[#c5a880] bg-[#c5a880]/10 text-[#c5a880]'
                      : 'border-white/10 bg-white/[0.02] text-[#9ea3ae] hover:text-white hover:border-white/20'
                  }`}
                >
                  {yr} {yr === 1 ? 'Year' : 'Years'}
                </button>
              ))}
            </div>
          </div>

          {/* Partner Bank Selector */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#9ea3ae] mb-2">
              Preferred Banking Partner
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Meezan Bank', 'Bank Alfalah', 'HBL', 'Dubai Islamic Bank'] as const).map((bank) => (
                <button
                  key={bank}
                  onClick={() => setPreferredBank(bank)}
                  className={`p-2.5 text-[11px] font-medium border text-center transition-colors ${
                    preferredBank === bank
                      ? 'border-white bg-white/10 text-white'
                      : 'border-white/10 text-[#9ea3ae] hover:border-white/20'
                  }`}
                >
                  {bank}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Results Card */}
        <div className="lg:col-span-5 bg-[#0b0c0e] border border-white/10 p-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#c5a880] font-semibold block mb-1">
              {financingType === 'Islamic Ijarah' ? 'Estimated Monthly Ijarah Rental' : 'Estimated Monthly Installment'}
            </span>
            <div className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
              {formatExactPKR(monthlyInstallment)}
              <span className="text-xs font-sans font-normal text-[#9ea3ae]"> / month</span>
            </div>
            <p className="text-[11px] text-[#9ea3ae] leading-relaxed mb-6">
              Calculated at prevailing benchmark rate of {annualProfitRate}% per annum via {preferredBank}. Taxes and comprehensive takaful insurance included.
            </p>

            <div className="space-y-2.5 py-4 border-y border-white/[0.08] text-xs">
              <div className="flex justify-between text-[#9ea3ae]">
                <span>Down Payment Required</span>
                <span className="text-white font-medium">{formatExactPKR(downPaymentAmount)}</span>
              </div>
              <div className="flex justify-between text-[#9ea3ae]">
                <span>Financed Capital Amount</span>
                <span className="text-white font-medium">{formatExactPKR(financedPrincipal)}</span>
              </div>
              <div className="flex justify-between text-[#9ea3ae]">
                <span>Financing Period</span>
                <span className="text-white font-medium">{totalMonths} Equal Rentals</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4">
            <button
              onClick={handleApply}
              className="w-full py-3.5 bg-[#f4f2ec] hover:bg-white text-black font-semibold text-xs tracking-widest uppercase transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Request Priority Approval</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center justify-center space-x-1.5 text-[10px] text-[#9ea3ae] mt-3">
              <ShieldCheck className="w-3 h-3 text-[#c5a880]" />
              <span>SBP Compliant • Doorstep Documentation Service</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
