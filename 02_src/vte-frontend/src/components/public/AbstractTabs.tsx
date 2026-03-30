"use client";

import { useState } from "react";

interface AbstractTabsProps {
  abstract_ru: string;
  abstract_en?: string;
  keywords_ru?: string[];
  keywords_en?: string[];
}

export default function AbstractTabs({
  abstract_ru,
  abstract_en,
  keywords_ru,
  keywords_en,
}: AbstractTabsProps) {
  const [activeTab, setActiveTab] = useState<"ru" | "en">("ru");

  return (
    <div>
      <div className="border-b border-stone-400 mb-0">
        <div className="flex gap-0">
          <button
            onClick={() => setActiveTab("ru")}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "ru"
                ? "text-forest-600 border-copper-400"
                : "text-gray-400 border-transparent hover:text-gray-600"
            }`}
          >
            Аннотация
          </button>
          {abstract_en && (
            <button
              onClick={() => setActiveTab("en")}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "en"
                  ? "text-forest-600 border-copper-400"
                  : "text-gray-400 border-transparent hover:text-gray-600"
              }`}
            >
              Abstract
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-t-0 border-stone-400 rounded-b-sm p-6 mb-8">
        {activeTab === "ru" && (
          <div>
            <p className="text-[15px] text-gray-700 leading-relaxed">
              {abstract_ru}
            </p>
            {keywords_ru && keywords_ru.length > 0 && (
              <div className="mt-5">
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Ключевые слова
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {keywords_ru.map((kw) => (
                    <span
                      key={kw}
                      className="inline-block text-xs bg-stone-200 text-gray-600 px-2.5 py-1 rounded-sm"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "en" && abstract_en && (
          <div>
            <p className="text-[15px] text-gray-700 leading-relaxed">
              {abstract_en}
            </p>
            {keywords_en && keywords_en.length > 0 && (
              <div className="mt-5">
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Keywords
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {keywords_en.map((kw) => (
                    <span
                      key={kw}
                      className="inline-block text-xs bg-stone-200 text-gray-600 px-2.5 py-1 rounded-sm"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
