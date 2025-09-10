import { Nav } from "@/components/marketing/Nav";
import { Hero } from "@/components/marketing/Hero";
import { Footer } from "@/components/marketing/Footer";
import { DashboardRedirect } from "@/components/marketing/DashboardRedirect";

export default function Home() {
  return (
    <div>
      <Nav />
      <DashboardRedirect />
      <Hero />
      <Footer />
    </div>
  );
}
