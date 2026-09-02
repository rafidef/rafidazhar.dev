import { Nav } from "@/components/nav";
import { Hero } from "@/components/sections/hero";
import { StackMarquee } from "@/components/sections/stack-marquee";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Skills } from "@/components/sections/skills";
import { Organizations } from "@/components/sections/organizations";
import { Certifications } from "@/components/sections/certifications";
import { Education } from "@/components/sections/education";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

/**
 * Nine bands, nine distinct layout families (Section 14 asks for at least
 * four across eight sections):
 *
 *   A  hero            asymmetric split, off-grid
 *   B  stack marquee   full-bleed marquee          (the one marquee)
 *   C  about           split-screen scroll
 *   D  experience      sticky aside
 *   E  skills          bento grid, 6 items 6 cells
 *   F  organizations   pinned card stack           (Section 5.A)
 *   G  certifications  horizontal pan              (Section 5.B)
 *   H  education       editorial ledger
 *   I  contact         full-bleed type closer
 *
 * Anchor IDs and their order are unchanged from the legacy site.
 */
export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <StackMarquee />
        <About />
        <Experience />
        <Skills />
        <Organizations />
        <Certifications />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
