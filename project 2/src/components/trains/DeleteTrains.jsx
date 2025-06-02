import { useState, useEffect } from 'react'
import { deleteTrain, getTrainsData } from '../../services/api'
import toast from 'react-hot-toast'
import LoadingSpinner from '../ui/LoadingSpinner'

function DeleteTrain({ onTrainDeleted, refreshTrigger }) {
  const [trains, setTrains] = useState([])
  const [selectedTrainId, setSelectedTrainId] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetchingTrains, setFetchingTrains] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        setFetchingTrains(true)
        const trainList = await getTrainsData()
        setTrains(trainList)
        setError(null)
      } catch (err) {
        console.error('Error fetching trains:', err)
        setError('Failed to load trains')
      } finally {
        setFetchingTrains(false)
      }
    }

    fetchTrains()
  }, [refreshTrigger])

  const handleDelete = async () => {
    if (!selectedTrainId) {
      toast.error('Please select a train')
      return
    }

    setLoading(true)
    try {
      await deleteTrain(selectedTrainId)
      toast.success('Train deleted successfully')
      setSelectedTrainId('')
      if (onTrainDeleted) onTrainDeleted()
    } catch (error) {
      console.error('Error deleting train:', error)
      toast.error(error.response?.data?.message || 'Failed to delete train')
    } finally {
      setLoading(false)
    }
  }

  if (fetchingTrains) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="bg-accent-50 text-accent-700 p-4 rounded-md">
        <p>{error}</p>
      </div>
    )
  }

  if (trains.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-md text-center">
        <p className="text-gray-500">No trains available to delete</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="trainId" className="form-label">Select Train</label>
        <select
          id="trainId"
          className="form-input"
          value={selectedTrainId}
          onChange={(e) => setSelectedTrainId(e.target.value)}
          disabled={loading}
        >
          <option value="">-- Select Train --</option>
          {trains.map((train) => (
            <option key={train.id} value={train.id}>
              Train {train.name} (ID: {train.id})
            </option>
          ))}
        </select>
      </div>
      
      <button 
        onClick={handleDelete}
        className="btn-danger w-full"
        disabled={loading || !selectedTrainId}
      >
        {loading ? 'Deleting...' : 'Delete Train'}
      </button>
    </div>
  )
}

export default DeleteTrain
