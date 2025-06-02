import { useState, useEffect } from 'react'
import { getPlatformAllocations, deletePlatform } from '../../services/api'
import toast from 'react-hot-toast'
import LoadingSpinner from '../ui/LoadingSpinner'

function DeallocatePlatform({ onPlatformDeallocated, refreshTrigger }) {
  const [platforms, setPlatforms] = useState([])
  const [selectedPlatformId, setSelectedPlatformId] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetchingPlatforms, setFetchingPlatforms] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        setFetchingPlatforms(true)
        const allocations = await getPlatformAllocations()
        // Filter to only show occupied platforms
        const occupiedPlatforms = allocations
        setPlatforms(occupiedPlatforms)
        setError(null)
      } catch (err) {
        console.error('Error fetching platforms:', err)
        setError('Failed to load platforms')
      } finally {
        setFetchingPlatforms(false)
      }
    }

    fetchPlatforms()
  }, [refreshTrigger])

  const handleDeallocate = async () => {
    if (!selectedPlatformId) {
      toast.error('Please select a platform')
      return
    }
    
    setLoading(true)
    try {
      await deletePlatform(selectedPlatformId)
      toast.success('Platform deleted successfully')
      setSelectedPlatformId('')
      if (onPlatformDeallocated) onPlatformDeallocated()
    } catch (error) {
      console.error('Error deleting platform:', error)
      toast.error(error.response?.data?.message || 'Failed to deleting platform')
    } finally {
      setLoading(false)
    }
  }

  if (fetchingPlatforms) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="bg-accent-50 text-accent-700 p-4 rounded-md">
        <p>{error}</p>
      </div>
    )
  }

  if (platforms.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-md text-center">
        <p className="text-gray-500">No occupied platforms to delete</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="platformId" className="form-label">Select Platform</label>
        <select
          id="platformId"
          className="form-input"
          value={selectedPlatformId}
          onChange={(e) => setSelectedPlatformId(e.target.value)}
          disabled={loading}
        >
          <option value="">-- Select Platform --</option>
          {platforms.map((platform) => (
            <option key={platform.platformId} value={platform.platformId}>
              Platform {platform.platformId}
            </option>
          ))}
        </select>
      </div>
      
      <button 
        onClick={handleDeallocate}
        className="btn-danger w-full"
        disabled={loading || !selectedPlatformId}
      >
        {loading ? 'Deleting...' : 'Delete Platform'}
      </button>
    </div>
  )
}

export default DeallocatePlatform