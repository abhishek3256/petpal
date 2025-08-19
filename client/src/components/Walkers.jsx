import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { defaultImages } from '../utils/imageLinks'

const Walkers = () => {
  const [walkers, setWalkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedWalker, setSelectedWalker] = useState(null)
  const [showHiringForm, setShowHiringForm] = useState(false)
  const [hiringData, setHiringData] = useState({
    appointmentDate: '',
    appointmentTime: ''
  })
  const [appointments, setAppointments] = useState([])
  const [hiringAnchorIndex, setHiringAnchorIndex] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchWalkers()
    fetchAppointments()
  }, [])

  const fetchWalkers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || '/api'}/walkers`)
      setWalkers(response.data)
    } catch (error) {
      toast.error('Failed to fetch pet walkers')
    } finally {
      setLoading(false)
    }
  }

  const fetchAppointments = async () => {
    if (!user) return
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || '/api'}/orders/appointments?type=walker&mine=true`, { withCredentials: true })
      setAppointments(res.data)
    } catch {}
  }

  const handleHireWalker = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please login to hire walkers')
      return
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || '/api'}/orders/service`, {
        serviceProviderId: selectedWalker._id,
        serviceType: 'walker',
        appointmentDate: hiringData.appointmentDate,
        appointmentTime: hiringData.appointmentTime
      }, {
        withCredentials: true
      })
      
      toast.success('Walker hired successfully!')
      setShowHiringForm(false)
      setSelectedWalker(null)
      setHiringData({ appointmentDate: '', appointmentTime: '' })
      fetchAppointments()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Hiring failed')
    }
  }

  const openHiringForm = (walker, idx) => {
    setSelectedWalker(walker)
    setShowHiringForm(true)
    setHiringAnchorIndex(idx)
  }

  if (loading) {
    return <div className="loading">Loading pet walkers...</div>
  }

  return (
    <div className="container" style={{ background: 'linear-gradient(135deg, #e3eef7 0%, #b0cbe5 100%)', borderRadius: 16, padding: 24 }}>
      <h1 className="section-title">Pet Walkers</h1>
      <p className="section-subtitle">Professional pet walking services</p>
      
      <div className="grid">
        {walkers.map((walker, idx) => {
          const isOpen = showHiringForm && selectedWalker && selectedWalker._id === walker._id;
          return (
            <div key={walker._id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
              <div className="card" style={{ position: 'relative', marginBottom: 16 }}>
                <img
                  src={walker.image || defaultImages.user}
                  alt={walker.fullName}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '15px'
                  }}
                />
                <h3>{walker.fullName}</h3>
                <p><strong>Age:</strong> {walker.age} years</p>
                <p><strong>Sex:</strong> {walker.sex}</p>
                <p><strong>Location:</strong> {walker.location}</p>
                <p><strong>Rate:</strong> ₹{walker.hourlyRate}/hour</p>
                <div style={{ marginTop: '15px' }}>
                  <button
                    onClick={() => openHiringForm(walker, idx)}
                    className="btn btn-secondary"
                  >
                    Hire Walker
                  </button>
                </div>
              </div>
              {isOpen && (
                <div className="card" style={{ marginTop: 0, background: '#f9f9f9', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <h3>Hire {walker.fullName}</h3>
                  <p><strong>Rate:</strong> ₹{walker.hourlyRate}/hour</p>
                  <form onSubmit={handleHireWalker}>
                    <div className="form-group">
                      <label htmlFor="appointmentDate">Walking Date</label>
                      <input
                        type="date"
                        id="appointmentDate"
                        name="appointmentDate"
                        value={hiringData.appointmentDate}
                        onChange={(e) => setHiringData({
                          ...hiringData,
                          appointmentDate: e.target.value
                        })}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="appointmentTime">Walking Time</label>
                      <select
                        id="appointmentTime"
                        name="appointmentTime"
                        value={hiringData.appointmentTime}
                        onChange={(e) => setHiringData({
                          ...hiringData,
                          appointmentTime: e.target.value
                        })}
                        required
                      >
                        <option value="">Select Time</option>
                        <option value="06:00">06:00 AM</option>
                        <option value="07:00">07:00 AM</option>
                        <option value="08:00">08:00 AM</option>
                        <option value="17:00">05:00 PM</option>
                        <option value="18:00">06:00 PM</option>
                        <option value="19:00">07:00 PM</option>
                        <option value="20:00">08:00 PM</option>
                      </select>
                    </div>
                    <div className="flex" style={{ gap: '10px' }}>
                      <button type="submit" className="btn btn-success">
                        Hire Walker
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowHiringForm(false)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {walkers.length === 0 && (
        <div className="text-center">
          <p>No pet walkers available at the moment.</p>
        </div>
      )}

      {/* Walker Appointment Catalogue */}
      {user?.role === 'walker' && appointments.length > 0 && (
        <div className="card" style={{ maxWidth: 900, margin: '40px auto', maxHeight: 350, overflowY: 'auto' }}>
          <h3>My Walker Appointments</h3>
          <div className="grid">
            {appointments.map((appt) => (
              <div key={appt._id} className="card" style={{ minWidth: 220, margin: 8 }}>
                <p><strong>User:</strong> {appt.buyer?.fullName || 'N/A'}</p>
                <p><strong>Date:</strong> {new Date(appt.appointmentDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {appt.appointmentTime}</p>
                <p><strong>Status:</strong> {appt.status}</p>
                <p><strong>Contact:</strong> {appt.buyer?.contactNumber || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Walkers 