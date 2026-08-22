import { Toaster } from "sonner";
import PublicShell from "@/components/public/PublicShell";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicShell>{children}</PublicShell>
      {/* Toaster остаётся здесь, а не в оболочке: на странице 404 тостов никто не показывает. */}
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
