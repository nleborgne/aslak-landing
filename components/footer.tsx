import { getToday } from "@/lib/date"

export const Footer = async () => {
    const today = await getToday();
    return (
        <footer className="border-t border-white/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-sm text-white/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>©{today.getFullYear()} CrossFit Aslak — Tous droits réservés.</div>
                <div className="flex items-center gap-4">
                    <a href="#" className="hover:text-white">Instagram</a>
                    <a href="#" className="hover:text-white">Facebook</a>
                    <a href="#" className="hover:text-white">Contact</a>
                </div>
            </div>
        </footer>
    )
}