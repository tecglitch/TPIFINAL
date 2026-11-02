import Card from './Card'

function CategoryCard({ icon, name, count, countLabel = '', className = '' }) {
  return (
    <Card className={`items-center p-5 text-center transition hover:border-primary hover:shadow-md ${className}`}>
      <div className="grid size-14 place-items-center rounded-full bg-primary/10 text-2xl">{icon}</div>
      <h3 className="mt-3 font-bold">{name}</h3>
      {count !== undefined && <p className="text-sm text-base-content/60">{count} {countLabel}</p>}
    </Card>
  )
}

export default CategoryCard
