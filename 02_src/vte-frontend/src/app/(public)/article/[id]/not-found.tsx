import NotFoundContent from "@/components/public/NotFoundContent";

// Шапку и подвал даёт layout группы (public) — здесь только содержимое.
export default function ArticleNotFound() {
  return <NotFoundContent variant="article" />;
}
