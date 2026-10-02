import { createFileRoute, Link } from "@tanstack/react-router";
import { StoreLayout } from "@/components/store/StoreLayout";

export const Route = createFileRoute("/pakistan-journey")({
  head: () => ({
    meta: [
      { title: "Our Pakistan Journey - Selah Girl Society" },
      {
        name: "description",
        content: "Discover the heart behind our manufacturing process and the incredible artisans we partner with in Pakistan.",
      },
    ],
  }),
  component: PakistanJourney,
});

function PakistanJourney() {
  return (
    <StoreLayout>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] w-full bg-[#1A1A1A] overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full container-page flex flex-col items-center justify-center text-center">
          <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#BBBBBB]">
            Our Story
          </p>
          <h1
            className="text-4xl text-white md:text-6xl lg:text-8xl leading-[1.1] max-w-4xl"
            style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
          >
            The Pakistan Journey
          </h1>
        </div>
      </section>

      {/* Intro Text */}
      <section className="container-page py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[16px] leading-loose text-[#444444] md:text-[18px]">
            When we set out to create Selah Girl Society, we knew that our commitment to honoring God had to extend beyond the designs and messages printed on our garments. It had to be woven into the very fabric of how we do business. That conviction led us on a remarkable journey to Pakistan, where we found partners who shared our dedication to craftsmanship, ethical labor, and uncompromising quality.
          </p>
        </div>
      </section>

      {/* Grid Story */}
      <section className="container-page pb-20 md:pb-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-center">
          <div className="aspect-[4/5] w-full bg-[#f4f4f4]">
            {/* Placeholder for an image of the factory or artisans */}
            <div className="flex h-full w-full items-center justify-center text-[#BBBBBB] text-[12px] uppercase tracking-[0.2em] font-bold">
              Artisan Photography
            </div>
          </div>
          
          <div className="max-w-xl space-y-10">
            <div>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] mb-4">
                Ethical Craftsmanship
              </h2>
              <p className="text-[14px] leading-relaxed text-[#444444]">
                In the heart of Pakistan's rich textile industry, we partner with family-owned facilities that prioritize the well-being of their artisans. Every piece of Selah clothing is cut, sewn, and finished by skilled workers who receive fair wages, work in safe conditions, and take immense pride in their craft.
              </p>
            </div>
            
            <div>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] mb-4">
                Premium Materials
              </h2>
              <p className="text-[14px] leading-relaxed text-[#444444]">
                Our signature heavyweight cottons and luxurious blends are sourced locally in Pakistan, renowned for producing some of the world's finest textiles. This direct relationship allows us to develop custom fabrics that offer the perfect drape, durability, and comfort necessary for the modern Christian woman.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-[#f4f4f4] py-24 md:py-32">
        <div className="container-page">
          <blockquote
            className="mx-auto max-w-4xl text-center text-3xl text-[#1A1A1A] md:text-5xl leading-[1.3]"
            style={{ fontFamily: "var(--font-selah)", fontWeight: 300 }}
          >
            "We believe that true luxury is found not just in the final product, but in the dignity of the hands that made it."
          </blockquote>
        </div>
      </section>

      {/* Outro */}
      <section className="container-page py-24 md:py-32 text-center">
        <h2 className="mb-8 text-[12px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
          Wear The Story
        </h2>
        <p className="mx-auto max-w-2xl text-[14px] leading-relaxed text-[#444444] mb-12">
          When you wear Selah Girl Society, you aren't just making a statement of faith. You are supporting ethical manufacturing and standing with artisans across the globe.
        </p>
        <Link
          to="/shop"
          className="inline-flex h-14 items-center justify-center bg-[#1A1A1A] px-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/80"
        >
          SHOP THE COLLECTION
        </Link>
      </section>
    </StoreLayout>
  );
}
