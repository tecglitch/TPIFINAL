import StatusBadge from './StatusBadge'
import fallbackImage from '../images/playita.png'

export default function DashboardItem({ title, status, image, children }) {
  return (
    <details className="group overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm">
      <summary className="grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3 transition-colors hover:bg-base-200/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:gap-4 [&::-webkit-details-marker]:hidden">
        <img
          src={image || fallbackImage}
          alt=""
          loading="lazy"
          className="h-16 w-20 rounded-lg bg-base-200 object-cover sm:h-24 sm:w-40"
        />
        <span className="flex min-w-0 flex-col items-start gap-2">
          <span className="font-semibold leading-snug [overflow-wrap:anywhere] sm:text-lg">{title}</span>
          <StatusBadge status={status} />
        </span>
        <span aria-hidden="true" className="mr-1 size-2 rotate-45 border-r-2 border-b-2 border-current text-base-content/60 transition-transform group-open:rotate-[225deg]" />
      </summary>
      <div className="border-t border-base-300 px-5 py-4">{children}</div>
    </details>
  )
}
