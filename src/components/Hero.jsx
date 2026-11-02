function Hero({ backgroundImage, eyebrow, title, description, actions, children, className = '' }) {
  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `linear-gradient(rgb(0 0 0 / 45%), rgb(0 0 0 / 45%)), url("${backgroundImage}")`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }
    : undefined

  return (
    <section
      className={`hero min-h-[420px] bg-gradient-to-br from-primary to-secondary px-6 text-primary-content ${className}`}
      style={backgroundStyle}
    >
      <div className="hero-content flex-col py-16 text-center">
        {eyebrow && <p className="badge badge-accent badge-lg">{eyebrow}</p>}
        {title && <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">{title}</h1>}
        {description && <p className="max-w-2xl text-base opacity-90 md:text-lg">{description}</p>}
        {actions && <div className="mt-4 flex flex-wrap justify-center gap-3">{actions}</div>}
        {children}
      </div>
    </section>
  )
}

export default Hero
