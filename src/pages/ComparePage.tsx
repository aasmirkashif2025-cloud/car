import React from 'react';
import { 
  GitCompare, 
  Trash2, 
  ArrowLeft, 
  Plus, 
  ShieldCheck, 
  ArrowUpRight,
  MessageSquare
} from 'lucide-react';
import { Vehicle } from '../types/vehicle';
import { formatPKR, formatExactPKR, formatMileage, generateWhatsAppLink } from '../utils/formatters';

interface ComparePageProps {
  vehicles: Vehicle[];
  comparedIds: string[];
  onRemoveFromCompare: (id: string) => void;
  onClearCompare: () => void;
  onSelectVehicle: (id: string) => void;
  onNavigateToInventory: () => void;
  whatsappNumber: string;
}

export const ComparePage: React.FC<ComparePageProps> = ({
  vehicles,
  comparedIds,
  onRemoveFromCompare,
  onClearCompare,
  onSelectVehicle,
  onNavigateToInventory,
  whatsappNumber,
}) => {
  const comparedVehicles = vehicles.filter((v) => comparedIds.includes(v.id));

  return (
    <div className="min-h-screen bg-[#08090a] pt-36 sm:pt-44 pb-32">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-16">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14 pb-8 hairline-b">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#c5a880] font-semibold block mb-2">
              TECHNICAL APPRAISAL
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-bold text-white uppercase tracking-tight">
              VEHICLE COMPARISON.
            </h1>
            <p className="text-xs sm:text-sm text-[#9ea3ae] max-w-xl mt-2 font-light">
              Analyze specifications, Pakistani market pricing, powertrain performance, and documentation provenance side-by-side.
            </p>
          </div>

          {comparedVehicles.length > 0 && (
            <div className="flex items-center space-x-4">
              <button
                onClick={onClearCompare}
                className="text-xs tracking-wider uppercase text-[#9ea3ae] hover:text-white transition-colors flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
              <button
                onClick={onNavigateToInventory}
                className="px-6 py-3 bg-[#f4f2ec] text-[#08090a] text-xs font-bold tracking-widest uppercase hover:bg-white transition-colors flex items-center space-x-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add More</span>
              </button>
            </div>
          )}
        </div>

        {comparedVehicles.length === 0 ? (
          <div className="py-24 text-center">
            <GitCompare className="w-10 h-10 text-[#9ea3ae]/50 mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold text-white mb-2 uppercase">
              No Vehicles Selected for Comparison
            </h3>
            <p className="text-xs text-[#9ea3ae] max-w-sm mx-auto mb-8 font-light">
              Select up to 3 vehicles from our inventory to evaluate technical specifications and valuations.
            </p>
            <button
              onClick={onNavigateToInventory}
              className="px-8 py-4 bg-[#f4f2ec] text-[#08090a] font-bold text-xs tracking-widest uppercase hover:bg-white transition-colors"
            >
              Browse Inventory Fleet
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-white/[0.08] text-xs">
              <thead>
                <tr>
                  <th className="p-4 bg-[#121316] text-[#9ea3ae] uppercase text-[10px] tracking-wider w-44 border-b border-r border-white/[0.08]">
                    Vehicle
                  </th>
                  {comparedVehicles.map((v) => (
                    <th key={v.id} className="p-4 bg-[#121316] border-b border-r border-white/[0.08] min-w-[280px]">
                      <div className="relative">
                        <button
                          onClick={() => onRemoveFromCompare(v.id)}
                          className="absolute top-0 right-0 p-1 bg-black/60 hover:bg-red-900/60 text-white/70 hover:text-white rounded"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <img
                          src={v.coverImage}
                          alt={v.model}
                          className="w-full aspect-[16/10] object-cover mb-3 cursor-pointer"
                          onClick={() => onSelectVehicle(v.id)}
                        />
                        <div className="text-[10px] text-[#c5a880] uppercase tracking-wider font-semibold">
                          {v.year} • {v.make}
                        </div>
                        <h4 
                          onClick={() => onSelectVehicle(v.id)}
                          className="font-display text-base font-bold text-white cursor-pointer hover:text-[#c5a880]"
                        >
                          {v.model} {v.variant}
                        </h4>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {/* Price */}
                <tr>
                  <td className="p-4 font-semibold text-[#c5a880] bg-[#121316] border-r border-white/[0.08]">
                    Price (PKR)
                  </td>
                  {comparedVehicles.map((v) => (
                    <td key={v.id} className="p-4 border-r border-white/[0.08] bg-[#0e0f12]">
                      <div className="text-base font-bold text-white font-display">
                        {formatPKR(v.price)}
                      </div>
                      <div className="text-[10px] text-[#9ea3ae]">
                        {formatExactPKR(v.price)}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Power & Torque */}
                <tr>
                  <td className="p-4 text-[#9ea3ae] bg-[#121316] border-r border-white/[0.08]">
                    Horsepower & Torque
                  </td>
                  {comparedVehicles.map((v) => (
                    <td key={v.id} className="p-4 border-r border-white/[0.08] text-white">
                      <strong className="text-sm">{v.horsepower}</strong>
                      {v.torque && <span className="text-[#9ea3ae] ml-2">({v.torque})</span>}
                    </td>
                  ))}
                </tr>

                {/* Engine & Transmission */}
                <tr>
                  <td className="p-4 text-[#9ea3ae] bg-[#121316] border-r border-white/[0.08]">
                    Engine & Gearbox
                  </td>
                  {comparedVehicles.map((v) => (
                    <td key={v.id} className="p-4 border-r border-white/[0.08] text-white">
                      {v.engineCapacity} • {v.transmission}
                    </td>
                  ))}
                </tr>

                {/* Assembly Origin */}
                <tr>
                  <td className="p-4 text-[#9ea3ae] bg-[#121316] border-r border-white/[0.08]">
                    Assembly Origin
                  </td>
                  {comparedVehicles.map((v) => (
                    <td key={v.id} className="p-4 border-r border-white/[0.08] text-white font-medium">
                      {v.assembly}
                    </td>
                  ))}
                </tr>

                {/* Mileage */}
                <tr>
                  <td className="p-4 text-[#9ea3ae] bg-[#121316] border-r border-white/[0.08]">
                    Odometer Mileage
                  </td>
                  {comparedVehicles.map((v) => (
                    <td key={v.id} className="p-4 border-r border-white/[0.08] text-white">
                      {formatMileage(v.mileage)}
                    </td>
                  ))}
                </tr>

                {/* City Location */}
                <tr>
                  <td className="p-4 text-[#9ea3ae] bg-[#121316] border-r border-white/[0.08]">
                    City Atelier
                  </td>
                  {comparedVehicles.map((v) => (
                    <td key={v.id} className="p-4 border-r border-white/[0.08] text-white">
                      {v.city} ({v.showroomBranch.split('-')[1]?.trim() || v.showroomBranch})
                    </td>
                  ))}
                </tr>

                {/* Registration & Token Tax */}
                <tr>
                  <td className="p-4 text-[#9ea3ae] bg-[#121316] border-r border-white/[0.08]">
                    Excise & Tax Status
                  </td>
                  {comparedVehicles.map((v) => (
                    <td key={v.id} className="p-4 border-r border-white/[0.08] text-white">
                      <div>{v.documentation.registrationCity}</div>
                      <div className="text-[#c5a880] text-[11px] font-medium mt-0.5">
                        {v.documentation.tokenTaxStatus}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Auction / Inspection Score */}
                <tr>
                  <td className="p-4 text-[#9ea3ae] bg-[#121316] border-r border-white/[0.08]">
                    Inspection Score
                  </td>
                  {comparedVehicles.map((v) => (
                    <td key={v.id} className="p-4 border-r border-white/[0.08] text-white">
                      {v.inspectionReport ? (
                        <span className="text-emerald-400 font-bold">
                          {v.inspectionReport.score} / 100 Certified
                        </span>
                      ) : (
                        <span className="text-[#9ea3ae]">Standard PDI</span>
                      )}
                      {v.auctionSheet && (
                        <div className="text-[#c5a880] text-[10px] mt-0.5">
                          USS Grade {v.auctionSheet.grade}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr>
                  <td className="p-4 text-[#9ea3ae] bg-[#121316] border-r border-white/[0.08]">
                    Direct Actions
                  </td>
                  {comparedVehicles.map((v) => {
                    const msg = `Assalam-o-Alaikum, I am inquiring from the Maison Motors comparison tool regarding the ${v.year} ${v.make} ${v.model} (${formatPKR(v.price)}).`;
                    const wa = generateWhatsAppLink(whatsappNumber, msg);
                    return (
                      <td key={v.id} className="p-4 border-r border-white/[0.08] space-y-2">
                        <button
                          onClick={() => onSelectVehicle(v.id)}
                          className="w-full py-2 bg-white text-black font-semibold uppercase tracking-wider text-[11px] hover:bg-[#c5a880] transition-colors"
                        >
                          View Full Details
                        </button>
                        <a
                          href={wa}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-1.5 border border-[#25D366]/40 text-[#25D366] text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center space-x-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp Inquire</span>
                        </a>
                      </td>
                    );
                  })}
                </tr>

              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};
