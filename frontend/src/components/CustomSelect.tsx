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
  icon: Icon,
  variant = "erp",
  className = ""
}: {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (val: string) => void;
  icon?: any;
  variant?: "erp" | "landing";
  className?: string;
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

  const isLanding = variant === "landing";

  return (
    <div className={`space-y-1.5 relative ${className}`} ref={containerRef}>
      {label && (
        <label className={`text-[11px] font-mono uppercase font-bold block ${isLanding ? "text-[#E85F57]" : "text-[#8C5A54]"}`}>
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full rounded-xl px-4 py-2.5 text-xs font-semibold flex items-center justify-between transition-all focus:outline-none cursor-pointer ${
          isLanding
            ? "bg-[#353535]/80 border border-white/15 text-white focus:border-[#E85F57] h-12"
            : "bg-[#E8D6CF]/70 border border-[#D5AAA2] text-[#2A1816] focus:border-[#8C241E]"
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {Icon && <Icon className={`w-4 h-4 shrink-0 ${isLanding ? "text-[#E85F57]" : "text-[#8C241E]"}`} />}
          <span className="truncate">{selectedOption?.label}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 shrink-0 ${
            isLanding ? "text-white/60" : "text-[#8C5A54]"
          } ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full mt-2 left-0 right-0 z-50 rounded-2xl shadow-2xl p-2 max-h-64 overflow-y-auto custom-scrollbar ${
            isLanding
              ? "bg-[#2C2A28] border border-[#353535] text-white"
              : "bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816]"
          }`}
        >
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
                className={`w-full text-left p-2.5 rounded-xl text-xs font-mono font-medium flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                  isSelected
                    ? isLanding
                      ? "bg-[#E85F57] text-white font-bold shadow-md"
                      : "bg-[#8C241E] text-[#FDF8F7] font-bold shadow-xs"
                    : isLanding
                    ? "text-white/90 hover:bg-[#353535]"
                    : "text-[#2A1816] hover:bg-[#EEDBD5]"
                }`}
              >
                <div className="space-y-0.5 truncate flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate">{opt.label}</span>
                    {opt.badge && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : isLanding
                            ? "bg-[#E85F57]/20 text-[#E85F57] border border-[#E85F57]/30"
                            : "bg-[#EEDBD5] text-[#8C241E] border border-[#D5AAA2]"
                        }`}
                      >
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  {opt.sub && (
                    <p
                      className={`text-[10px] font-mono truncate font-normal ${
                        isSelected ? (isLanding ? "text-white/70" : "text-[#FDF8F7]/70") : isLanding ? "text-white/50" : "text-[#8C5A54]"
                      }`}
                    >
                      {opt.sub}
                    </p>
                  )}
                </div>

                {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
