import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { defaultImages } from '../utils/imageLinks'

const Vets = () => {
  const [vets, setVets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVet, setSelectedVet] = useState(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookingData, setBookingData] = useState({
    appointmentDate: '',
    appointmentTime: ''
  })
  const [appointments, setAppointments] = useState([])
  const [bookingAnchorIndex, setBookingAnchorIndex] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchVets()
    fetchAppointments()
  }, [])

  const fetchVets = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/vets`)
      setVets(response.data)
    } catch (error) {
      toast.error('Failed to fetch veterinarians')
    } finally {
      setLoading(false)
    }
  }

  const fetchAppointments = async () => {
    if (!user) return
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders/appointments`, { withCredentials: true })
      setAppointments(response.data)
    } catch (error) {
      // fail silently
    }
  }

  const handleBookAppointment = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please login to book appointments')
      return
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/orders/service`, {
        serviceProviderId: selectedVet._id,
        serviceType: 'vet',
        appointmentDate: bookingData.appointmentDate,
        appointmentTime: bookingData.appointmentTime
      }, {
        withCredentials: true
      })
      
      toast.success('Appointment booked successfully!')
      setShowBookingForm(false)
      setSelectedVet(null)
      setBookingData({ appointmentDate: '', appointmentTime: '' })
      fetchAppointments()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed')
    }
  }

  const openBookingForm = (vet, idx) => {
    setSelectedVet(vet)
    setShowBookingForm(true)
    setBookingAnchorIndex(idx)
  }

  if (loading) {
    return <div className="loading">Loading veterinarians...</div>
  }

  return (
    <div className="container" style={{ background: 'linear-gradient(135deg, #ffe3cf 0%, #bfc3d9 100%)', borderRadius: 16, padding: 24 }}>
      <h1 className="section-title">Veterinarians</h1>
      <p className="section-subtitle">Book appointments with experienced vets</p>
      
      <div className="grid">
        {vets.map((vet, idx) => (
          <div key={vet._id} className="card" style={{ position: 'relative' }}>
            <img
              src={vet.image || defaultImages.user}
              alt={vet.fullName}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '15px'
              }}
            />
            
            <h3>Dr. {vet.fullName}</h3>
            <p><strong>Age:</strong> {vet.age} years</p>
            <p><strong>Sex:</strong> {vet.sex}</p>
            <p><strong>Location:</strong> {vet.location}</p>
            <p><strong>Rate:</strong> ₹{vet.hourlyRate}/hour</p>
            
            <div style={{ marginTop: '15px' }}>
              <button
                onClick={() => openBookingForm(vet, idx)}
                className="btn btn-secondary"
              >
                Book Appointment
              </button>
            </div>
            {showBookingForm && selectedVet && selectedVet._id === vet._id && (
              <div
                className="card floating-booking-form"
                style={{
                  position: 'absolute',
                  top: 0,
                  [bookingAnchorIndex === vets.length - 1 ? 'right' : 'left']: '105%',
                  zIndex: 10,
                  width: 320,
                  minWidth: 220,
                  maxWidth: '90vw',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
                  background: '#fff',
                  marginLeft: bookingAnchorIndex === vets.length - 1 ? undefined : 12,
                  marginRight: bookingAnchorIndex === vets.length - 1 ? 12 : undefined
                }}
              >
                <h3>Book Appointment with Dr. {selectedVet.fullName}</h3>
                <p><strong>Rate:</strong> ₹{selectedVet.hourlyRate}/hour</p>
                <form onSubmit={handleBookAppointment}>
                  <div className="form-group">
                    <label htmlFor="appointmentDate">Appointment Date</label>
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
                    <label htmlFor="appointmentTime">Appointment Time</label>
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
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="17:00">05:00 PM</option>
                    </select>
                  </div>
                  <div className="flex" style={{ gap: '10px' }}>
                    <button type="submit" className="btn btn-success">
                      Book Appointment
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
        ))}
      </div>
      
      {vets.length === 0 && (
        <div className="text-center">
          <p>No veterinarians available at the moment.</p>
        </div>
      )}

      {/* Vet Appointment Catalog */}
      {user && appointments.length > 0 && (
        <div className="card" style={{ maxWidth: '900px', margin: '40px auto', maxHeight: 350, overflowY: 'auto' }}>
          <h3>Vet Appointment Catalog</h3>
          <div className="grid">
            {appointments.map((appt) => (
              <div key={appt._id} className="card" style={{ minWidth: 220, margin: 8 }}>
                <p><strong>Vet:</strong> {appt.vet?.fullName || 'N/A'}</p>
                <p><strong>User:</strong> {appt.buyer?.fullName || 'N/A'}</p>
                <p><strong>Date:</strong> {new Date(appt.appointmentDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {appt.appointmentTime}</p>
                <p><strong>Status:</strong> {appt.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Vets 