import { useState, useEffect } from 'react'
import { getPlatformAllocations } from '../services/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'

function AllocationsPage() {
  const [allocations, setAllocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        setLoading(true)
        const data = await getPlatformAllocations()
        setAllocations(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching platform allocations:', err)
        setError('Failed to load platform allocations')
      } finally {
        setLoading(false)
      }
    }

    fetchAllocations()
    
    // Set up an interval to refresh data every 30 seconds
    const intervalId = setInterval(fetchAllocations, 30000)
    
    return () => clearInterval(intervalId)
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="bg-accent-50 text-accent-700 p-4 rounded-md">
        <p>{error}</p>
      </div>
    )
  }

  if (allocations.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">No platform allocations available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Platform Allocations</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allocations.map((platform) => (
          <div 
            key={platform.id}
            className={`card ${platform.occupied ? 'border-l-4 border-accent-600' : 'border-l-4 border-success-600'}`}
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">Platform {platform.platformId}</h2>
              <span 
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${platform.occupied 
                    ? 'bg-accent-100 text-accent-800' 
                    : 'bg-success-100 text-success-800'
                  }`}
              >
                {platform.occupied ? 'Occupied' : 'Available'}
              </span>
            </div>
            
            <div className="space-y-2">
              {platform.occupied ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Current Train:</span>
                    <span className="font-medium">{platform.currentTrainId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Next Free Time:</span>
                    <span className="font-medium">{platform.nextFreeTime || 'Unknown'}</span>
                  </div>
                </>
              ) : (
                <div className="text-sm text-center py-2 text-success-600">
                  Ready for allocation
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllocationsPage