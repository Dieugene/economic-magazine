"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Archive, FileText, Menu, Eye, Save } from "lucide-react";

const sidebarLinks = [
  { key: "home", label: "Главная", href: "/admin/issues", icon: Home },
  { key: "issues", label: "Номера", href: "/admin/issues", icon: Archive },
  {
    key: "articles",
    label: "Статьи",
    href: "/admin/issues",
    icon: FileText,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800 antialiased">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-forest-800 text-white/70 flex flex-col transform transition-transform lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">ВТЭ</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium leading-tight">
                Админ-панель
              </p>
              <p className="text-xs text-white/60">Управление журналом</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4">
          <div className="px-3 mb-2">
            <p className="text-xs text-white/50 uppercase tracking-wider px-3 mb-2">
              Навигация
            </p>
          </div>
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.key}
                href={link.href}
                className={`flex items-center gap-3 px-6 py-2.5 text-sm hover:bg-white/5 hover:text-white transition-colors border-l-2 ${
                  isActive
                    ? "bg-forest-50/10 text-white border-l-copper-400"
                    : "border-transparent"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-5 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-copper-400 rounded-full flex items-center justify-center">
              <span className="text-forest-900 text-xs font-bold">АП</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate">Администратор</p>
              <p className="text-xs text-white/60">admin@questionset.ru</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden text-gray-500"
                onClick={() => setSidebarOpen(true)}
                aria-label="Открыть меню"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <nav className="text-xs text-gray-600 mb-1">
                  <Link
                    href="/admin/issues"
                    className="hover:text-forest-600 transition-colors"
                  >
                    Главная
                  </Link>
                </nav>
                <h1 className="text-lg font-semibold text-forest-600">
                  Админ-панель
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-forest-600 transition-colors px-3 py-2 border border-gray-200 rounded-sm"
              >
                <Eye className="w-4 h-4" />
                Сайт
              </Link>
              <button className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-forest-600 px-4 py-2 rounded-sm hover:bg-forest-700 transition-colors">
                <Save className="w-4 h-4" />
                Сохранить
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
