import Header from "@/components/public/Header";
import Navigation from "@/components/public/Navigation";
import Footer from "@/components/public/Footer";
import CookieBanner from "@/components/public/CookieBanner";

/**
 * Оболочка публичной части: шапка, навигация, контент, подвал.
 *
 * Вынесена из layout-а группы (public), потому что страница 404 для несопоставленных адресов
 * живёт в корне приложения и до этого layout-а не доходит — граница not-found стоит выше него.
 * Без общей оболочки разметка в двух местах разъехалась бы на первой же правке навигации.
 *
 * `flex-1` на main обязателен: body растянут в колонку, а подвал прижат `mt-auto` — без него
 * на короткой странице (той же 404) подвал уезжает вверх.
 */
export default function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Navigation />
      <main className="max-w-7xl px-4 sm:px-8 lg:px-12 pb-16 flex-1">
        {children}
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
