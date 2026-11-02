function SectionTitle({ eyebrow, title, action, className = '' }) {
  return (
    <div className={`mb-7 flex flex-wrap items-end justify-between gap-3 ${className}`}>
      <div>
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">{eyebrow}</p>
        <h2 className="text-3xl font-black text-base-content">{title}</h2>
      </div>
      {action}
    </div>
  )
}

export default SectionTitle
