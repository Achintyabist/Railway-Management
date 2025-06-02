import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'
import Dashboard from './pages/Dashboard'
import TrainsPage from './pages/TrainsPage'
import PlatformsPage from './pages/PlatformsPage'
import SchedulePage from './pages/SchedulePage'
import AllocationsPage from './pages/AllocationsPage'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trains" element={<TrainsPage />} />
            <Route path="/platforms" element={<PlatformsPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/allocations" element={<AllocationsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App