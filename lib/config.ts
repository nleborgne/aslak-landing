import { type Plan } from "@/models/plan";

export const plans: Plan[] = [
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
