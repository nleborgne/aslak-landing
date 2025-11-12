export type Plan = {
  name: string;
  price: {
    base: number;
    trimester: number;
    yearly: number;
  };
  billing: "monthly" | null;
  features: string[];
  description: string;
  ctaText?: string;
  ctaHref?: string;
  isFeatured?: boolean;
};
