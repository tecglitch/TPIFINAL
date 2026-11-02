function EventCard({ event, action, className = '' }) {
  return (
    <article
      className={`relative isolate rotate-[-1deg] rounded-sm border border-amber-900/10 bg-gradient-to-br from-[#fff3a3] via-[#ffeb70] to-[#f7dc58] p-6 pt-9 text-stone-800 shadow-[2px_5px_10px_rgba(60,45,10,0.2)] transition duration-200 hover:-translate-y-1 hover:rotate-0 hover:shadow-[4px_10px_18px_rgba(60,45,10,0.25)] ${className}`}
    >
      {/* Una cinta centrada en el borde superior */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-2 left-1/2 z-10 h-7 w-24 -translate-x-1/2 rotate-[-3deg] border border-[#54351f]/40 bg-gradient-to-br from-[#b98a5c] via-[#98704a] to-[#795536] shadow-[1px_2px_4px_rgba(45,25,10,0.35)]"
      />

      <div className="relative z-0">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex rounded-full border border-amber-950/15 bg-amber-950/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-950">
            {event.category}
          </span>
          <div className="text-right leading-none text-amber-950">
            <p className="text-3xl font-black">{event.day}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider">{event.month}</p>
          </div>
        </div>

        <h3 className="mt-5 text-xl font-extrabold leading-tight text-stone-900">
          {event.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-stone-700">
          {event.description}
        </p>

        <div className="mt-4 flex items-center gap-2 border-t border-amber-900/15 pt-3 text-sm text-stone-700">
          <span aria-hidden="true">⌖</span>
          <span>{event.location}</span>
        </div>

        {action && <div className="mt-3 flex justify-end">{action}</div>}
      </div>
    </article>
  )
}

export default EventCard
