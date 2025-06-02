import { useState } from 'react'
import AddTrainForm from '../components/trains/AddTrainForm'
import TrainSchedule from '../components/trains/TrainSchedule'
import DeleteTrains from '../components/trains/DeleteTrains'

function TrainsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [error, setError] = useState(null)

  const handleTrainAdded = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleTrainDelete = () => {
    setRefreshTrigger(prev => prev + 1)
    console.log('Train deleted')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Trains Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-lg font-medium mb-4">Add New Train</h2>
            <AddTrainForm onTrainAdded={handleTrainAdded} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-medium mb-4">Train Schedule</h2>
            <TrainSchedule refreshTrigger={refreshTrigger} />
          </div>
        </div>

        <div className="col-span-full">
          <div className="card">
            <h2 className="text-lg font-medium mb-4">Delete Train</h2>
            <DeleteTrains
              onTrainDeleted={handleTrainDelete}
              refreshTrigger={refreshTrigger}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrainsPage
