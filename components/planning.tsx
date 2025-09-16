"use client"

import { useMemo, useState } from "react";

const slots = [
    { id: 1, heure: "07:00", type: "WOD", niveau: "Débutant", places: 3 },
    { id: 2, heure: "09:00", type: "WOD", niveau: "Intermédiaire", places: 2 },
    { id: 3, heure: "12:15", type: "Haltéro", niveau: "Confirmé", places: 5 },
    { id: 4, heure: "17:30", type: "Cardio", niveau: "Débutant", places: 1 },
    { id: 5, heure: "18:30", type: "WOD", niveau: "Intermédiaire", places: 4 },
    { id: 6, heure: "19:30", type: "Gymnastique", niveau: "Tous", places: 2 },
];

export default function Planning() {
    const [filter, setFilter] = useState("Tous");
    const filtered = useMemo(
        () => (filter === "Tous" ? slots : slots.filter((s) => s.niveau === filter)),
        [filter]
    );
    return (
        <section id="planning" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-end justify-between gap-6 flex-wrap">
                <div>
                    <h2 className="text-3xl font-bold">Planning</h2>
                    <p className="mt-1 text-white/70">Filtrez par niveau et réservez votre prochaine séance.</p>
                </div>
                <div className="flex gap-2 bg-white/5 rounded-full p-1 ring-1 ring-white/10">
                    {['Tous', 'Débutant', 'Intermédiaire', 'Confirmé'].map((lvl) => (
                        <button
                            key={lvl}
                            onClick={() => setFilter(lvl)}
                            className={`px-4 py-1.5 rounded-full text-sm ${filter === lvl ? 'bg-white text-black' : 'text-white/80 hover:text-white'}`}
                        >{lvl}</button>
                    ))}
                </div>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((s) => (
                    <div key={s.id} className="group rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 hover:bg-white/10 transition">
                        <div className="flex items-center justify-between">
                            <div className="text-xl font-semibold">{s.heure}</div>
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs uppercase tracking-wide">{s.type}</span>
                        </div>
                        <div className="mt-1 text-white/70 text-sm">Niveau : {s.niveau}</div>
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-white/60 text-sm">{s.places} places restantes</div>
                            <button className="rounded-xl bg-gradient-to-r from-lime-400 to-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow-emerald-500/20 shadow-lg">Réserver</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-center text-sm text-white/60">Synchronisez avec votre agenda (iCal/Google) • Drop‑in disponible</div>
        </section>
    )

}