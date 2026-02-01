import { getToday } from "@/lib/date";

export const Footer = async () => {
  const today = await getToday();
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>©{today.getFullYear()} CrossFit Aslak — Tous droits réservés.</div>
        <div className="flex items-center gap-4">
          <a
            target="_blank"
            href="https://www.instagram.com/crossfitaslak/"
            className="hover:text-foreground transition-colors"
          >
            Instagram
          </a>
          <a
            target="_blank"
            href="https://www.facebook.com/p/CrossFit-Aslak-100063532631968/"
            className="hover:text-foreground transition-colors"
          >
            Facebook
          </a>
          <a
            href="mailto:contact@crossfitaslak.com"
            className="hover:text-foreground transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};
