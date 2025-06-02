import TrainSchedule from '../components/trains/TrainSchedule'

function SchedulePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Train Schedule</h1>
      
      <div className="card">
        <TrainSchedule />
      </div>
    </div>
  )
}

export default SchedulePage