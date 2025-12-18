import axios from 'axios'

// Determine the correct API base URL for both dev and production
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname.includes('localhost')
    ? '/api'
    : 'https://pet-server-seven.vercel.app/api')

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
})

export default api


