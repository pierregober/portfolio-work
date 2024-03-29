import { useId } from 'react'

export function GridPattern({ width, height, x, y, squares, ...props }) {
  let patternId = useId()

  // Define the animation name and duration
  const animationName = 'pulseColor'
  const animationDuration = '2s' // 2 seconds for a full light to dark cycle

  return (
    <svg aria-hidden="true" {...props}>
      <style>
        {`
          @keyframes ${animationName} {
            0%, 100% {
              fill: rgba(255, 255, 255, 0.1); /* original dark color */
            }
            50% {
              fill: rgba(255, 255, 255, 0.4); /* lighter color */
            }
          }
        `}
      </style>
      <defs>
        <pattern
          height={height}
          id={patternId}
          patternUnits="userSpaceOnUse"
          width={width}
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([squareX, squareY], index) => (
            <rect
              height={height}
              key={`${squareX}-${squareY}-${index}`}
              strokeWidth="0"
              style={{
                animationDelay: `${index * 0.1}s`, // Staggered effect
                animationDirection: 'alternate',
                animationDuration: `${animationDuration}`,
                animationIterationCount: 'infinite',
                animationName: `${animationName}`,
                animationTimingFunction: 'ease-in-out',
              }}
              width={width}
              x={squareX * width}
              y={squareY * height}
            />
          ))}
        </svg>
      )}
    </svg>
  )
}
