import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { defaultImages } from '../utils/imageLinks'

const timeOptions = [
  { value: '09:00', label: '09:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '13:00', label: '01:00 PM' },
  { value: '14:00', label: '02:00 PM' },
  { value: '15:00', label: '03:00 PM' },
  { value: '16:00', label: '04:00 PM' },
  { value: '17:00', label: '05:00 PM' },
  { value: '18:00', label: '06:00 PM' },
]

const Vets = () => {
  const [vets, setVets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVet, setSelectedVet] = useState(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookingData, setBookingData] = useState({ appointmentDate: '', appointmentTime: '' })
  const { user } = useAuth()

  useEffect(() => {
    fetchVets()
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

  const openBookingForm = (vet) => {
    setSelectedVet(vet)
    setShowBookingForm(true)
    setBookingData({ appointmentDate: '', appointmentTime: '' })
  }

  const handleBookAppointment = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to book an appointment')
      return
    }
    if (!bookingData.appointmentDate || !bookingData.appointmentTime) {
      toast.error('Please select date and time')
      return
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/appointments`, {
        providerId: selectedVet._id,
        serviceType: 'vet',
        appointmentDate: bookingData.appointmentDate,
        appointmentTime: bookingData.appointmentTime
      }, { withCredentials: true })
      toast.success('Appointment booked!')
      setShowBookingForm(false)
      setSelectedVet(null)
      setBookingData({ appointmentDate: '', appointmentTime: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed')
    }
  }

  if (loading) {
    return <div className="loading">Loading veterinarians...</div>
  }

  return (
    <div className="container" style={{ background: 'linear-gradient(135deg, #ffe3cf 0%, #bfc3d9 100%)', borderRadius: 16, padding: 24 }}>
      <h1 className="section-title">Veterinarians</h1>
      <p className="section-subtitle">Book appointments with experienced vets</p>
      <div className="grid">
        {vets.map((vet, idx) => {
          const isOpen = showBookingForm && selectedVet && selectedVet._id === vet._id;
          return (
            <div key={vet._id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
              <div className="card" style={{ position: 'relative', marginBottom: 16 }}>
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
                {user && user.role !== 'admin' && user._id !== vet._id && user.id !== vet._id && (
                  <div style={{ marginTop: '15px' }}>
                    <button
                      onClick={() => openBookingForm(vet)}
                      className="btn btn-secondary"
                    >
                      Book Appointment
                    </button>
                  </div>
                )}
              </div>
              {isOpen && (
                <div className="card" style={{ marginTop: 0, background: '#f9f9f9', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <h3>Book Appointment with Dr. {vet.fullName}</h3>
                  <p><strong>Rate:</strong> ₹{vet.hourlyRate}/hour</p>
                  <form onSubmit={handleBookAppointment}>
                    <div className="form-group">
                      <label htmlFor="appointmentDate">Date</label>
                      <input
                        type="date"
                        id="appointmentDate"
                        name="appointmentDate"
                        value={bookingData.appointmentDate}
                        onChange={e => setBookingData({ ...bookingData, appointmentDate: e.target.value })}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="appointmentTime">Time</label>
                      <select
                        id="appointmentTime"
                        name="appointmentTime"
                        value={bookingData.appointmentTime}
                        onChange={e => setBookingData({ ...bookingData, appointmentTime: e.target.value })}
                        required
                      >
                        <option value="">Select Time</option>
                        {timeOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex" style={{ gap: '10px' }}>
                      <button type="submit" className="btn btn-success">
                        Book Appointment
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowBookingForm(false); setSelectedVet(null); }}
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
      {vets.length === 0 && (
        <div className="text-center">
          <p>No veterinarians available at the moment.</p>
        </div>
      )}
    </div>
  )
}

export default Vets