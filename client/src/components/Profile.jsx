import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { defaultImages } from '../utils/imageLinks'

const Profile = () => {
  const { user, checkAuth } = useAuth()
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)
  const [appointments, setAppointments] = useState([])
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  useEffect(() => {
    if (user) setForm({ ...user })
    if (user && ['vet', 'walker', 'daycare'].includes(user.role)) fetchAppointments()
    if (user) fetchOrders()
    // eslint-disable-next-line
  }, [user])

  const fetchAppointments = async () => {
    try {
      let type = user.role
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders/appointments?type=${type}&mine=true`, { withCredentials: true })
      setAppointments(res.data)
    } catch {}
  }

  const fetchOrders = async () => {
    setOrdersLoading(true)
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders/my-orders`, { withCredentials: true })
      setOrders(res.data)
    } catch (error) {
      toast.error('Failed to fetch your orders')
    } finally {
      setOrdersLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // If editing own profile, use /auth/me
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, form, { withCredentials: true })
      toast.success('Profile updated!')
      setEditMode(false)
      checkAuth()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const getOrderItemDetails = (order) => {
    if (!order.item) return { name: 'N/A', image: '', extra: '' };
    if (order.type === 'pet') {
      return { name: order.item.name, image: order.item.image, extra: order.item.breed ? `Breed: ${order.item.breed}` : '' };
    }
    if (order.type === 'accessory') {
      return { name: order.item.name, image: order.item.image, extra: order.item.animalType ? `For: ${order.item.animalType}` : '' };
    }
    // For services (vet, walker, daycare)
    return { name: order.item.fullName, image: order.item.image, extra: order.type.charAt(0).toUpperCase() + order.type.slice(1) };
  };

  if (!user) return <div className="container"><div className="card text-center">Please login to view your profile.</div></div>

  return (
    <div className="container" style={{ maxWidth: 600, margin: '40px auto', background: 'linear-gradient(135deg, #ffe3cf 0%, #bfc3d9 100%)', borderRadius: 16 }}>
      <div className="card" style={{ padding: 32, position: 'relative', background: 'linear-gradient(120deg, #fff 80%, #f3e8ff 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
          <img
            src={form.image || defaultImages.user}
            alt="Profile"
            style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid #eee' }}
          />
          <div>
            <h2 style={{ margin: 0 }}>{form.fullName}</h2>
            <div style={{ color: '#888', fontSize: 15 }}>{form.email}</div>
          </div>
        </div>
        <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }} onSubmit={e => e.preventDefault()}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={form.fullName || ''} onChange={handleChange} disabled={!editMode} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email || ''} onChange={handleChange} disabled={!editMode} />
          </div>
          <div className="form-group">
            <label>Role</label>
            <input type="text" value={form.role} disabled />
          </div>
          <div className="form-group">
            <label>Age</label>
            <input type="number" name="age" value={form.age || ''} onChange={handleChange} disabled={!editMode} />
          </div>
          <div className="form-group">
            <label>Sex</label>
            <select name="sex" value={form.sex || ''} onChange={handleChange} disabled={!editMode}>
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input type="text" name="location" value={form.location || ''} onChange={handleChange} disabled={!editMode} />
          </div>
          {(form.role === 'buyer' || form.role === 'seller') && (
            <div className="form-group">
              <label>Contact Number</label>
              <input type="text" name="contactNumber" value={form.contactNumber || ''} onChange={handleChange} disabled={!editMode} />
            </div>
          )}
          {form.role !== 'buyer' && (
            <div className="form-group">
              <label>Hourly Rate (₹)</label>
              <input type="number" name="hourlyRate" value={form.hourlyRate || ''} onChange={handleChange} disabled={!editMode} />
            </div>
          )}
          <div className="form-group">
            <label>Image URL</label>
            <input type="url" name="image" value={form.image || ''} onChange={handleChange} disabled={!editMode} />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            {!editMode ? (
              <button className="btn btn-secondary" type="button" onClick={() => setEditMode(true)}>
                Edit
              </button>
            ) : (
              <>
                <button className="btn btn-success" type="button" onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button className="btn btn-secondary" type="button" onClick={() => { setEditMode(false); setForm({ ...user }) }}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
      {['vet', 'walker', 'daycare'].includes(user.role) && appointments.length > 0 && (
        <div className="card" style={{ marginTop: 40, maxHeight: 400, overflowY: 'auto' }}>
          <h3 style={{ margin: '16px 0' }}>My Appointments</h3>
          <div className="grid">
            {appointments.map(appt => (
              <div key={appt._id} className="card" style={{ minWidth: 220, margin: 8 }}>
                <p><strong>Name:</strong> {appt.buyer?.fullName || 'N/A'}</p>
                <p><strong>Email:</strong> {appt.buyer?.email || 'N/A'}</p>
                <p><strong>Contact:</strong> {appt.buyer?.contactNumber || 'N/A'}</p>
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

export default Profile 