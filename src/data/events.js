import eventImage from '../images/playita.png'

const city = 'Goya, Corrientes'
const organizerProfile = { name: 'Juan Pérez', email: 'juan@ejemplo.com', phone: '+54 3777 555 010' }

export const statusLabels = {
  pending: 'Pendiente de revisión',
  changes_requested: 'Cambios solicitados',
  published: 'Publicado',
  rejected: 'Rechazado',
  suspended: 'Suspendido',
  rescheduled: 'Reprogramado',
  cancelled: 'Cancelado',
  past: 'Pasado',
}

// Estos estados forman parte de la agenda pública; el resto corresponde a revisión interna.
export const isPublicEvent = (event) => ['published', 'suspended', 'rescheduled', 'cancelled', 'past'].includes(event.status)

export const categories = [
  { icon: '🎭', name: 'Cultura', count: 12 },
  { icon: '⚽', name: 'Deportes', count: 8 },
  { icon: '🎵', name: 'Música', count: 15 },
  { icon: '🍴', name: 'Gastronomía', count: 6 },
  { icon: '🤝', name: 'Comunidad', count: 9 },
]

export const events = [
  { slug: 'feria-de-artesanos', title: 'Feria de artesanos', description: 'Productos locales, música y propuestas para toda la familia.', category: 'Cultura', startAt: '2026-11-21T18:00', endAt: '2026-11-21T22:00', location: 'Paseo costero', city, organization: 'Feria Goya', organizer: organizerProfile, status: 'published', ticketType: 'free', submittedAt: '2026-10-20', image: eventImage },
  { slug: 'carnaval-de-la-ciudad', title: 'Carnaval de la ciudad', description: 'Comparsas, música en vivo y una noche para celebrar juntos.', category: 'Comunidad', startAt: '2027-02-22T21:00', endAt: '2027-02-23T01:00', location: 'Costanera municipal', city, organization: 'Municipalidad de Goya', organizer: { name: 'María Gómez', email: 'maria@ejemplo.com', phone: '+54 3777 555 012' }, status: 'published', ticketType: 'paid', price: '$ 5.000', ticketUrl: 'https://example.com/entradas', image: eventImage },
  { slug: 'torneo-barrial', title: 'Torneo barrial', description: 'Inscripciones abiertas para equipos de todas las edades.', category: 'Deportes', startAt: '2026-11-28T09:00', endAt: '2026-11-29T18:00', location: 'Polideportivo municipal', city, organization: 'Club Unión', organizer: organizerProfile, status: 'pending', ticketType: 'free', submittedAt: '2026-11-08', image: eventImage },
  { slug: 'muestra-de-arte-local', title: 'Muestra de arte local', description: 'Exposición de obras de artistas y estudiantes de la ciudad.', category: 'Cultura', startAt: '2026-12-05T19:00', endAt: '2026-12-05T22:00', location: 'Casa de la Cultura', city, organization: 'Casa de la Cultura', organizer: { name: 'Lucía Benítez', email: 'lucia@ejemplo.com', phone: '+54 3777 555 013' }, status: 'changes_requested', reviewNote: 'Agregá el horario de cierre y una imagen con autorización.', ticketType: 'free', submittedAt: '2026-11-05', image: eventImage },
  { slug: 'pena-folklorica', title: 'Peña folklórica', description: 'Música, danza y comidas tradicionales para disfrutar en familia.', category: 'Música', startAt: '2026-12-12T20:30', endAt: '2026-12-13T01:00', location: 'Plaza Mitre', city, organization: 'Raíces Goyanas', organizer: organizerProfile, status: 'rejected', reviewNote: 'La fecha y el lugar no están confirmados por la organización.', ticketType: 'paid', price: '$ 2.500', ticketUrl: '', submittedAt: '2026-11-01', image: eventImage },
  { slug: 'feria-del-libro', title: 'Feria del libro', description: 'Presentaciones, talleres y encuentros con autores locales.', category: 'Cultura', startAt: '2026-11-15T10:00', endAt: '2026-11-15T20:00', location: 'Biblioteca municipal', city, organization: 'Biblioteca Popular', organizer: organizerProfile, status: 'suspended', reviewNote: 'Suspendido temporalmente por tareas de mantenimiento del predio.', ticketType: 'free', submittedAt: '2026-10-28', image: eventImage },
  { slug: 'encuentro-gastronomico', title: 'Encuentro gastronómico', description: 'Sabores regionales, productores locales y cocina en vivo.', category: 'Gastronomía', startAt: '2026-12-20T12:00', endAt: '2026-12-20T21:00', location: 'Predio Costa Sur', city, organization: 'Sabores del Paraná', organizer: organizerProfile, status: 'rescheduled', previousStartAt: '2026-11-20T12:00', previousEndAt: '2026-11-20T21:00', reviewNote: 'Reprogramado por pronóstico de tormentas.', ticketType: 'paid', price: '$ 1.000', ticketUrl: 'https://example.com/sabores', submittedAt: '2026-10-15', image: eventImage },
  { slug: 'fiesta-patronal', title: 'Fiesta patronal', description: 'Celebración comunitaria con música, misa y propuestas culturales.', category: 'Comunidad', startAt: '2026-08-15T16:00', endAt: '2026-08-15T23:00', location: 'Iglesia Catedral', city, organization: 'Parroquia local', organizer: organizerProfile, status: 'past', ticketType: 'free', image: eventImage },
  { slug: 'dia-de-la-primavera', title: 'Día de la Primavera', description: 'Actividades recreativas, música y propuestas para jóvenes.', category: 'Comunidad', startAt: '2026-09-21T15:00', endAt: '2026-09-21T21:00', location: 'Playita de la ciudad', city, organization: 'Juventud Goya', organizer: organizerProfile, status: 'cancelled', reviewNote: 'Cancelado por la organización debido a las condiciones del río.', ticketType: 'free', submittedAt: '2026-08-12', image: eventImage },
  { slug: 'concurso-de-pesca', title: 'Concurso de pesca', description: 'Competencia abierta con actividades náuticas y feria gastronómica.', category: 'Deportes', startAt: '2026-11-29T07:00', endAt: '2026-11-29T17:00', location: 'Ribera del río', city, organization: 'Club de Pesca Goya', organizer: { name: 'María Gómez', email: 'maria@ejemplo.com', phone: '+54 3777 555 012' }, status: 'published', ticketType: 'paid', price: '$ 3.500', ticketUrl: 'https://example.com/pesca', image: eventImage },
  { slug: 'festival-musica', title: 'Festival de música en vivo', description: 'Bandas locales y artistas invitados en una jornada al aire libre.', category: 'Música', startAt: '2026-12-08T20:00', endAt: '2026-12-09T00:30', location: 'Anfiteatro municipal', city, organization: 'Cultura Goya', organizer: organizerProfile, status: 'published', ticketType: 'free', image: eventImage },
  { slug: 'feria-navidena', title: 'Feria navideña', description: 'Regalos, artesanías y propuestas especiales para las fiestas.', category: 'Gastronomía', startAt: '2026-12-14T17:00', endAt: '2026-12-14T22:00', location: 'Plaza Mitre', city, organization: 'Feria Goya', organizer: organizerProfile, status: 'published', ticketType: 'free', image: eventImage },
].map((event) => ({ ...event, slug: event.slug, id: event.slug }))

