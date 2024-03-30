import { useGiscusScript } from "./hooks/useGiscusScript"

export function GiscusComments({ darkMode }) {
  useGiscusScript({ darkMode });
  return null; // This component doesn't render anything itself
}