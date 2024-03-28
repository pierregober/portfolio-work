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
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
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
              strokeWidth="0"
              key={`${squareX}-${squareY}`}
              width={width}
              height={height}
              x={squareX * width}
              y={squareY * height}
              style={{
                animationName: `${animationName}`,
                animationDuration: `${animationDuration}`,
                animationIterationCount: 'infinite',
                animationDirection: 'alternate',
                animationTimingFunction: 'ease-in-out',
                animationDelay: `${index * 0.1}s`, // Staggered effect
              }}
            />
          ))}
        </svg>
      )}
    </svg>
  )
}