export const anniversaries = [
  { id: 'fundacion-goya', month: 11, day: 9, title: 'Aniversario de la fundación de Goya', description: 'Recordamos los orígenes de nuestra ciudad y a las generaciones que construyeron su identidad junto al Paraná.', organization: 'Archivo Histórico Municipal', image: eventImage, status: 'published', submittedAt: '2026-10-18' },
  { id: 'fiesta-del-surubi', month: 4, day: 24, title: 'La Fiesta Nacional del Surubí', description: 'Una celebración de la pesca deportiva, la cultura y el encuentro que identifica a Goya.', organization: 'Comisión Municipal de Pesca', image: eventImage, status: 'published', submittedAt: '2026-02-10' },
  { id: 'memoria-del-puerto', month: 11, day: 14, title: 'La vida junto al puerto', description: 'Historias de trabajo, navegación y encuentro que forman parte de la memoria de nuestra comunidad.', organization: 'Museo de la Ciudad', image: eventImage, status: 'published', submittedAt: '2026-10-30', organizer: organizerProfile },
  { id: 'memoria-del-puerto-pendiente', month: 11, day: 15, title: 'La vida junto al puerto: relatos de pescadores', description: 'Relatos de trabajo y navegación que forman parte de la memoria de la ribera goyana.', organization: 'Museo de la Ciudad', image: eventImage, status: 'pending', submittedAt: '2026-11-10', organizer: organizerProfile },
]

export const getLocalDateTime = (value) => new Date(value).toLocaleString('es-AR', {
  dateStyle: 'long', timeStyle: 'short',
})
