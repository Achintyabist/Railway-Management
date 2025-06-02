import { NavLink } from 'react-router-dom'
import { 
  RiDashboardLine, 
  RiTrainLine, 
  RiRoadMapLine,
  RiTimeLine,
  RiLayoutGridLine, 
  RiCloseLine 
} from 'react-icons/ri'

function Sidebar({ isOpen, toggleSidebar }) {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: RiDashboardLine },
    { name: 'Trains', path: '/trains', icon: RiTrainLine },
    { name: 'Platforms', path: '/platforms', icon: RiRoadMapLine },
    { name: 'Schedule', path: '/schedule', icon: RiTimeLine },
    { name: 'Allocations', path: '/allocations', icon: RiLayoutGridLine },
  ]

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary-700 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-primary-600">
        <h2 className="text-xl font-semibold">Railway Manager</h2>
        <button 
          onClick={toggleSidebar} 
          className="md:hidden text-white rounded-md p-1 hover:bg-primary-800 transition-colors"
        >
          <RiCloseLine className="h-6 w-6" />
        </button>
      </div>
      
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary-800 text-white' 
                    : 'text-primary-100 hover:bg-primary-600'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default Sidebar