import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const Accordion = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-4 px-2 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
            >
                <span className="font-semibold text-gray-800 uppercase text-sm">{title}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="px-2 pb-4">{children}</div>}
        </div>
    );
};