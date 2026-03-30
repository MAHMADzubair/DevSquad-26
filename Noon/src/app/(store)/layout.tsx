import Header from "@/components/layout/Header";
import CategoryBar from "@/components/layout/CategoryBar";
import Footer from "@/components/layout/Footer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col pt-[100px] md:pt-[100px]">
      <div className="fixed top-0 w-full z-50">
        <Header />
        <CategoryBar />
      </div>
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-0 md:px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}
