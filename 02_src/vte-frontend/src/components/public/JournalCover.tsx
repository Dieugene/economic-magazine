"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

interface JournalCoverProps {
  number: number;
  year: number;
  sequential_number?: number;
  cover_url?: string | null;
  className?: string;
}

export default function JournalCover({
  number,
  year,
  cover_url,
  className = "",
}: JournalCoverProps) {
  const { lang } = useLanguage();

  if (cover_url) {
    return (
      <div className={`aspect-[271/384] rounded-sm overflow-hidden ${className}`}>
        <img
          src={cover_url}
          alt={lang === "en" ? `IET ${year}, No. ${number}` : `ВТЭ ${year}, № ${number}`}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // CSS fallback cover
  const lines = lang === "en"
    ? { top: "I S S U E S", italic: "of theoretical", second: "economics", numLabel: "No." }
    : { top: "В О П Р О С Ы", italic: "теоретической", second: "экономики", numLabel: "№" };

  return (
    <div
      className={`aspect-[271/384] rounded-sm overflow-hidden relative ${className}`}
      style={{ backgroundColor: "#2D3A28" }}
    >
      {/* Geometric pattern — top portion */}
      <div className="absolute inset-x-0 top-0 h-[30%] overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 200 100"
        >
          <defs>
            <pattern
              id="maze"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect width="20" height="20" fill="#3D4A35" />
              <rect x="0" y="0" width="9" height="9" fill="#A0734A" rx="0.5" />
              <rect x="11" y="0" width="9" height="9" fill="#A0734A" rx="0.5" />
              <rect x="0" y="11" width="9" height="9" fill="#A0734A" rx="0.5" />
              <rect x="11" y="11" width="9" height="9" fill="#A0734A" rx="0.5" />
              <rect x="2" y="2" width="5" height="5" fill="#B8864E" rx="0.3" />
              <rect x="13" y="2" width="5" height="5" fill="#B8864E" rx="0.3" />
              <rect x="2" y="13" width="5" height="5" fill="#B8864E" rx="0.3" />
              <rect x="13" y="13" width="5" height="5" fill="#B8864E" rx="0.3" />
              <rect x="3.5" y="3.5" width="2" height="2" fill="#C99A5C" />
              <rect x="14.5" y="3.5" width="2" height="2" fill="#C99A5C" />
              <rect x="3.5" y="14.5" width="2" height="2" fill="#C99A5C" />
              <rect x="14.5" y="14.5" width="2" height="2" fill="#C99A5C" />
            </pattern>
          </defs>
          <rect width="200" height="100" fill="url(#maze)" />
        </svg>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(45,58,40,0.3) 60%, rgba(45,58,40,0.95) 100%)",
          }}
        />
      </div>

      <div className="absolute inset-x-[8%] top-[28%] bottom-[6%] border border-[#8B7A55]/40" />

      <div className="absolute inset-x-[10%] top-[30%] bottom-[8%] flex flex-col items-center justify-center text-center px-2">
        <p
          className="text-[#D4B878] tracking-[0.2em] uppercase mb-1 font-serif"
          style={{ fontSize: "clamp(0.55rem, 1.8vw, 0.8rem)" }}
        >
          {lines.top}
        </p>
        <p
          className="text-[#D4B878] font-serif font-bold leading-[1.15] italic"
          style={{ fontSize: "clamp(0.85rem, 3vw, 1.35rem)" }}
        >
          {lines.italic}
        </p>
        <p
          className="text-[#D4B878] font-serif font-bold leading-[1.15] mb-[12%]"
          style={{ fontSize: "clamp(0.85rem, 3vw, 1.35rem)" }}
        >
          {lines.second}
        </p>
        <p
          className="text-[#D4B878] font-serif italic"
          style={{ fontSize: "clamp(0.7rem, 2.2vw, 1.1rem)" }}
        >
          {lines.numLabel}&thinsp;{number}
        </p>
        <p
          className="text-[#D4B878]/90 font-serif"
          style={{ fontSize: "clamp(0.7rem, 2.2vw, 1.1rem)" }}
        >
          {year}
        </p>
      </div>
    </div>
  );
}
