import greenLeaf from '../images/single-leaf-green.png'
import oliveLeaf from '../images/single-leaf-olive.png'

const looseLeaves = [
  { position: 'hero-upper-left', src: greenLeaf },
  { position: 'hero-lower-left', src: oliveLeaf },
  { position: 'hero-lower-right', src: greenLeaf },
  { position: 'board-open-space', src: oliveLeaf },
]

// Coloca hojas decorativas alrededor de la portada sin interferir con los controles.
function CornerFoliage() {
  return (
    <div className="foliage-scene pointer-events-none absolute inset-0" aria-hidden="true">
      {looseLeaves.map(({ position, src }) => (
        <img
          key={`leaf-${position}`}
          className={`floating-leaf floating-leaf--${position}`}
          src={src}
          alt=""
          draggable="false"
        />
      ))}
    </div>
  )
}

export default CornerFoliage
