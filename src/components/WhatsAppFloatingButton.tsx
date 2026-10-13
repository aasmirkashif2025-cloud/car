import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { generateWhatsAppLink } from '../utils/formatters';

interface WhatsAppFloatingButtonProps {
  whatsappNumber: string;
  showroomName: string;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  whatsappNumber,
  showroomName,
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(true);

  const defaultMessage = `Assalam-o-Alaikum, I would like to speak with a VIP Concierge at ${showroomName} regarding your automotive collection and private viewing.`;
  const url = generateWhatsAppLink(whatsappNumber, defaultMessage);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-3">
      {tooltipVisible && (
        <div className="hidden sm:flex items-center bg-[#121316] border border-white/20 px-3.5 py-2 shadow-2xl animate-fade-in text-xs">
          <span className="text-white font-medium mr-2">
            VIP WhatsApp Concierge Available
          </span>
          <button
            onClick={() => setTooltipVisible(false)}
            className="text-[#9ea3ae] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black shadow-[0_10px_25px_rgba(37,211,102,0.4)] flex items-center justify-center transition-all duration-300 hover:scale-110 group focus:outline-none"
        title="Chat with VIP Concierge on WhatsApp"
      >
        <MessageSquare className="w-6 h-6 text-black fill-black" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white rounded-full border-2 border-[#121316] animate-ping" />
      </a>
    </div>
  );
};
