import React, { useState, useEffect } from 'react'
import { GridPattern } from '@/components/GridPattern'

export function HeroPattern() {
  // Initialize the state for squares with a function that generates the initial grid
  const [squares, setSquares] = useState(() => generateRandomSquares(15))

  // Function to generate a new set of squares with random positions
  function generateRandomSquares(count) {
    const newSquares = []
    for (let i = 0; i < count; i++) {
      // Assuming a grid of 10x10 for example, you can adjust this as needed
      const x = Math.floor(Math.random() * 10)
      const y = Math.floor(Math.random() * 10)
      newSquares.push([x, y])
    }
    return newSquares
  }

  // Set up an effect to update the squares at a regular interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSquares(generateRandomSquares(10)) // Change the grid every 10 seconds
    }, 10000) // Slow down the update to every 10000 milliseconds (10 seconds)

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="absolute inset-0 -z-10 mx-0 max-w-none overflow-hidden">
      <div className="absolute left-1/2 top-0 ml-[-38rem] h-[25rem] w-[81.25rem] dark:[mask-image:linear-gradient(white,transparent)]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6d28d9] to-[#FFF8E8] opacity-40 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-[#6d28d9]/30 dark:to-[#303428]/30 dark:opacity-100">
          <GridPattern
            width={72}
            height={56}
            x="-12"
            y="4"
            squares={squares}
            className="absolute inset-x-0 inset-y-[-50%] h-[200%] w-full skew-y-[-18deg] fill-black/40 stroke-black/50 mix-blend-overlay dark:fill-white/2.5 dark:stroke-white/5"
          />
        </div>
        <svg
          viewBox="0 0 1113 440"
          aria-hidden="true"
          className="absolute top-0 left-1/2 ml-[-19rem] w-[69.5625rem] fill-white blur-[26px] dark:hidden"
        >
          <path d="M.016 439.5s-9.5-300 434-300S882.516 20 882.516 20V0h230.004v439.5H.016Z" />
        </svg>
      </div>
    </div>
  )
}
