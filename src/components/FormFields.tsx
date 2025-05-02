import React from "react";
import { Building2, Briefcase, CreditCard, Home, User, Phone, MapPin, Clock, DollarSign, Key, Check } from "lucide-react";

interface FormFieldProps {
  label: string;
  type: string;
  error?: string;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
  defaultValue?: number;
  value?: string;
  icon?: string;
  description?: string;
  hidden?: boolean;
  onChange: (value: string) => void;
}

const iconMap = {
  building: Building2,
  money: DollarSign,
  clock: Clock,
  map: MapPin,
  user: User,
  phone: Phone,
  briefcase: Briefcase,
  "credit-card": CreditCard,
  home: Home,
  key: Key,
  check: Check,
};

export function FormField({ label, type, placeholder, options, min, max, defaultValue, value, icon, description, error, onChange, hidden }: FormFieldProps) {
  if (hidden) return
  const IconComponent = icon ? iconMap[icon as keyof typeof iconMap] : null;

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(numbers) / 100);
    return formatted;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    let formatted = numbers;
    if (numbers.length > 0) {
      formatted = `(${numbers.slice(0, 2)}`;
      if (numbers.length > 2) {
        formatted += `) ${numbers.slice(2, 7)}`;
        if (numbers.length > 7) {
          formatted += `-${numbers.slice(7, 11)}`;
        }
      }
    }
    return formatted;
  };
  function formatCEP(value: string) {
    if (value.length >= 10) return value.slice(0, 9);
    return value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2");
  }

  if (type === "CEP") {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          {label}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input type="text" placeholder={placeholder} required value={value || ""} onChange={(e) => onChange(formatCEP(e.target.value))} className={`w-full px-4 py-3 bg-[#0f0f0f] rounded-lg border ${error ? "border-red-500" : "border-[#1a1a1a]"} focus:border-[#ffcf02] focus:ring-1 focus:ring-[#ffcf02] text-white placeholder-gray-500`} />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
  function formatCPF(value: string) {
    if (value.length >= 15) return value.slice(0, 14);
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  if (type === "CPF") {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          {label}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input type="text" min={150000} placeholder={placeholder} required value={value || ""} onChange={(e) => onChange(formatCPF(e.target.value))} className={`w-full px-4 py-3 bg-[#0f0f0f] rounded-lg border ${error ? "border-red-500" : "border-[#1a1a1a]"} focus:border-[#ffcf02] focus:ring-1 focus:ring-[#ffcf02] text-white placeholder-gray-500`} />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  if (type === "currency") {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          {label}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input type="text" placeholder={placeholder} required value={value || ""} onChange={(e) => onChange(formatCurrency(e.target.value))} className={`w-full px-4 py-3 bg-[#0f0f0f] rounded-lg border ${error ? "border-red-500" : "border-[#1a1a1a]"} focus:border-[#ffcf02] focus:ring-1 focus:ring-[#ffcf02] text-white placeholder-gray-500`} />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  if (type === "slider") {
    const sliderValue = value ? parseInt(value) : defaultValue || min;
    const [isInteracting, setIsInteracting] = React.useState(false);
    const [sliderRect, setSliderRect] = React.useState<DOMRect | null>(null);
    const sliderRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (sliderRef.current) {
        setSliderRect(sliderRef.current.getBoundingClientRect());
      }
    }, []);

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">{label.replace("{value}", sliderValue?.toString() || "")}</label>
        <div className="relative pt-[50px] pb-14">
          <input
            ref={sliderRef}
            type="range"
            min={min}
            max={max}
            required
            value={sliderValue}
            onMouseDown={() => setIsInteracting(true)}
            onMouseUp={() => setIsInteracting(false)}
            onMouseLeave={() => setIsInteracting(false)}
            onTouchStart={() => setIsInteracting(true)}
            onTouchEnd={() => setIsInteracting(false)}
            onChange={(e) => {
              const value = e.target.value;
              onChange(value);
            }}
            className="w-full h-2 bg-[#0f0f0f] rounded-lg appearance-none cursor-pointer accent-[#ffcf02]"
          />
          {isInteracting && (
            <div
              className="absolute transform -translate-x-1/2 bg-[#ffcf02] text-black px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap"
              style={{
                top: "10px",
                opacity: isInteracting ? 1 : 0,
                left: `${(((sliderValue || 0) - (min || 0)) / ((max || 240) - (min || 0))) * 100}%`,
                minWidth: "80px",
                textAlign: "center",
              }}
            >
              {sliderValue} meses
            </div>
          )}
          <div className="absolute bottom-0 w-full">
            <div className="flex justify-between text-xs text-gray-500">
              <span>{min} meses</span>
              <span>{max} meses</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "radio") {
    return (
      <div className={`space-y-4 ${hidden && "hidden"}`}>
        <label className="block text-sm font-medium text-gray-300">
          {label} <span className="text-red-500 ml-1">*</span>
        </label>
        {description && <p className="text-sm text-gray-500">{description}</p>}
        <div className="grid gap-3">
          {options?.map((option) => (
            <label key={option} className="relative flex items-center p-4 cursor-pointer bg-[#121212] border border-[#1a1a1a] rounded-lg group hover:border-[#ffcf02] transition-colors">
              <input type="radio" name={label} value={option} checked={value === option} onChange={(e) => onChange(e.target.value)} className="absolute opacity-0" />
              <div className="flex items-center gap-3 w-full">
                <div
                  className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${value === option ? "border-[#ffcf02] bg-[#1a1a1a]" : "border-[#1a1a1a]"}
                `}
                >
                  {value === option && <div className="w-2.5 h-2.5 rounded-full bg-[#ffcf02]" />}
                </div>
                <span className="text-sm text-white">{option}</span>
              </div>
            </label>
          ))}
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          {label} <span className="text-red-500 ml-1">*</span>
        </label>
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 bg-[#0f0f0f] rounded-lg border border-[#1a1a1a] focus:border-[#ffcf02] focus:ring-1 focus:ring-[#ffcf02] text-white">
          <option value="">{placeholder}</option>
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  if (type === "phone") {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          {label}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input required type="tel" placeholder={placeholder} value={value || ""} onChange={(e) => onChange(formatPhone(e.target.value))} className={`w-full px-4 py-3 bg-[#0f0f0f] rounded-lg border ${error ? "border-red-500" : "border-[#1a1a1a]"} focus:border-[#ffcf02] focus:ring-1 focus:ring-[#ffcf02] text-white placeholder-gray-500`} />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  if (type === "text" || type === "email") {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          {label}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input type={type} required placeholder={placeholder} value={value || ""} onChange={(e) => onChange(e.target.value)} className={`w-full px-4 py-3 bg-[#0f0f0f] rounded-lg border ${error ? "border-red-500" : "border-[#1a1a1a]"} focus:border-[#ffcf02] focus:ring-1 focus:ring-[#ffcf02] text-white placeholder-gray-500`} />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
  if (type === "date") {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          {label}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input type="date" required value={value || ""} onChange={(e) => onChange(e.target.value)} className={`w-full px-4 py-3 bg-[#0f0f0f] rounded-lg border ${error ? "border-red-500" : "border-[#1a1a1a]"} focus:border-[#ffcf02] focus:ring-1 focus:ring-[#ffcf02] text-white placeholder-gray-500`} />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
  if (value !== undefined) {
    return (
      <div className="flex items-center gap-4 p-5 bg-[#121212] rounded-xl border border-[#1a1a1a] hover:border-[#ffcf02] transition-all duration-200 group hover:shadow-lg hover:shadow-[#ffcf02]/5">
        <div className="flex items-center gap-4 w-full">
          {IconComponent && (
            <div className="p-3 bg-[#1a1a1a] rounded-xl group-hover:bg-[#ffcf02]/10 transition-all duration-200">
              <IconComponent className="w-6 h-6 text-[#ffcf02]" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm text-gray-400 mb-1.5">{label}</p>
            <p className="text-base font-semibold text-white">{value}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {!value && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type === "text" ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const newValue = type === "text" && placeholder?.includes("CEP") ? formatCEP(e.target.value) : e.target.value;
          onChange(newValue);
        }}
        className="w-full px-4 py-3 bg-[#0f0f0f] rounded-lg border border-[#1a1a1a] focus:border-[#ffcf02] focus:ring-1 focus:ring-[#ffcf02] text-white placeholder-gray-500"
      />
    </div>
  );
}
