import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import PageLayout from '../components/PageLayout'
import SectionTitle from '../components/SectionTitle'

function CreateEventPage() {
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <SectionTitle
          eyebrow="Participá de la agenda"
          title="Crear un evento"
        />
        {submitted ? (
          <Card className="items-center p-8 text-center md:p-12">
            <div className="mb-4 grid size-16 place-items-center rounded-full bg-success/15 text-3xl text-success">✓</div>
            <h2 className="text-2xl font-bold">Evento enviado a revisión</h2>
            <p className="mt-2 max-w-md text-base-content/70">
              Recibimos la propuesta. Cuando sea revisada, se publicará en la agenda.
            </p>
            <Button className="mt-6" onClick={() => setSubmitted(false)}>Crear otro evento</Button>
          </Card>
        ) : (
          <Card className="p-6 md:p-8">
            <form className="grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="form-control">
                  <span className="label-text mb-2 font-semibold">Nombre del evento</span>
                  <input className="input input-bordered" required placeholder="Ej. Feria de artesanos" />
                </label>
                <label className="form-control">
                  <span className="label-text mb-2 font-semibold">Categoría</span>
                  <select className="select select-bordered" defaultValue="" required>
                    <option value="" disabled>Seleccionar categoría</option>
                    <option>Cultura</option>
                    <option>Deportes</option>
                    <option>Gastronomía</option>
                  </select>
                </label>
                <label className="form-control">
                  <span className="label-text mb-2 font-semibold">Fecha</span>
                  <input className="input input-bordered" type="date" required />
                </label>
                <label className="form-control">
                  <span className="label-text mb-2 font-semibold">Horario</span>
                  <input className="input input-bordered" type="time" required />
                </label>
                <label className="form-control md:col-span-2">
                  <span className="label-text mb-2 font-semibold">Lugar</span>
                  <input className="input input-bordered" required placeholder="Ej. Plaza principal" />
                </label>
              </div>
              <label className="form-control">
                <span className="label-text mb-2 font-semibold">Descripción</span>
                <textarea className="textarea textarea-bordered min-h-32" required placeholder="Contá de qué se trata el evento..." />
              </label>
              <label className="form-control">
                <span className="label-text mb-2 font-semibold">Imagen de portada</span>
                <input className="file-input file-input-bordered w-full" type="file" accept="image/*" />
              </label>
              <div className="rounded-box bg-info/10 p-4 text-sm text-base-content/70">
                Tu propuesta será revisada antes de aparecer publicada.
              </div>
              <div className="flex flex-wrap justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => navigate('/calendario')}>Cancelar</Button>
                <Button type="submit">Enviar a revisión</Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </PageLayout>
  )
}

export default CreateEventPage
