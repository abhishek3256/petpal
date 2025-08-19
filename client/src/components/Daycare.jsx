import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { defaultImages } from '../utils/imageLinks'

const Daycare = () => {
  const [daycares, setDaycares] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDaycare, setSelectedDaycare] = useState(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookingData, setBookingData] = useState({
    appointmentDate: '',
    appointmentTime: ''
  })
  const [appointments, setAppointments] = useState([])
  const [bookingAnchorIndex, setBookingAnchorIndex] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchDaycares()
    fetchAppointments()
  }, [])

  const fetchDaycares = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || '/api'}/daycare`)
      setDaycares(response.data)
    } catch (error) {
      toast.error('Failed to fetch daycare services')
    } finally {
      setLoading(false)
    }
  }

  const fetchAppointments = async () => {
    if (!user) return
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || '/api'}/orders/appointments?type=daycare&mine=true`, { withCredentials: true })
      setAppointments(res.data)
    } catch {}
  }

  const handleBookDaycare = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please login to book daycare services')
      return
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || '/api'}/orders/service`, {
        serviceProviderId: selectedDaycare._id,
        serviceType: 'daycare',
        appointmentDate: bookingData.appointmentDate,
        appointmentTime: bookingData.appointmentTime
      }, {
        withCredentials: true
      })
      
      toast.success('Daycare service booked successfully!')
      setShowBookingForm(false)
      setSelectedDaycare(null)
      setBookingData({ appointmentDate: '', appointmentTime: '' })
      fetchAppointments()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed')
    }
  }

  const openBookingForm = (daycare, idx) => {
    setSelectedDaycare(daycare)
    setShowBookingForm(true)
    setBookingAnchorIndex(idx)
  }

  if (loading) {
    return <div className="loading">Loading daycare services...</div>
  }

  return (
    <div className="container" style={{ background: 'linear-gradient(135deg, #d8b4d8 0%, #7ee8c4 100%)', borderRadius: 16, padding: 24 }}>
      <h1 className="section-title">Pet Daycare</h1>
      <p className="section-subtitle">Safe and caring daycare services for your pets</p>
      
      <div className="grid">
        {daycares.map((daycare, idx) => {
          const isOpen = showBookingForm && selectedDaycare && selectedDaycare._id === daycare._id;
          return (
            <div key={daycare._id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
              <div className="card" style={{ position: 'relative', marginBottom: 16 }}>
                <img
                  src={daycare.image || defaultImages.user}
                  alt={daycare.fullName}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '15px'
                  }}
                />
                <h3>{daycare.fullName}</h3>
                <p><strong>Age:</strong> {daycare.age} years</p>
                <p><strong>Sex:</strong> {daycare.sex}</p>
                <p><strong>Location:</strong> {daycare.location}</p>
                <p><strong>Rate:</strong> ₹{daycare.hourlyRate}/hour</p>
                <div style={{ marginTop: '15px' }}>
                  <button
                    onClick={() => openBookingForm(daycare, idx)}
                    className="btn btn-secondary"
                  >
                    Book Daycare
                  </button>
                </div>
              </div>
              {isOpen && (
                <div className="card" style={{ marginTop: 0, background: '#f9f9f9', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <h3>Book Daycare with {daycare.fullName}</h3>
                  <p><strong>Rate:</strong> ₹{daycare.hourlyRate}/hour</p>
                  <form onSubmit={handleBookDaycare}>
                    <div className="form-group">
                      <label htmlFor="appointmentDate">Daycare Date</label>
                      <input
                        type="date"
                        id="appointmentDate"
                        name="appointmentDate"
                        value={bookingData.appointmentDate}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          appointmentDate: e.target.value
                        })}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="appointmentTime">Drop-off Time</label>
                      <select
                        id="appointmentTime"
                        name="appointmentTime"
                        value={bookingData.appointmentTime}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          appointmentTime: e.target.value
                        })}
                        required
                      >
                        <option value="">Select Time</option>
                        <option value="08:00">08:00 AM</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                      </select>
                    </div>
                    <div className="flex" style={{ gap: '10px' }}>
                      <button type="submit" className="btn btn-success">
                        Book Daycare
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBookingForm(false)}
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
      
      {daycares.length === 0 && (
        <div className="text-center">
          <p>No daycare services available at the moment.</p>
        </div>
      )}

      {/* Daycare Appointment Catalogue */}
      {user?.role === 'daycare' && appointments.length > 0 && (
        <div className="card" style={{ maxWidth: 900, margin: '40px auto', maxHeight: 350, overflowY: 'auto' }}>
          <h3>My Daycare Appointments</h3>
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

export default Daycare 