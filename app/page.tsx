"use cache";

import Planning from '@/components/planning';
import { fetchPlanning } from '@/lib/date';

// ------------------------------------------------------------
// CrossFit Aslak — Landing v1
// Sections demandées : Planning, Prix (S'abonner / Séance d'essai), Coachs, Avis Google, Partenaires
// Design language : dark mode, gradients néon (vert/bleu), cartes glassmorphism, CTA collant.
// ------------------------------------------------------------

const plans = [
  {
    name: "Illimité",
    price: "129€ / mois",
    bullets: [
      "Accès illimité WOD & Open Gym",
      "Suivi perf. & programmation",
      "Pause possible 1x/mois",
    ],
    cta: { label: "S'abonner", emphasis: true },
    tag: "Meilleur choix",
  },
  {
    name: "3x / semaine",
    price: "99€ / mois",
    bullets: ["12 séances / mois", "Réservation 7j à l'avance", "WOD & Haltéro"],
    cta: { label: "S'abonner", emphasis: false },
  },
  {
    name: "Drop‑in",
    price: "20€ / séance",
    bullets: ["Accès 1 séance", "Pour visiteurs / essai"],
    cta: { label: "Séance d'essai", emphasis: false },
  },
];

const coaches = [
  { nom: "Nina", role: "Head Coach", badges: ["CF-L2", "Gym"], color: "from-fuchsia-500 to-violet-600" },
  { nom: "Lucas", role: "Coach", badges: ["CF-L1", "Haltéro"], color: "from-emerald-500 to-teal-600" },
  { nom: "Mehdi", role: "Coach", badges: ["CF-L1", "Endurance"], color: "from-sky-500 to-indigo-600" },
  { nom: "Sabrina", role: "Coach", badges: ["CF-L1", "Mobility"], color: "from-amber-500 to-orange-600" },
];

const reviews = [
  {
    author: "Solène C.",
    stars: 5,
    text:
      "Excellente box de crossfit ! La meilleure du 78 , ou les coachs écoutent et s'adaptent à vous pour vous faire progresser de manière constructive et en sécurité ☺️",
  },
  {
    author: "Gabriel G.",
    stars: 5,
    text: "Super salle de Crossfit, des coachs toujours de bonne humeur et expérimentés. Très bien équipée, une box qui investit et se renouvelle sans arrêt afin de rester au top.",
  },
  {
    author: "Jules M.",
    stars: 4.8,
    text: "Matériel nickel, programmation solide. Mention spéciale au suivi individuel.",
  },
];

const partners = [
  { name: "Rogue", short: "ROG" },
  { name: "Reebok", short: "RBK" },
  { name: "Wodify", short: "WDF" },
  { name: "Nocco", short: "NCC" },
];

