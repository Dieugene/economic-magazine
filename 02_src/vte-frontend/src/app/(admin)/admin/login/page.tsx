"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Заполните все поля");
      return;
    }

    // Mock auth: accept any non-empty credentials
    localStorage.setItem("vte_admin_token", "mock-token-" + Date.now());
    router.push("/admin/issues");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 bg-forest-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">ВТЭ</span>
            </div>
          </div>

          <h1 className="text-center text-lg font-semibold text-gray-800 mb-1">
            Вход в панель управления
          </h1>
          <p className="text-center text-sm text-gray-400 mb-6">
            Вопросы теоретической экономики
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="field-label" htmlFor="username">
                Имя пользователя
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600 transition-colors"
                placeholder="admin"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="password">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600 transition-colors"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-forest-600 text-white text-sm font-medium py-2.5 rounded hover:bg-forest-700 transition-colors"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
