import { useState, useEffect } from 'react'
import { getTrainSchedules } from '../../services/api'
import LoadingSpinner from '../ui/LoadingSpinner'

function TrainSchedule({ refreshTrigger }) {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true)
        const data = await getTrainSchedules()
// Remove duplicates by train ID
const uniqueSchedules = Array.from(new Map(data.map(item => [item.id, item])).values())
setSchedules(uniqueSchedules)
        setError(null)
      } catch (err) {
        console.error('Error fetching train schedules:', err)
        setError('Failed to load train schedules')
      } finally {
        setLoading(false)
      }
    }

    fetchSchedules()
  }, [refreshTrigger])

  const getContrastColor = (hexColor) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16)
    const g = parseInt(hexColor.slice(3, 5), 16)
    const b = parseInt(hexColor.slice(5, 7), 16)
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    
    return luminance > 0.5 ? '#000000' : '#FFFFFF'
  }

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

  if (schedules.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-md text-center">
        <p className="text-gray-500">No trains scheduled yet</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="table-header">ID</th>
            <th scope="col" className="table-header">Name</th>
            <th scope="col" className="table-header">Arrival</th>
            <th scope="col" className="table-header">Departure</th>
            <th scope="col" className="table-header">Platform</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {schedules.map((train) => (
            <tr key={train.id} className="hover:bg-gray-50">
              <td className="table-cell font-medium">{train.id}</td>
              <td className="table-cell">{train.name}</td>
              <td className="table-cell">{train.arrivalTime}</td>
              <td className="table-cell">{train.departureTime}</td>
              <td className="table-cell">
                {train.platformId === 0 ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-yellow-100 text-yellow-800">
                    Not Assigned
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                    Platform {train.platformId}
                  </span>
                )}
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TrainSchedule