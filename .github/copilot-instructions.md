# Instrucciones del proyecto

## Contexto

- Este proyecto es una aplicación web de eventos para una ciudad pequeña.
- Actualmente se está trabajando principalmente en el frontend y las maquetas visuales.
- No agregar backend, base de datos ni lógica de persistencia salvo que se solicite explícitamente.

## Forma de trabajar

- Antes de modificar código, revisar el contexto de los archivos relacionados.
- Hacer cambios precisos, completos y limitados al pedido.
- No modificar ni revertir cambios existentes que no estén relacionados.
- Reutilizar componentes y patrones existentes antes de crear código nuevo.
- Explicar brevemente los cambios realizados y cualquier decisión importante.
- Si existen varias alternativas razonables que cambian significativamente el diseño, consultar antes de implementar.

## Componentes y estilos

- Crear y reutilizar componentes desde `src/components/`.
- Mantener los componentes genéricos: no colocar textos, datos o frases específicas de una página dentro de componentes reutilizables.
- Pasar el contenido mediante props, `children` o datos separados.
- Usar Tailwind CSS y daisyUI para los estilos y componentes visuales.
- Evitar repetir HTML o clases complejas cuando pueda reutilizarse un componente existente.
- Mantener el diseño responsive para celular, tablet y escritorio.
- Respetar la paleta definida en `src/styles/theme.css`.
- No agregar colores arbitrarios si ya existe una variable o clase equivalente.


## Navegación

- Usar React Router para navegar entre páginas.
- Usar `Link` o `useNavigate` en lugar de enlaces con `href` para rutas internas.
- Reservar `href` para enlaces externos, `mailto:` y `tel:`.
- Las rutas principales actuales son `/`, `/calendario`, `/crear` y `/contacto`.

## Datos y funcionalidad

- Mientras el proyecto sea únicamente frontend, usar datos estáticos en `src/data/`.
- Las páginas de creación y contacto pueden mostrar estados visuales locales, pero no deben simular persistencia real.
- No instalar paquetes nuevos si la funcionalidad puede resolverse con las dependencias actuales.
- Antes de agregar una dependencia, comprobar si ya existe una solución en React, Tailwind, daisyUI o el código del proyecto.

## Validación

- Después de cambios relevantes, ejecutar:

  ```bash
  npm run lint
  npm run build
  ```

- Corregir errores de lint o compilación antes de considerar terminado el trabajo.
- Verificar especialmente las rutas, los enlaces internos, los formularios visuales y el comportamiento responsive.
