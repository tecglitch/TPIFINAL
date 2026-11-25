import { Link, useParams } from 'react-router-dom'
import Button from '../components/Button'
import CalendarButton from '../components/CalendarButton'
import PageLayout from '../components/PageLayout'
import { useAppState } from '../AppStateContext'

// Busca y muestra una efeméride publicada identificada por la ruta.
function AnniversaryDetailsPage() {
  const { id } = useParams()
  const { anniversaryList } = useAppState()
  const anniversary = anniversaryList.find((item) => String(item.id) === id && item.status === 'published')

  if (!anniversary) return <PageLayout><section className="mx-auto max-w-3xl px-6 py-20 text-center"><h1 className="text-3xl font-black">No encontramos esa efeméride</h1><p className="mt-3 text-base-content/70">Puede que ya no esté disponible.</p><Link to="/"><Button className="mt-6">Volver al inicio</Button></Link></section></PageLayout>

  const date = new Date(2000, anniversary.month - 1, anniversary.day)
    .toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })
  const sourceUrl = anniversary.sourceUrl || anniversary.source_url

  return (
    <PageLayout>
      <article className="mx-auto max-w-5xl px-6 py-10 md:py-14">
        <Link className="link link-hover text-sm font-semibold text-primary" to="/">← Volver al inicio</Link>
        <div className="mt-6 overflow-hidden rounded-box bg-base-100 shadow-xl">
          {anniversary.image && <img className="h-64 w-full object-cover sm:h-80 md:h-[26rem]" src={anniversary.image} alt={`Imagen de ${anniversary.title}`} />}
          <div className="p-6 md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="badge badge-primary badge-outline">Efeméride</span>
              <CalendarButton item={anniversary} className="btn-sm" />
            </div>
            <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{anniversary.title}</h1>
            <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-base-content/75">{anniversary.description}</p>
            <div className="mt-8 grid gap-4 border-t border-base-300 pt-6 sm:grid-cols-2">
              <Detail label="Fecha" value={date} />
              {anniversary.organization && <Detail label="Propuesta de" value={anniversary.organization} />}
              {anniversary.location && <Detail label="Lugar" value={anniversary.location} />}
              {anniversary.city && <Detail label="Ciudad" value={anniversary.city} />}
            </div>
            {sourceUrl && <p className="mt-6 text-sm"><a className="link link-primary" href={sourceUrl} target="_blank" rel="noreferrer">Consultar fuente</a></p>}
          </div>
        </div>
      </article>
    </PageLayout>
  )
}

// Presenta un dato de la efeméride con una etiqueta descriptiva.
function Detail({ label, value }) {
  return <div className="rounded-box bg-base-200 p-4"><p className="text-xs font-bold uppercase tracking-wide text-base-content/60">{label}</p><p className="mt-1 font-semibold">{value}</p></div>
}

export default AnniversaryDetailsPage
