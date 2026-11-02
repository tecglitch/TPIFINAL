function Footer({ children, className = '', id }) {
  return (
    <footer id={id} className={`footer footer-center bg-neutral p-10 text-neutral-content ${className}`}>
      {children}
    </footer>
  )
}

export default Footer
