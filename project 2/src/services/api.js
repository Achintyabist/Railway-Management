import axios from 'axios'


const API_BASE_URL = 'http://localhost:8080/api/railway'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})


export const addTrain = async (trainData) => {
  const response = await api.post('/trains', trainData)
  return response.data
}
export const getMinimum = async () => {
  const response = await api.get('/min-platforms')
  return response.data
}

export const getTrains = async () => {
  const response = await api.get('/trains')
  return response.data.length
}

export const getTrainsData = async () => {
  const response = await api.get('/trains')
  return response.data
}

export const getTrainSchedules = async () => {
  const response = await api.get('/trains/schedules')
  return response.data
}


export const addPlatform = async (platformData) => {
  const response = await api.post('/platforms', platformData)
  return response.data
}

export const getPlatforms = async () => {
  const response = await api.get('/platforms')
  return response.data
}

export const getPlatformAllocations = async () => {
  const response = await api.get('/platforms/allocations')
  return response.data
}


export const allocatePlatform = async (trainId) => {
  const response = await api.post(`/platforms/allocate?trainId=${trainId}`)
  return response.data
}

export const deleteTrain= async (trainId) => {
  console.log(trainId)
  const response = await api.delete(`/trains/${trainId}`)
  return response.data
}

export const deletePlatform = async (platformId) => {
  console.log(platformId)
  const response = await api.delete(`/platforms/${platformId}`)
  return response.data
}


export const fetchTrainCount = async () => {

  const trains = await getTrains()
  return trains.length
}

export const fetchPlatformCount = async () => {
  const platforms = await getPlatforms()
  return platforms.length
}

export const fetchAllocatedCount = async () => {
  const allocations = await getPlatformAllocations()
  return allocations.filter(p => p.occupied).length
}

export default api