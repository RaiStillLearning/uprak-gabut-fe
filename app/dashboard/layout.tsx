import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 w-full">
        {children}
      </main>

      <footer className="border-t p-6 text-center text-sm text-muted-foreground bg-background">
        © 2025 Rakha Arkana
      </footer>
    </div>
  );
}