export default async function AslakLanding() {

  const planning = await fetchPlanning();

  return (
    <div className="min-h-screen bg-[#0B0F12] text-white antialiased">
      {/* Glow background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute top-40 right-10 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
      </div>

      {/* Sticky CTA bar */}
      <div className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/40 bg-black/60 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <Logo />
          <nav className="ml-auto hidden md:flex items-center gap-6 text-sm text-white/80">
            <a href="#planning" className="hover:text-white">Planning</a>
            <a href="#pricing" className="hover:text-white">Prix</a>
            <a href="#coachs" className="hover:text-white">Coach</a>
            <a href="#reviews" className="hover:text-white">Avis</a>
            <a href="#partners" className="hover:text-white">Partenaires</a>
          </nav>
          <a href="#pricing" className="ml-auto md:ml-0 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 px-5 py-2 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20">
            Réserver une séance d'essai
          </a>
        </div>
      </div>

      {/* HERO */}
      <header className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl sm:text-6xl font-black leading-[1.05]">
              <span className="block">Libère</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-sky-400">ta force</span>
            </h1>
            <p className="mt-5 max-w-xl text-white/70">
              Box CrossFit à l'esprit communautaire. Coaching exigeant & bienveillant,
              programmation orientée progrès, événements <span className="whitespace-nowrap">Aslak Contest</span>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#pricing" className="inline-flex items-center rounded-xl bg-gradient-to-r from-lime-400 to-emerald-500 px-5 py-3 font-semibold text-black">Séance d'essai gratuite</a>
              <a href="#planning" className="inline-flex items-center rounded-xl border border-white/20 px-5 py-3 font-semibold hover:bg-white/5">Voir le planning</a>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-white/70">
              <div className="flex items-center gap-2"><Stars score={4.9} /> 4.9/5 • 320+ avis</div>
              <div>Paris Ouest • 400m² • Parking</div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative h-72 sm:h-96 lg:h-[28rem]">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-white/0 ring-1 ring-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_20%_20%,rgba(163,230,53,0.15),transparent),radial-gradient(60%_80%_at_80%_80%,rgba(56,189,248,0.15),transparent)]" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="aspect-video w-11/12 rounded-2xl bg-black/50 ring-1 ring-white/10 grid place-items-center">
                  <div className="text-center">
                    <div className="text-white/60 text-xs uppercase tracking-widest">Hero vidéo</div>
                    <div className="mt-1 text-white/80 text-sm">(mettez ici un reel Instagram / vidéo WOD)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* PLANNING */}
      <Planning data={planning} />


      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Prix & abonnements</h2>
          <p className="mt-2 text-white/70">Transparence totale. Choisissez votre rythme, commencez par une séance d'essai gratuite.</p>
        </div>

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <div key={i} className={`relative rounded-3xl p-6 ring-1 ring-white/10 bg-white/5 ${p.tag ? 'lg:scale-[1.02] lg:-translate-y-1' : ''}`}>
              {p.tag && (
                <div className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 px-3 py-1 text-xs font-bold text-black shadow">{p.tag}</div>
              )}
              <div className="text-xl font-semibold">{p.name}</div>
              <div className="mt-2 text-3xl font-black">{p.price}</div>
              <ul className="mt-4 space-y-2 text-white/80">
                {p.bullets.map((b, j) => (
                  <li key={j} className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" /> {b}</li>
                ))}
              </ul>
              <button className={`mt-6 w-full rounded-xl px-5 py-3 font-semibold ${p.cta.emphasis ? 'bg-gradient-to-r from-lime-400 to-emerald-500 text-black' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                {p.cta.label}
              </button>
              <div className="mt-3 flex items-center justify-center gap-3 text-xs text-white/50">
                <span>Paiement sécurisé</span>
                <span>•</span>
                <span>Apple Pay • CB • SEPA</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-white/60">Frais d'inscription offerts ce mois‑ci • Résiliation 100% en ligne</div>
      </section>

      {/* COACHS */}
      <section id="coachs" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div>
            <h2 className="text-3xl font-bold">Coach</h2>
            <p className="mt-1 text-white/70">Une équipe certifiée, experte et accessible.</p>
          </div>
          <a href="#" className="text-sm text-white/80 hover:text-white">Voir la programmation & méthodo →</a>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coaches.map((c, idx) => (
            <div key={idx} className="rounded-3xl ring-1 ring-white/10 bg-white/5 overflow-hidden">
              <div className={`h-40 bg-gradient-to-br ${c.color} opacity-80`} />
              <div className="p-5">
                <div className="text-lg font-semibold">{c.nom}</div>
                <div className="text-white/70 text-sm">{c.role}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {c.badges.map((b, j) => (
                    <span key={j} className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/80 ring-1 ring-white/10">{b}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AVIS GOOGLE */}
      <section id="reviews" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Avis Google</h2>
          <div className="mt-2 inline-flex items-center gap-3 rounded-full bg-white/5 px-4 py-2 ring-1 ring-white/10">
            <Stars score={4.8} /> <span className="font-semibold">4.8/5</span>
            <span className="text-white/70">(174+ avis)</span>
          </div>
          <p className="mt-2 text-white/70">Ce que la communauté dit de nous.</p>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{r.author}</div>
                <Stars score={r.stars} />
              </div>
              <p className="mt-3 text-white/80">{r.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <a className="text-sm text-emerald-300 hover:text-emerald-200" href="#" target="_blank" rel="noreferrer">Voir tous les avis sur Google →</a>
        </div>
      </section>

      {/* PARTENAIRES */}
      <section id="partners" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Partenaires</h2>
          <p className="mt-2 text-white/70">Nos marques & outils de confiance.</p>
        </div>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {partners.map((p, i) => (
            <div key={i} className="group relative rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <div className="mx-auto grid place-items-center h-16 w-full rounded-lg bg-gradient-to-r from-white/5 to-white/10">
                <span className="text-2xl font-black tracking-widest text-white/80 group-hover:text-white">{p.short}</span>
              </div>
              <div className="mt-2 text-center text-sm text-white/60">{p.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-sm text-white/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} CrossFit Aslak — Tous droits réservés.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">Facebook</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stars({ score = 5 }) {
  const full = Math.floor(score);
  const half = score - full >= 0.5;
  const arr = Array.from({ length: 5 }, (_, i) => (i < full ? "full" : i === full && half ? "half" : "empty"));
  return (
    <div className="flex items-center gap-1 text-amber-300">
      {arr.map((t, i) => (
        <span key={i} aria-hidden className={`inline-block h-4 w-4 ${t === 'empty' ? 'opacity-30' : ''}`}>
          {t === 'half' ? (
            <svg viewBox="0 0 24 24" fill="currentColor"><defs><linearGradient id={`g${i}`}><stop offset="50%" stopColor="currentColor" /><stop offset="50%" stopColor="transparent" /></linearGradient></defs><path fill={`url(#g${i})`} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
          )}
        </span>
      ))}
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-lime-400 to-sky-400" />
      <span className="font-black tracking-tight">CROSSFIT ASLAK</span>
    </div>
  );
}
