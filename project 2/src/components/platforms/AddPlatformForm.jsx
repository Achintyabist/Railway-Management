import { useState } from 'react'
import { addPlatform } from '../../services/api'
import toast from 'react-hot-toast'

function AddPlatformForm({ onPlatformAdded }) {
  const [formData, setFormData] = useState({
    id: '',
    name: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    
    if (!formData.id.trim()) newErrors.id = 'Platform ID is required'
    if (!formData.name.trim()) newErrors.name = 'Platform Name is required'
    
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
      await addPlatform(formData)
      toast.success('Platform added successfully')
      setFormData({
        id: '',
        name: ''
      })
      if (onPlatformAdded) onPlatformAdded()
    } catch (error) {
      console.error('Error adding platform:', error)
      toast.error(error.response?.data?.message || 'Failed to add platform')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="platformId" className="form-label">Platform ID</label>
        <input
          id="platformId"
          name="id"
          type="text"
          className={`form-input ${errors.id ? 'border-accent-500 ring-1 ring-accent-500' : ''}`}
          value={formData.id}
          onChange={handleChange}
          placeholder="E.g., 1, 2 ,..."
          disabled={loading}
        />
        {errors.id && <p className="mt-1 text-sm text-accent-600">{errors.id}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="name" className="form-label">Platform Name</label>
        <input
          id="name"
          name="name"
          type="text"
          className={`form-input ${errors.name ? 'border-accent-500 ring-1 ring-accent-500' : ''}`}
          value={formData.name}
          onChange={handleChange}
          placeholder="E.g., Main Platform"
          disabled={loading}
        />
        {errors.name && <p className="mt-1 text-sm text-accent-600">{errors.name}</p>}
      </div>
      
      <button 
        type="submit" 
        className="btn-primary w-full"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Platform'}
      </button>
    </form>
  )
}

export default AddPlatformForm