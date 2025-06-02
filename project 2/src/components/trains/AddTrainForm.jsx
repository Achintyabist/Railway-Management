import { useState } from 'react'
import { addTrain } from '../../services/api'
import toast from 'react-hot-toast'

function AddTrainForm({ onTrainAdded }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    arrivalTime: '',
    departureTime: '',
    color: '#3B82F6'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    
    if (!formData.id.trim()) newErrors.id = 'Train ID is required'
    if (!formData.name.trim()) newErrors.name = 'Train Name is required'
    
    // Validate time format (HH:mm)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(formData.arrivalTime)) newErrors.arrivalTime = 'Invalid time format (HH:mm)'
    if (!timeRegex.test(formData.departureTime)) newErrors.departureTime = 'Invalid time format (HH:mm)'
    
    // Check if departure is after arrival
    if (timeRegex.test(formData.arrivalTime) && timeRegex.test(formData.departureTime)) {
      const [arrHour, arrMin] = formData.arrivalTime.split(':').map(Number)
      const [depHour, depMin] = formData.departureTime.split(':').map(Number)
      
      const arrTime = arrHour * 60 + arrMin
      const depTime = depHour * 60 + depMin
      
      if (depTime <= arrTime) newErrors.departureTime = 'Departure must be after arrival'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setLoading(true)
    try {
      await addTrain(formData)
      toast.success('Train added successfully')
      setFormData({
        id: '',
        name: '',
        arrivalTime: '',
        departureTime: '',
        color: '#3B82F6'
      })
      if (onTrainAdded) onTrainAdded()
    } catch (error) {
      console.error('Error adding train:', error)
      toast.error(error.response?.data?.message || 'Failed to add train')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="id" className="form-label">Train ID</label>
        <input
          id="id"
          name="id"
          type="text"
          className={`form-input ${errors.id ? 'border-accent-500 ring-1 ring-accent-500' : ''}`}
          value={formData.id}
          onChange={handleChange}
          placeholder="E.g., 1, 2,..."
          disabled={loading}
        />
        {errors.id && <p className="mt-1 text-sm text-accent-600">{errors.id}</p>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Train Name</label>
        <input
          id="name"
          name="name"
          type="text"
          className={`form-input ${errors.name ? 'border-accent-500 ring-1 ring-accent-500' : ''}`}
          value={formData.name}
          onChange={handleChange}
          placeholder="E.g., Express 505"
          disabled={loading}
        />
        {errors.name && <p className="mt-1 text-sm text-accent-600">{errors.name}</p>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="arrivalTime" className="form-label">Arrival Time (HH:mm)</label>
        <input
          id="arrivalTime"
          name="arrivalTime"
          type="text"
          className={`form-input ${errors.arrivalTime ? 'border-accent-500 ring-1 ring-accent-500' : ''}`}
          value={formData.arrivalTime}
          onChange={handleChange}
          placeholder="E.g., 09:30"
          disabled={loading}
        />
        {errors.arrivalTime && <p className="mt-1 text-sm text-accent-600">{errors.arrivalTime}</p>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="departureTime" className="form-label">Departure Time (HH:mm)</label>
        <input
          id="departureTime"
          name="departureTime"
          type="text"
          className={`form-input ${errors.departureTime ? 'border-accent-500 ring-1 ring-accent-500' : ''}`}
          value={formData.departureTime}
          onChange={handleChange}
          placeholder="E.g., 09:45"
          disabled={loading}
        />
        {errors.departureTime && <p className="mt-1 text-sm text-accent-600">{errors.departureTime}</p>}
      </div>
      
      <button 
        type="submit" 
        className="btn-primary w-full"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Train'}
      </button>
    </form>
  )
}

export default AddTrainForm