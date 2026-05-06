// src/hooks/useTrackVisite.js
import { useEffect } from 'react'
import axios from 'axios'

const useTrackVisite = (page = null) => {
  useEffect(() => {
    const track = async () => {
      try {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}visites/track`, {
          page: page || window.location.pathname,
        })
      } catch (error) {
        // Silencieux — ne pas bloquer l'affichage
        console.error('Track visite:', error)
      }
    }

    track()
  }, [page])
}

export default useTrackVisite