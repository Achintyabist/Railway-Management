import { useState, useEffect } from 'react'
import axios from 'axios'

function usePolling(interval = 5000) {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    let timerId

    const fetchAllocations = async () => {
      try {
        const response = await axios.get('/api/railway/platforms/allocations')
        if (isMounted) {
          setData(response.data)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch platform allocations')
          console.error('Polling error:', err)
        }
      } finally {
        if (isMounted) {
          timerId = setTimeout(fetchAllocations, interval)
        }
      }
    }

    fetchAllocations()

    return () => {
      isMounted = false
      clearTimeout(timerId)
    }
  }, [interval])

  return { data, error }
}

export default usePolling
