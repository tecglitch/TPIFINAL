import horizontalVine from '../images/board-vine-horizontal.png'
import verticalVine from '../images/board-vine-vertical.png'

function WoodFrameFoliage() {
  return (
    <div
      className="wood-frame-foliage pointer-events-none absolute inset-0"
      style={{
        '--horizontal-vine': `url("${horizontalVine}")`,
        '--vertical-vine': `url("${verticalVine}")`,
      }}
      aria-hidden="true"
    >
      <span className="wood-vine wood-vine--top" />
      <span className="wood-vine wood-vine--right" />
      <span className="wood-vine wood-vine--bottom" />
      <span className="wood-vine wood-vine--left" />
    </div>
  )
}

export default WoodFrameFoliage
