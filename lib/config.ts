import { type Plan } from "@/models/plan";

export type HomeType = "crossfit" | "hyrox";

export type HomeContent = {
  logo: string;
  hero: {
    title: string;
    highlight: string;
    description: string;
  };
  cta: {
    primary: string;
    secondary: string;
  };
};

export const HOME_CONTENT: Record<HomeType, HomeContent> = {
  crossfit: {
    logo: "CROSSFIT ASLAK",
    hero: {
      title: "Libère",
      highlight: "ta force",
      description:
        "Box CrossFit à l'esprit communautaire. Coaching exigeant & bienveillant, programmation orientée progrès, événements Aslak Contest.",
    },
    cta: {
      primary: "Séance d'essai gratuite",
      secondary: "Voir le planning",
    },
  },
  hyrox: {
    logo: "HYROX ASLAK",
    hero: {
      title: "Dépasse",
      highlight: "tes limites",
      description:
        "Préparation Hyrox complète. Entraînements fonctionnels, running, et stations Hyrox pour performer le jour J.",
    },
    cta: {
      primary: "Séance d'essai gratuite",
      secondary: "Voir le planning",
    },
  },
};

export const PLANS: Plan[] = [
  {
    name: "Abonnement illimité",
    price: {
      base: 135,
      trimester: 119,
      yearly: 99,
    },
    billing: "monthly",
    description: "",
    features: ["Accès WOD et Open Gym", "Frais d'inscription offerts"],
    isFeatured: true,
  },
  {
    name: "Abonnement couples",
    price: {
      base: 239,
      trimester: 215,
      yearly: 179,
    },
    billing: "monthly",
    description: "",
    features: ["Accès WOD et Open Gym", "Frais d'inscription offerts"],
  },
  {
    name: "Carte 5 séances",
    price: {
      base: 99,
      trimester: 99,
      yearly: 99,
    },
    billing: null,
    features: [],
    description: "Valable pendant 1 an",
    isFeatured: false,
  },
  {
    name: "Carte 10 séances",
    price: {
      base: 179,
      trimester: 179,
      yearly: 179,
    },
    billing: null,
    features: [],
    description: "Valable pendant 1 an",
    isFeatured: false,
  },
];

export const REVIEWS_URL =
  "https://www.google.com/search?q=CrossFit%20Aslak%20Reviews&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxIxtDA2MTA1NzI1MzczMLIwMLUwNtvAyPiKUcy5KL-42C2zRMGxOCcxWyEotSwztbx4ESsOCQADJE_sTQAAAA&rldimm=18340572567602805836&tbm=lcl&hl=en&sa=X&ved=0CCMQ9fQKKABqFwoTCOiJyaqu1pEDFQAAAAAdAAAAABAG&biw=1708&bih=1328#lkt=LocalPoiReviews";

export const COACHES = [
  {
    nom: "Alex",
    role: "Head Coach",
    badges: ["CF-L2", "Hyrox Foundation"],
    color: "from-fuchsia-500 to-violet-600",
  },
  {
    nom: "Cindy",
    role: "Coach",
    badges: ["CF-L1", "Hyrox Foundation"],
    color: "from-emerald-500 to-teal-600",
  },
  {
    nom: "Alix",
    role: "Coach",
    badges: ["CF-L1", "Hyrox Foundation"],
    color: "from-sky-500 to-indigo-600",
  },
  {
    nom: "Gauthier",
    role: "Coach",
    badges: ["CF-L1", "Hyrox Foundation"],
    color: "from-amber-500 to-orange-600",
  },
  {
    nom: "Alexandre",
    role: "Coach",
    badges: ["CF-L2", "Hyrox Level 1"],
    color: "from-fuchsia-500 to-violet-600",
  },
];
