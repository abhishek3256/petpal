import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const serviceTypes = [
  { value: 'vet', label: 'Veterinarian' },
  { value: 'walker', label: 'Pet Walker' },
  { value: 'daycare', label: 'Pet Daycare' }
]

const Appointments = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('booked')
  const [appointments, setAppointments] = useState([])
  const [appointmentsLoading, setAppointmentsLoading] = useState(false)
  const [rescheduleId, setRescheduleId] = useState(null)
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '' })
  const [booking, setBooking] = useState({ serviceType: '', providerId: '', date: '', time: '' })
  const [providers, setProviders] = useState([])
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, [user])

  useEffect(() => {
    if (user) fetchAllAppointments();
    // eslint-disable-next-line
  }, [user]);

  // Fetch both appointments and service orders
  const fetchAllAppointments = async () => {
    setAppointmentsLoading(true)
    try {
      // Fetch classic appointments (vet)
      let url = ''
      if (user.role === 'admin') {
        url = `${import.meta.env.VITE_API_BASE_URL}/appointments/all`
      } else if (['vet', 'walker', 'daycare'].includes(user.role)) {
        url = `${import.meta.env.VITE_API_BASE_URL}/appointments/provider`
      } else {
        url = `${import.meta.env.VITE_API_BASE_URL}/appointments/my`
      }
      const [classicRes, ordersRes] = await Promise.all([
        axios.get(url, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders/appointments?mine=true`, { withCredentials: true })
      ])
      // Normalize classic appointments
      const classicAppointments = (classicRes.data || []).map(appt => ({
        _id: appt._id,
        serviceType: appt.serviceType,
        provider: appt.provider,
        buyer: appt.buyer,
        appointmentDate: appt.appointmentDate,
        appointmentTime: appt.appointmentTime,
        status: appt.status,
        notes: appt.notes || '',
        source: 'appointments'
      }))
      // Normalize service orders (walker, daycare, vet)
      const orderAppointments = (ordersRes.data || []).map(order => ({
        _id: order._id,
        serviceType: order.type,
        provider: order.seller,
        buyer: order.buyer,
        appointmentDate: order.appointmentDate,
        appointmentTime: order.appointmentTime,
        status: order.status,
        notes: order.notes || '',
        source: 'orders'
      }))
      setAppointments([...classicAppointments, ...orderAppointments])
    } catch (error) {
      toast.error('Failed to fetch appointments')
    } finally {
      setAppointmentsLoading(false)
    }
  }

  const fetchProviders = async (type) => {
    setProviders([])
    let url = ''
    if (type === 'vet') url = `${import.meta.env.VITE_API_BASE_URL}/vets`
    if (type === 'walker') url = `${import.meta.env.VITE_API_BASE_URL}/walkers`
    if (type === 'daycare') url = `${import.meta.env.VITE_API_BASE_URL}/daycare`
    try {
      const res = await axios.get(url)
      // Exclude current user if their role matches
      setProviders(res.data.filter(p => p._id !== user._id && p._id !== user.id))
    } catch (error) {
      toast.error('Failed to fetch providers')
    }
  }

  const handleBook = async (e) => {
    e.preventDefault()
    if (!booking.serviceType || !booking.providerId || !booking.date || !booking.time) {
      toast.error('Please fill all fields')
      return
    }
    setBookingLoading(true)
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/appointments`, {
        providerId: booking.providerId,
        serviceType: booking.serviceType,
        appointmentDate: booking.date,
        appointmentTime: booking.time
      }, { withCredentials: true })
      toast.success('Appointment booked!')
      setBooking({ serviceType: '', providerId: '', date: '', time: '' })
      setProviders([])
      fetchAllAppointments()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed')
    } finally {
      setBookingLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/appointments/${id}`, { withCredentials: true })
      toast.success('Appointment removed!')
      setAppointments(prev => prev.filter(appt => appt._id !== id))
    } catch (error) {
      toast.error('Failed to cancel appointment')
    }
  }

  const handleReschedule = async (id) => {
    if (!rescheduleData.date || !rescheduleData.time) {
      toast.error('Please provide date and time')
      return
    }
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/appointments/${id}/reschedule`, {
        appointmentDate: rescheduleData.date,
        appointmentTime: rescheduleData.time
      }, { withCredentials: true })
      toast.success('Appointment rescheduled!')
      setRescheduleId(null)
      setRescheduleData({ date: '', time: '' })
      fetchAllAppointments()
    } catch (error) {
      toast.error('Failed to reschedule appointment')
    }
  }

  return (
    <div className="container" style={{ maxWidth: 900, margin: '40px auto', background: 'linear-gradient(135deg, #ffe3cf 0%, #bfc3d9 100%)', borderRadius: 16 }}>
      <div className="card" style={{ padding: 32, position: 'relative', background: 'linear-gradient(120deg, #fff 80%, #f3e8ff 100%)' }}>
        <h2 style={{ margin: '0 0 18px 0' }}>Appointments</h2>
        {['vet', 'walker', 'daycare', 'admin'].includes(user.role) ? (
          <div style={{ marginBottom: 18 }}>
            <button className={`btn btn-secondary${tab === 'booked' ? ' active' : ''}`} onClick={() => setTab('booked')}>Booked</button>
            <button className={`btn btn-secondary${tab === 'taken' ? ' active' : ''}`} onClick={() => setTab('taken')} style={{ marginLeft: 10 }}>Taken</button>
          </div>
        ) : null}
        {appointmentsLoading ? (
          <div>Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div>No appointments found.</div>
        ) : user.role === 'admin' ? (
          <>
            {/* My Appointments Section for Admin */}
            <div className="card" style={{ marginBottom: 24, border: '2px solid #137547' }}>
              <h3>My Appointments</h3>
              <div className="grid">
                {appointments.filter(appt =>
                  (appt.provider && (appt.provider._id === user._id || appt.provider._id === user.id)) ||
                  (appt.buyer && (appt.buyer._id === user._id || appt.buyer._id === user.id))
                ).length === 0 && <div>No appointments found for you.</div>}
                {appointments
                  .filter(appt =>
                    (appt.provider && (appt.provider._id === user._id || appt.provider._id === user.id)) ||
                    (appt.buyer && (appt.buyer._id === user._id || appt.buyer._id === user.id))
                  )
                  .map(appt => (
                    <div key={appt._id} className="card" style={{ minWidth: 260, margin: 8, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <p><strong>Professional:</strong> {appt.provider?.fullName || 'N/A'}{appt.provider?.role ? ` (${appt.provider.role})` : ''}</p>
                      <p><strong>Booked By:</strong> {appt.buyer?.fullName || 'N/A'}</p>
                      <p><strong>Date:</strong> {appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString() : 'N/A'}</p>
                      <p><strong>Time:</strong> {appt.appointmentTime || 'N/A'}</p>
                      <p><strong>Status:</strong> <span style={{ color: appt.status === 'cancelled' ? 'red' : appt.status === 'completed' ? 'green' : appt.status === 'confirmed' ? '#137547' : '#888' }}>{appt.status}</span></p>
                    </div>
                  ))}
              </div>
            </div>
            {/* All Appointments Section for Admin */}
            <div className="card" style={{ marginBottom: 24 }}>
              <h3>All Appointments</h3>
              <div className="grid">
                {appointments.length === 0 && <div>No appointments found.</div>}
                {appointments.map(appt => (
                  <div key={appt._id} className="card" style={{ minWidth: 260, margin: 8, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <p><strong>Professional:</strong> {appt.provider?.fullName || 'N/A'}{appt.provider?.role ? ` (${appt.provider.role})` : ''}</p>
                    <p><strong>Booked By:</strong> {appt.buyer?.fullName || 'N/A'}</p>
                    <p><strong>Date:</strong> {appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Time:</strong> {appt.appointmentTime || 'N/A'}</p>
                    <p><strong>Status:</strong> <span style={{ color: appt.status === 'cancelled' ? 'red' : appt.status === 'completed' ? 'green' : appt.status === 'confirmed' ? '#137547' : '#888' }}>{appt.status}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="card" style={{ marginBottom: 24 }}>
              <h3>Vet Appointments</h3>
              <div className="grid">
                {appointments
                  .filter(appt => appt.serviceType === 'vet')
                  .filter(appt => {
                    if (appt.status === 'cancelled') return false;
                    const today = new Date();
                    const apptDate = new Date(appt.appointmentDate);
                    if (apptDate > today) return true;
                    if (
                      apptDate.toDateString() === today.toDateString() &&
                      appt.appointmentTime > today.toTimeString().slice(0, 5)
                    ) return true;
                    return false;
                  })
                  .sort((a, b) => {
                    const dateA = new Date(a.appointmentDate + 'T' + a.appointmentTime);
                    const dateB = new Date(b.appointmentDate + 'T' + b.appointmentTime);
                    return dateA - dateB;
                  })
                  .map(appt => (
                    <div key={appt._id} className="card" style={{ minWidth: 260, margin: 8, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <p><strong>Professional:</strong> {appt.provider?.fullName || 'N/A'}{appt.provider?.role ? ` (${appt.provider.role})` : ''}</p>
                      <p><strong>Booked By:</strong> {appt.buyer?.fullName || 'N/A'}</p>
                      <p><strong>Date:</strong> {appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString() : 'N/A'}</p>
                      <p><strong>Time:</strong> {appt.appointmentTime || 'N/A'}</p>
                      <p><strong>Status:</strong> <span style={{ color: appt.status === 'cancelled' ? 'red' : appt.status === 'completed' ? 'green' : appt.status === 'confirmed' ? '#137547' : '#888' }}>{appt.status}</span></p>
                      {((user && (user.role === 'admin' || (appt.buyer && (appt.buyer._id === user._id || appt.buyer._id === user.id)))) && appt.status !== 'cancelled') && (
                        <>
                          <button className="btn" style={{ backgroundColor: '#e17055', marginTop: 8 }} onClick={() => handleCancel(appt._id)}>Cancel</button>
                          <button className="btn btn-secondary" style={{ marginTop: 8 }} onClick={() => setRescheduleId(appt._id)}>Reschedule</button>
                          {rescheduleId === appt._id && (
                            <div style={{ marginTop: 8 }}>
                              <input type="date" value={rescheduleData.date} onChange={e => setRescheduleData({ ...rescheduleData, date: e.target.value })} />
                              <input type="time" value={rescheduleData.time} onChange={e => setRescheduleData({ ...rescheduleData, time: e.target.value })} />
                              <button className="btn btn-success" style={{ marginLeft: 8 }} onClick={() => handleReschedule(appt._id)}>Save</button>
                              <button className="btn btn-secondary" style={{ marginLeft: 8 }} onClick={() => setRescheduleId(null)}>Cancel</button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                {appointments.filter(appt => appt.serviceType === 'vet').length === 0 && <div>No vet appointments found.</div>}
              </div>
            </div>
            <div className="card" style={{ marginBottom: 24 }}>
              <h3>Walker Appointments</h3>
              <div className="grid">
                {appointments
                  .filter(appt => appt.serviceType === 'walker')
                  .filter(appt => {
                    if (appt.status === 'cancelled') return false;
                    const today = new Date();
                    const apptDate = new Date(appt.appointmentDate);
                    if (apptDate > today) return true;
                    if (
                      apptDate.toDateString() === today.toDateString() &&
                      appt.appointmentTime > today.toTimeString().slice(0, 5)
                    ) return true;
                    return false;
                  })
                  .sort((a, b) => {
                    const dateA = new Date(a.appointmentDate + 'T' + a.appointmentTime);
                    const dateB = new Date(b.appointmentDate + 'T' + b.appointmentTime);
                    return dateA - dateB;
                  })
                  .map(appt => (
                    <div key={appt._id} className="card" style={{ minWidth: 260, margin: 8, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <p><strong>Professional:</strong> {appt.provider?.fullName || 'N/A'}{appt.provider?.role ? ` (${appt.provider.role})` : ''}</p>
                      <p><strong>Booked By:</strong> {appt.buyer?.fullName || 'N/A'}</p>
                      <p><strong>Date:</strong> {appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString() : 'N/A'}</p>
                      <p><strong>Time:</strong> {appt.appointmentTime || 'N/A'}</p>
                      <p><strong>Status:</strong> <span style={{ color: appt.status === 'cancelled' ? 'red' : appt.status === 'completed' ? 'green' : appt.status === 'confirmed' ? '#137547' : '#888' }}>{appt.status}</span></p>
                      {((user && (user.role === 'admin' || (appt.buyer && (appt.buyer._id === user._id || appt.buyer._id === user.id)))) && appt.status !== 'cancelled') && (
                        <>
                          <button className="btn" style={{ backgroundColor: '#e17055', marginTop: 8 }} onClick={() => handleCancel(appt._id)}>Cancel</button>
                          <button className="btn btn-secondary" style={{ marginTop: 8 }} onClick={() => setRescheduleId(appt._id)}>Reschedule</button>
                          {rescheduleId === appt._id && (
                            <div style={{ marginTop: 8 }}>
                              <input type="date" value={rescheduleData.date} onChange={e => setRescheduleData({ ...rescheduleData, date: e.target.value })} />
                              <input type="time" value={rescheduleData.time} onChange={e => setRescheduleData({ ...rescheduleData, time: e.target.value })} />
                              <button className="btn btn-success" style={{ marginLeft: 8 }} onClick={() => handleReschedule(appt._id)}>Save</button>
                              <button className="btn btn-secondary" style={{ marginLeft: 8 }} onClick={() => setRescheduleId(null)}>Cancel</button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                {appointments.filter(appt => appt.serviceType === 'walker').length === 0 && <div>No walker appointments found.</div>}
              </div>
            </div>
            <div className="card" style={{ marginBottom: 24 }}>
              <h3>Daycare Appointments</h3>
              <div className="grid">
                {appointments
                  .filter(appt => appt.serviceType === 'daycare')
                  .filter(appt => {
                    if (appt.status === 'cancelled') return false;
                    const today = new Date();
                    const apptDate = new Date(appt.appointmentDate);
                    if (apptDate > today) return true;
                    if (
                      apptDate.toDateString() === today.toDateString() &&
                      appt.appointmentTime > today.toTimeString().slice(0, 5)
                    ) return true;
                    return false;
                  })
                  .sort((a, b) => {
                    const dateA = new Date(a.appointmentDate + 'T' + a.appointmentTime);
                    const dateB = new Date(b.appointmentDate + 'T' + b.appointmentTime);
                    return dateA - dateB;
                  })
                  .map(appt => (
                    <div key={appt._id} className="card" style={{ minWidth: 260, margin: 8, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <p><strong>Professional:</strong> {appt.provider?.fullName || 'N/A'}{appt.provider?.role ? ` (${appt.provider.role})` : ''}</p>
                      <p><strong>Booked By:</strong> {appt.buyer?.fullName || 'N/A'}</p>
                      <p><strong>Date:</strong> {appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString() : 'N/A'}</p>
                      <p><strong>Time:</strong> {appt.appointmentTime || 'N/A'}</p>
                      <p><strong>Status:</strong> <span style={{ color: appt.status === 'cancelled' ? 'red' : appt.status === 'completed' ? 'green' : appt.status === 'confirmed' ? '#137547' : '#888' }}>{appt.status}</span></p>
                      {((user && (user.role === 'admin' || (appt.buyer && (appt.buyer._id === user._id || appt.buyer._id === user.id)))) && appt.status !== 'cancelled') && (
                        <>
                          <button className="btn" style={{ backgroundColor: '#e17055', marginTop: 8 }} onClick={() => handleCancel(appt._id)}>Cancel</button>
                          <button className="btn btn-secondary" style={{ marginTop: 8 }} onClick={() => setRescheduleId(appt._id)}>Reschedule</button>
                          {rescheduleId === appt._id && (
                            <div style={{ marginTop: 8 }}>
                              <input type="date" value={rescheduleData.date} onChange={e => setRescheduleData({ ...rescheduleData, date: e.target.value })} />
                              <input type="time" value={rescheduleData.time} onChange={e => setRescheduleData({ ...rescheduleData, time: e.target.value })} />
                              <button className="btn btn-success" style={{ marginLeft: 8 }} onClick={() => handleReschedule(appt._id)}>Save</button>
                              <button className="btn btn-secondary" style={{ marginLeft: 8 }} onClick={() => setRescheduleId(null)}>Cancel</button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                {appointments.filter(appt => appt.serviceType === 'daycare').length === 0 && <div>No daycare appointments found.</div>}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Appointments 