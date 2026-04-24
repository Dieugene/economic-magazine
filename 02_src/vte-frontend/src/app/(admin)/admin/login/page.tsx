"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/api/client";
import DocumentTitle from "@/components/public/DocumentTitle";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!login || !password) {
      setError("Заполните все поля");
      return;
    }

    setLoading(true);
    try {
      await auth.login(login, password);
      router.push("/admin/issues");
    } catch {
      setError("Неверный логин или пароль");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <DocumentTitle ru="Вход в админ-панель" en="Admin Login" />
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
              <label className="field-label" htmlFor="login">
                Email
              </label>
              <input
                id="login"
                type="email"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600 transition-colors"
                placeholder="user@example.com"
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
              disabled={loading}
              className="w-full bg-forest-600 text-white text-sm font-medium py-2.5 rounded hover:bg-forest-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
