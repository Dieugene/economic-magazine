import type { Metadata } from "next";
import PublicShell from "@/components/public/PublicShell";
import NotFoundContent from "@/components/public/NotFoundContent";

// Страница для всех несопоставленных адресов приложения. Компонент серверный —
// клиентский не может экспортировать metadata, и заголовок вкладки остался бы общим.
export const metadata: Metadata = {
  title: "Страница не найдена — Вопросы теоретической экономики",
};

export default function NotFound() {
  return (
    <PublicShell>
      <NotFoundContent variant="general" />
    </PublicShell>
  );
}
