import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { RiTrainLine, RiRoadMapLine, RiTimeLine, RiLayoutGridLine } from 'react-icons/ri'
import { fetchTrainCount, fetchPlatformCount, fetchAllocatedCount, getTrains, getPlatforms ,getPlatformAllocations, getMinimum} from '../services/api'

function Dashboard() {
  const [trains, setTrains] = useState('...')
  const [platforms, setPlatforms] = useState('...')
  const [allocated, setAllocated] = useState('...')
  const [available, setAvailable] = useState('...')
  const [loading, setLoading] = useState(true)
  const [minimum,setMinimum] = useState('...')

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [trainCount, platformCount, allocatedCount, min] = await Promise.all([
          getTrains(),
          getPlatforms(),
          getPlatformAllocations(),
          getMinimum()
        ])

        setTrains(trainCount)
        setPlatforms(platformCount)
        setAllocated(allocatedCount.length)
        setAvailable(platformCount - allocatedCount.length)
        setMinimum(min);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const cards = [
    {
      title: 'Trains',
      value: trains,
      icon: RiTrainLine,
      color: 'bg-blue-500',
      link: '/trains'
    },
    {
      title: 'Platforms',
      value: platforms,
      icon: RiRoadMapLine,
      color: 'bg-green-500',
      link: '/platforms'
    },
    {
      title: 'Minimum Platform Required',
      value: minimum,
      icon: RiTrainLine,
      color: 'bg-red-500',
      link: '/'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            to={card.link}
            key={card.title}
            className="card hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center">
              <div className={`${card.color} rounded-md p-3 mr-4 text-white`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-2xl font-semibold">
                  {loading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    card.value
                  )}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
      </div>
    </div>
  )
}

export default Dashboard
