function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    neutral: 'btn-neutral',
  }

  return (
    <button className={`btn ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button
