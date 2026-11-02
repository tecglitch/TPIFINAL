import Badge from './Badge'
import Card from './Card'

function EventCard({ event, action, className = '' }) {
  return (
    <Card className={`overflow-hidden transition hover:-translate-y-1 hover:shadow-lg ${className}`}>
      <div className="h-36 bg-gradient-to-br from-primary/80 to-secondary/80 p-5 text-primary-content">
        <Badge color="accent">{event.category}</Badge>
        <p className="mt-4 text-3xl font-black">{event.day}</p>
        <p className="text-sm uppercase opacity-90">{event.month}</p>
      </div>
      <div className="card-body">
        <h3 className="card-title">{event.title}</h3>
        <p className="text-sm text-base-content/70">{event.description}</p>
        <div className="mt-2 flex items-center gap-2 text-sm text-base-content/70">
          <span aria-hidden="true">⌖</span>
          {event.location}
        </div>
        {action && <div className="card-actions mt-3 justify-end">{action}</div>}
      </div>
    </Card>
  )
}

export default EventCard
