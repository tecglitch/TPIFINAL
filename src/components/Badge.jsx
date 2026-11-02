function Badge({ children, color = 'primary', className = '' }) {
  return (
    <span className={`badge badge-${color} ${className}`}>
      {children}
    </span>
  )
}

export default Badge
