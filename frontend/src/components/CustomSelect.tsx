import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  sub?: string;
  badge?: string;
}

export function CustomSelect({
  label,
  options,
  value,
  onChange,
  icon: Icon
}: {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (val: string) => void;
  icon?: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find((o) => String(o.value) === String(value)) || options[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
      {label && (
        <label className="text-[11px] font-mono uppercase text-[#8C5A54] font-bold block">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#E8D6CF]/70 border border-[#D5AAA2] rounded-xl px-4 py-2.5 text-xs text-[#2A1816] font-semibold flex items-center justify-between transition-all focus:outline-none focus:border-[#8C241E]"
      >
        <div className="flex items-center gap-2.5 truncate">
          {Icon && <Icon className="w-4 h-4 text-[#8C241E] shrink-0" />}
          <span className="truncate">{selectedOption?.label}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[#8C5A54] transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-[#F5EAE6] border border-[#DEBEB7] rounded-2xl shadow-2xl p-2 max-h-64 overflow-y-auto custom-scrollbar">
          {options.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-mono font-medium flex items-center justify-between gap-3 transition-colors ${
                  isSelected
                    ? "bg-[#8C241E] text-[#FDF8F7] font-bold shadow-xs"
                    : "text-[#2A1816] hover:bg-[#EEDBD5]"
                }`}
              >
                <div className="space-y-0.5 truncate flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate">{opt.label}</span>
                    {opt.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${isSelected ? "bg-[#FAF2EE]/20 text-[#FDF8F7]" : "bg-[#EEDBD5] text-[#8C241E] border border-[#D5AAA2]"}`}>
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  {opt.sub && (
                    <p className={`text-[10px] font-mono truncate font-normal ${isSelected ? "text-[#FDF8F7]/70" : "text-[#8C5A54]"}`}>
                      {opt.sub}
                    </p>
                  )}
                </div>

                {isSelected && <Check className="w-4 h-4 text-[#FDF8F7] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
