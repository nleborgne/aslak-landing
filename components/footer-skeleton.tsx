export const FooterSkeleton = () => {
    return (
        <footer className="border-t border-white/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-sm text-white/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="h-5 w-64 bg-white/10 rounded animate-pulse" />
                <div className="flex items-center gap-4">
                    <div className="h-5 w-20 bg-white/10 rounded animate-pulse" />
                    <div className="h-5 w-20 bg-white/10 rounded animate-pulse" />
                    <div className="h-5 w-16 bg-white/10 rounded animate-pulse" />
                </div>
            </div>
        </footer>
    )
}
