import React from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Categories from "../components/Categories";
import ProductGrid from "../components/Products";
import ServiceFeatures from "../components/Services";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import editorialImage from "../assets/bottom_img.png";

const testimonials = [
  ["The fit feels considered, not generic. My new everyday uniform.", "Aanya S.", "Verified buyer"],
  ["Beautiful fabric weight and the packaging made it feel genuinely special.", "Kabir M.", "Verified buyer"],
  ["Minimal, sharp, and easy to wear. The co-ord gets compliments every time.", "Meher K.", "Verified buyer"],
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#11110f]">
      <Hero />

      <section className="border-y border-black/10 bg-[#c7ff4a] px-5 py-4">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.24em] sm:text-xs">
          <span>Limited first drop</span>
          <span className="hidden sm:block">Designed in India · Made to move</span>
          <button onClick={() => navigate("/collection")} className="flex items-center gap-2 hover:opacity-60">
            Shop the drop <ArrowUpRight size={15} />
          </button>
        </div>
      </section>

      <Categories />
      <ProductGrid title="Most Wanted" />
      <LatestCollection title="Fresh From The Studio" />

      <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
        <div className="relative min-h-[560px] overflow-hidden rounded-[2rem] bg-black lg:min-h-[720px]">
          <img src={editorialImage} alt="Drip editorial collection" className="absolute inset-0 h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-6 p-7 text-white sm:p-12 lg:p-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c7ff4a]">Drip Editions 001</p>
            <h2 className="max-w-4xl font-serif text-4xl leading-[0.95] sm:text-6xl lg:text-8xl">
              Clothes that speak before you do.
            </h2>
            <button
              onClick={() => navigate("/collection?sort=newest")}
              className="flex items-center gap-3 rounded-full bg-white px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[#c7ff4a]"
            >
              Explore edition <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <ServiceFeatures />

      <section className="bg-[#11110f] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-10 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c7ff4a]">The Drip community</p>
          <div className="grid gap-px overflow-hidden rounded-3xl bg-white/15 md:grid-cols-3">
            {testimonials.map(([quote, name, meta]) => (
              <article key={name} className="bg-[#11110f] p-8 sm:p-10">
                <div className="mb-8 flex gap-1 text-[#c7ff4a]">
                  {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={13} fill="currentColor" />)}
                </div>
                <blockquote className="mb-10 font-serif text-2xl leading-snug">“{quote}”</blockquote>
                <p className="text-xs font-bold uppercase tracking-[0.18em]">{name}</p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-white/45">{meta}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
