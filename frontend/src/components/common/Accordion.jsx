import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const Accordion = ({ title, children, isOpen = true }) => {
    const [open, setOpen] = useState(isOpen);

    // sincroniza si cambia el prop
    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    return (
        <div className="border-b border-gray-200">
            <button
                onClick={() => setOpen(!open)}
                className="w-full py-4 px-2 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
            >
                <span className="font-semibold text-gray-800 uppercase text-sm">{title}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && <div className="px-2 pb-4">{children}</div>}
        </div>
    );
};