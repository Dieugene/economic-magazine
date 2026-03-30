import Header from "@/components/public/Header";
import Navigation from "@/components/public/Navigation";
import Footer from "@/components/public/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Navigation />
      <main className="max-w-7xl px-4 sm:px-8 lg:px-12 pb-16 flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
