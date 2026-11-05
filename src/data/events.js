import eventImage from '../images/image.png'

const city = 'Goya, Corrientes'

const eventDefaults = { city, image: eventImage }

export const events = [
  { slug: 'feria-de-artesanos', title: 'Feria de artesanos', description: 'Productos locales, música y propuestas para toda la familia.', category: 'Cultura', day: '15', month: 'Enero', year: '2026', time: '18:00', location: 'Paseo costero' },
  { slug: 'carnaval-de-la-ciudad', title: 'Carnaval de la ciudad', description: 'Comparsas, música en vivo y una noche para celebrar juntos.', category: 'Comunidad', day: '22', month: 'Febrero', year: '2026', time: '21:00', location: 'Costanera municipal' },
  { slug: 'torneo-barrial', title: 'Torneo barrial', description: 'Inscripciones abiertas para equipos de todas las edades.', category: 'Deportes', day: '10', month: 'Marzo', year: '2026', time: '09:00', location: 'Polideportivo municipal' },
  { slug: 'muestra-de-arte-local', title: 'Muestra de arte local', description: 'Exposición de obras de artistas y estudiantes de la ciudad.', category: 'Cultura', day: '26', month: 'Abril', year: '2026', time: '19:00', location: 'Casa de la Cultura' },
  { slug: 'pena-folklorica', title: 'Peña folklórica', description: 'Música, danza y comidas tradicionales para disfrutar en familia.', category: 'Música', day: '17', month: 'Mayo', year: '2026', time: '20:30', location: 'Plaza Mitre' },
  { slug: 'feria-del-libro', title: 'Feria del libro', description: 'Presentaciones, talleres y encuentros con autores locales.', category: 'Cultura', day: '12', month: 'Junio', year: '2026', time: '10:00', location: 'Biblioteca municipal' },
  { slug: 'encuentro-gastronomico', title: 'Encuentro gastronómico', description: 'Sabores regionales, productores locales y cocina en vivo.', category: 'Gastronomía', day: '20', month: 'Julio', year: '2026', time: '12:00', location: 'Predio Costa Sur' },
  { slug: 'fiesta-patronal', title: 'Fiesta patronal', description: 'Celebración comunitaria con música, misa y propuestas culturales.', category: 'Comunidad', day: '15', month: 'Agosto', year: '2026', time: '16:00', location: 'Iglesia Catedral' },
  { slug: 'dia-de-la-primavera', title: 'Día de la Primavera', description: 'Actividades recreativas, música y propuestas para jóvenes.', category: 'Comunidad', day: '21', month: 'Septiembre', year: '2026', time: '15:00', location: 'Playita de la ciudad' },
  { slug: 'concurso-de-pesca', title: 'Concurso de pesca', description: 'Competencia abierta con actividades náuticas y feria gastronómica.', category: 'Deportes', day: '18', month: 'Octubre', year: '2026', time: '07:00', location: 'Ribera del río' },
  { slug: 'festival-de-musica-en-vivo', title: 'Festival de música en vivo', description: 'Bandas locales y artistas invitados en una jornada al aire libre.', category: 'Música', day: '8', month: 'Noviembre', year: '2026', time: '20:00', location: 'Anfiteatro municipal' },
  { slug: 'feria-navidena', title: 'Feria navideña', description: 'Regalos, artesanías y propuestas especiales para las fiestas.', category: 'Gastronomía', day: '14', month: 'Diciembre', year: '2026', time: '17:00', location: 'Plaza principal' },
].map((event) => ({ ...eventDefaults, ...event }))

export const categories = [
  { icon: '🎭', name: 'Cultura', count: 12 },
  { icon: '⚽', name: 'Deportes', count: 8 },
  { icon: '🎵', name: 'Música', count: 15 },
  { icon: '🍴', name: 'Gastronomía', count: 6 },
]
