import { useState } from 'react'
import AddPlatformForm from '../components/platforms/AddPlatformForm'
import DeallocatePlatform from '../components/platforms/DeletePlatform'
import usePolling from '../hooks/usePolling'

function PlatformsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { data: platformAllocations, error } = usePolling(5000)

  const handlePlatformChange = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Platform Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-medium mb-4">Add New Platform</h2>
          <AddPlatformForm onPlatformAdded={handlePlatformChange} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="card">
            <h2 className="text-lg font-medium mb-4">Delete Platform</h2>
            <DeallocatePlatform
              onPlatformDeallocated={handlePlatformChange}
              refreshTrigger={refreshTrigger}
              platformAllocations={platformAllocations}
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlatformsPage
