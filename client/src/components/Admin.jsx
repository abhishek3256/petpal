import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { defaultImages } from '../utils/imageLinks'

const Admin = () => {
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [pets, setPets] = useState([])
  const [accessories, setAccessories] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users')
  const [userRoleFilter, setUserRoleFilter] = useState('all')
  const [showAddPetForm, setShowAddPetForm] = useState(false)
  const [showAddAccessoryForm, setShowAddAccessoryForm] = useState(false)
  const [petFormData, setPetFormData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    price: '',
    description: '',
    image: ''
  })
  const [accessoryFormData, setAccessoryFormData] = useState({
    name: '',
    description: '',
    cost: '',
    image: '',
    animalType: '',
    useCase: ''
  })
  const [editingUserId, setEditingUserId] = useState(null)
  const [userEditForm, setUserEditForm] = useState({})
  const [vetAppointments, setVetAppointments] = useState([])
  const [walkerAppointments, setWalkerAppointments] = useState([])
  const [daycareAppointments, setDaycareAppointments] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData()
      fetchVetAppointments()
      fetchWalkerAppointments()
      fetchDaycareAppointments()
    }
  }, [user])

  const fetchData = async () => {
    try {
      const [usersResponse, ordersResponse, petsResponse, accessoriesResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/users`, {
          withCredentials: true
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders/all`, {
          withCredentials: true
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/pets`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/accessories`)
      ])
      
      setUsers(usersResponse.data)
      setOrders(ordersResponse.data)
      setPets(petsResponse.data)
      setAccessories(accessoriesResponse.data)
    } catch (error) {
      toast.error('Failed to fetch admin data')
    } finally {
      setLoading(false)
    }
  }

  const fetchVetAppointments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders/appointments?type=vet`, { withCredentials: true })
      setVetAppointments(res.data)
    } catch {}
  }
  const fetchWalkerAppointments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders/appointments?type=walker`, { withCredentials: true })
      setWalkerAppointments(res.data)
    } catch {}
  }
  const fetchDaycareAppointments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders/appointments?type=daycare`, { withCredentials: true })
      setDaycareAppointments(res.data)
    } catch {}
  }

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}/status`, {
        status
      }, {
        withCredentials: true
      })
      
      toast.success('Order status updated successfully!')
      fetchData()
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const handleUserToggle = async (userId, isActive) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/auth/users/${userId}`, {
        isActive: !isActive
      }, {
        withCredentials: true
      })
      
      toast.success('User status updated successfully!')
      fetchData()
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  const handleAddPet = async (e) => {
    e.preventDefault()
    
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/pets/admin`, {
        ...petFormData,
        age: parseInt(petFormData.age),
        price: parseFloat(petFormData.price)
      }, {
        withCredentials: true
      })
      
      toast.success('Pet added successfully!')
      setShowAddPetForm(false)
      setPetFormData({
        name: '',
        type: '',
        breed: '',
        age: '',
        price: '',
        description: '',
        image: ''
      })
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add pet')
    }
  }

  const handleAddAccessory = async (e) => {
    e.preventDefault()
    
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/accessories`, {
        ...accessoryFormData,
        cost: parseFloat(accessoryFormData.cost)
      }, {
        withCredentials: true
      })
      
      toast.success('Accessory added successfully!')
      setShowAddAccessoryForm(false)
      setAccessoryFormData({
        name: '',
        description: '',
        cost: '',
        image: '',
        animalType: '',
        useCase: ''
      })
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add accessory')
    }
  }

  const handlePetChange = (e) => {
    setPetFormData({
      ...petFormData,
      [e.target.name]: e.target.value
    })
  }

  const handleAccessoryChange = (e) => {
    setAccessoryFormData({
      ...accessoryFormData,
      [e.target.name]: e.target.value
    })
  }

  const handleDeletePet = async (petId) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/pets/${petId}`, {
          withCredentials: true
        })
        toast.success('Pet deleted successfully!')
        fetchData()
      } catch (error) {
        toast.error('Failed to delete pet')
      }
    }
  }

  const handleDeleteAccessory = async (accessoryId) => {
    if (window.confirm('Are you sure you want to delete this accessory?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/accessories/${accessoryId}`, {
          withCredentials: true
        })
        toast.success('Accessory deleted successfully!')
        fetchData()
      } catch (error) {
        toast.error('Failed to delete accessory')
      }
    }
  }

  const handlePurchase = async (petId) => {
    if (!user) {
      toast.error('Please login to purchase pets')
      return
    }
    if (user.role !== 'buyer') {
      toast.error('You are not a buyer. Register yourself as a buyer to purchase.')
      return
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/orders/pet`, {
        petId
      }, {
        withCredentials: true
      })
      toast.success('Pet purchased successfully!')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Purchase failed')
    }
  }

  const handleImageError = (e) => {
    e.target.style.display = 'none'
    const placeholder = e.target.parentNode.querySelector('.pet-image-placeholder, .accessory-image-placeholder')
    if (placeholder) {
      placeholder.style.display = 'flex'
    }
  }

  const startUserEdit = (user) => {
    setEditingUserId(user._id)
    setUserEditForm({ ...user })
  }

  const cancelUserEdit = () => {
    setEditingUserId(null)
    setUserEditForm({})
  }

  const handleUserEditChange = (e) => {
    setUserEditForm({
      ...userEditForm,
      [e.target.name]: e.target.value
    })
  }

  const saveUserEdit = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/auth/users/${editingUserId}`, userEditForm, { withCredentials: true })
      toast.success('User updated successfully!')
      setEditingUserId(null)
      setUserEditForm({})
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user')
    }
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="container">
        <div className="card text-center">
          <h2>Access Denied</h2>
          <p>Only administrators can access this page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="loading">Loading admin data...</div>
  }

  return (
    <div className="container" style={{ background: 'linear-gradient(135deg, #d8b4d8 0%, #7ee8c4 100%)', borderRadius: 16, padding: 24 }}>
      <h1 className="section-title">Admin Panel</h1>
      <p className="section-subtitle">Manage users, orders, pets, and accessories</p>
      
      <div className="admin-tabs">
        <button
          onClick={() => setActiveTab('users')}
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('pets')}
          className={`admin-tab ${activeTab === 'pets' ? 'active' : ''}`}
        >
          Pets
        </button>
        <button
          onClick={() => setActiveTab('accessories')}
          className={`admin-tab ${activeTab === 'accessories' ? 'active' : ''}`}
        >
          Accessories
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`admin-tab ${activeTab === 'appointments' ? 'active' : ''}`}
        >
          Appointments
        </button>
      </div>

      {activeTab === 'appointments' && (
        <div className="gradient-aqua-pink" style={{ borderRadius: 16, padding: 24 }}>
          <h2>All Appointments</h2>
          <div className="admin-appointments-catalogues">
            <div className="card" style={{ maxWidth: 900, margin: '40px auto', maxHeight: 350, overflowY: 'auto' }}>
              <h3>Vet Appointments</h3>
              <div className="grid">
                {vetAppointments.map((appt) => (
                  <div key={appt._id} className="card" style={{ minWidth: 220, margin: 8 }}>
                    <p><strong>Vet:</strong> {appt.vet?.fullName || 'N/A'}</p>
                    <p><strong>User:</strong> {appt.buyer?.fullName || 'N/A'}</p>
                    <p><strong>Date:</strong> {new Date(appt.appointmentDate).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {appt.appointmentTime}</p>
                    <p><strong>Status:</strong> {appt.status}</p>
                    <p><strong>Contact:</strong> {appt.buyer?.contactNumber || 'N/A'}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{ maxWidth: 900, margin: '40px auto', maxHeight: 350, overflowY: 'auto' }}>
              <h3>Walker Appointments</h3>
              <div className="grid">
                {walkerAppointments.map((appt) => (
                  <div key={appt._id} className="card" style={{ minWidth: 220, margin: 8 }}>
                    <p><strong>Walker:</strong> {appt.walker?.fullName || 'N/A'}</p>
                    <p><strong>User:</strong> {appt.buyer?.fullName || 'N/A'}</p>
                    <p><strong>Date:</strong> {new Date(appt.appointmentDate).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {appt.appointmentTime}</p>
                    <p><strong>Status:</strong> {appt.status}</p>
                    <p><strong>Contact:</strong> {appt.buyer?.contactNumber || 'N/A'}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{ maxWidth: 900, margin: '40px auto', maxHeight: 350, overflowY: 'auto' }}>
              <h3>Daycare Appointments</h3>
              <div className="grid">
                {daycareAppointments.map((appt) => (
                  <div key={appt._id} className="card" style={{ minWidth: 220, margin: 8 }}>
                    <p><strong>Daycare:</strong> {appt.daycare?.fullName || 'N/A'}</p>
                    <p><strong>User:</strong> {appt.buyer?.fullName || 'N/A'}</p>
                    <p><strong>Date:</strong> {new Date(appt.appointmentDate).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {appt.appointmentTime}</p>
                    <p><strong>Status:</strong> {appt.status}</p>
                    <p><strong>Contact:</strong> {appt.buyer?.contactNumber || 'N/A'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h2>User Management</h2>
          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            <button className={`btn btn-secondary${userRoleFilter === 'all' ? ' active' : ''}`} onClick={() => setUserRoleFilter('all')}>All</button>
            <button className={`btn btn-secondary${userRoleFilter === 'buyer' ? ' active' : ''}`} onClick={() => setUserRoleFilter('buyer')}>Buyer</button>
            <button className={`btn btn-secondary${userRoleFilter === 'seller' ? ' active' : ''}`} onClick={() => setUserRoleFilter('seller')}>Seller</button>
            <button className={`btn btn-secondary${userRoleFilter === 'vet' ? ' active' : ''}`} onClick={() => setUserRoleFilter('vet')}>Vet</button>
            <button className={`btn btn-secondary${userRoleFilter === 'walker' ? ' active' : ''}`} onClick={() => setUserRoleFilter('walker')}>Walker</button>
            <button className={`btn btn-secondary${userRoleFilter === 'daycare' ? ' active' : ''}`} onClick={() => setUserRoleFilter('daycare')}>Daycare</button>
          </div>
          <div className="grid">
            {users.filter(u => userRoleFilter === 'all' ? true : u.role === userRoleFilter).map((user) => (
              <div key={user._id} className="card">
                {editingUserId === user._id ? (
                  <div className="edit-form-container" style={{ maxHeight: 320, overflowY: 'auto', marginBottom: 10 }}>
                    <h3>Edit User</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                      <img
                        src={userEditForm.image || defaultImages.user}
                        alt="Preview"
                        style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid #eee' }}
                        onError={handleImageError}
                      />
                      <input
                        type="url"
                        name="image"
                        value={userEditForm.image}
                        onChange={handleUserEditChange}
                        placeholder="Image URL"
                        style={{ flex: 1 }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" name="fullName" value={userEditForm.fullName} onChange={handleUserEditChange} required />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" name="email" value={userEditForm.email} onChange={handleUserEditChange} required />
                    </div>
                    <div className="form-group">
                      <label>Role</label>
                      <select name="role" value={userEditForm.role} onChange={handleUserEditChange} required>
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                        <option value="walker">Pet Walker</option>
                        <option value="daycare">Pet Daycare</option>
                        <option value="vet">Veterinarian</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Age</label>
                      <input type="number" name="age" value={userEditForm.age} onChange={handleUserEditChange} min="18" max="100" required />
                    </div>
                    <div className="form-group">
                      <label>Sex</label>
                      <select name="sex" value={userEditForm.sex} onChange={handleUserEditChange} required>
                        <option value="">Select Sex</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input type="text" name="location" value={userEditForm.location} onChange={handleUserEditChange} required />
                    </div>
                    {(userEditForm.role === 'seller' || userEditForm.role === 'buyer') && (
                      <div className="form-group">
                        <label>Contact Number</label>
                        <input type="text" name="contactNumber" value={userEditForm.contactNumber || ''} onChange={handleUserEditChange} />
                      </div>
                    )}
                    {userEditForm.role !== 'buyer' && (
                      <div className="form-group">
                        <label>Hourly Rate (₹)</label>
                        <input type="number" name="hourlyRate" value={userEditForm.hourlyRate} onChange={handleUserEditChange} min="0" step="0.01" />
                      </div>
                    )}
                    <div className="flex" style={{ gap: 10, marginTop: 10 }}>
                      <button className="btn btn-success" onClick={saveUserEdit} type="button">Save</button>
                      <button className="btn btn-secondary" onClick={cancelUserEdit} type="button">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3>{user.fullName}</h3>
                    <img
                      src={user.image || defaultImages.user}
                      alt={user.fullName}
                      style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid #eee', marginBottom: 8 }}
                      onError={handleImageError}
                    />
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <p><strong>Age:</strong> {user.age} years</p>
                    <p><strong>Sex:</strong> {user.sex}</p>
                    <p><strong>Location:</strong> {user.location}</p>
                    {(user.role === 'seller' || user.role === 'buyer') && (
                      <p><strong>Contact:</strong> {user.contactNumber || 'N/A'}</p>
                    )}
                    {user.role !== 'buyer' && (
                      <p><strong>Hourly Rate:</strong> ₹{user.hourlyRate}</p>
                    )}
                    <p><strong>Status:</strong> {user.isActive ? 'Active' : 'Inactive'}</p>
                    <div style={{ marginTop: '15px' }}>
                      <button
                        onClick={() => handleUserToggle(user._id, user.isActive)}
                        className={`btn ${user.isActive ? '' : 'btn-success'}`}
                        style={user.isActive ? { backgroundColor: '#e17055' } : {}}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ marginLeft: 8 }}
                        onClick={() => startUserEdit(user)}
                      >
                        Edit
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="gradient-aqua-pink" style={{ borderRadius: 16, padding: 24 }}>
          <h2>Order Management</h2>
          <div className="grid">
            {orders.map((order) => (
              <div key={order._id} className="card">
                <h3>Order #{order._id.slice(-6)}</h3>
                <p><strong>Type:</strong> {order.type}</p>
                <p><strong>Buyer:</strong> {order.buyer?.fullName || 'N/A'}</p>
                <p><strong>Seller:</strong> {order.seller?.fullName || 'N/A'}</p>
                <p><strong>Amount:</strong> ₹{order.amount}</p>
                <p><strong>Status:</strong> {order.status}</p>
                {order.appointmentDate && (
                  <p><strong>Date:</strong> {new Date(order.appointmentDate).toLocaleDateString()}</p>
                )}
                {order.appointmentTime && (
                  <p><strong>Time:</strong> {order.appointmentTime}</p>
                )}
                
                <div style={{ marginTop: '15px' }}>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className="form-group"
                    style={{ marginBottom: '10px' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'pets' && (
        <div>
          <h2>Pet Management</h2>
          <div className="text-center" style={{ marginBottom: '30px' }}>
            <button
              onClick={() => setShowAddPetForm(true)}
              className="btn btn-success"
            >
              Add New Pet
            </button>
          </div>
          {showAddPetForm && (
            <div className="card" style={{ maxWidth: '600px', margin: '30px auto' }}>
              <h3>Add New Pet</h3>
              <form onSubmit={handleAddPet}>
                <div className="form-group">
                  <label htmlFor="name">Pet Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={petFormData.name}
                    onChange={handlePetChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="type">Animal Type</label>
                  <select
                    id="type"
                    name="type"
                    value={petFormData.type}
                    onChange={handlePetChange}
                    required
                  >
                    <option value="">Select Animal Type</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Beaver">Beaver</option>
                    <option value="Capybara">Capybara</option>
                    <option value="Lion">Lion</option>
                    <option value="Tiger">Tiger</option>
                    <option value="Otter">Otter</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="breed">Breed Name</label>
                  <input
                    type="text"
                    id="breed"
                    name="breed"
                    value={petFormData.breed}
                    onChange={handlePetChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="age">Age (years)</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={petFormData.age}
                    onChange={handlePetChange}
                    min="0"
                    max="20"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="price">Price (₹)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={petFormData.price}
                    onChange={handlePetChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="image">Image URL (Google Images)</label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={petFormData.image}
                    onChange={handlePetChange}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={petFormData.description}
                    placeholder="Enter detailed description about the pet..."
                    onChange={handlePetChange}
                    rows="4"
                    required
                  />
                </div>
                
                <div className="flex" style={{ gap: '10px' }}>
                  <button type="submit" className="btn btn-success">
                    Add Pet
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddPetForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          <div className="pets-grid">
            {pets.map((pet) => (
              <div key={pet._id} className="pet-card">
                <div className="pet-image-container">
                  <img
                    src={pet.image || defaultImages.pet}
                    alt={pet.name}
                    className="pet-image"
                    onError={handleImageError}
                  />
                  <div className="pet-image-placeholder" style={{ display: 'none' }}>
                    <div>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>🐾</div>
                      <div>Pet Image</div>
                      <div style={{ fontSize: '12px', marginTop: '4px' }}>Vertical Rectangle</div>
                    </div>
                  </div>
                </div>
                
                <div className="pet-content">
                  <h3 className="pet-title">{pet.name}</h3>
                  
                  <div className="pet-details">
                    <p className="pet-detail">
                      <strong>Type:</strong> {pet.type}
                    </p>
                    <p className="pet-detail">
                      <strong>Breed:</strong> {pet.breed}
                    </p>
                    <p className="pet-detail">
                      <strong>Age:</strong> {pet.age} years
                    </p>
                    <p className="pet-detail">
                      <strong>Price:</strong> ₹{pet.price}
                    </p>
                    <p className="pet-detail">
                      <strong>Status:</strong> {pet.isAvailable ? 'Available' : 'Sold'}
                    </p>
                  </div>
                  
                  <p className="pet-description">
                    {pet.description}
                  </p>
                  
                  <div className="pet-actions">
                    <button
                      onClick={() => handlePurchase(pet._id)}
                      className="btn btn-success"
                    >
                      Buy This Pet
                    </button>
                    <button
                      onClick={() => handleDeletePet(pet._id)}
                      className="btn"
                      style={{ backgroundColor: '#e17055' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'accessories' && (
        <div>
          <h2>Accessory Management</h2>
          <div className="text-center" style={{ marginBottom: '30px' }}>
            <button
              onClick={() => setShowAddAccessoryForm(true)}
              className="btn btn-success"
            >
              Add New Accessory
            </button>
          </div>

          {showAddAccessoryForm && (
            <div className="card" style={{ maxWidth: '600px', margin: '30px auto' }}>
              <h3>Add New Accessory</h3>
              <form onSubmit={handleAddAccessory}>
                <div className="form-group">
                  <label htmlFor="accessory-name">Accessory Name</label>
                  <input
                    type="text"
                    id="accessory-name"
                    name="name"
                    value={accessoryFormData.name}
                    onChange={handleAccessoryChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="animalType">For Animal Type</label>
                  <select
                    id="animalType"
                    name="animalType"
                    value={accessoryFormData.animalType}
                    onChange={handleAccessoryChange}
                    required
                  >
                    <option value="">Select Animal Type</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Beaver">Beaver</option>
                    <option value="Capybara">Capybara</option>
                    <option value="Lion">Lion</option>
                    <option value="Tiger">Tiger</option>
                    <option value="Otter">Otter</option>
                    <option value="All">All Animals</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="useCase">How is it useful?</label>
                  <input
                    type="text"
                    id="useCase"
                    name="useCase"
                    value={accessoryFormData.useCase}
                    onChange={handleAccessoryChange}
                    placeholder="e.g., For feeding, grooming, playing, etc."
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cost">Cost (₹)</label>
                  <input
                    type="number"
                    id="cost"
                    name="cost"
                    value={accessoryFormData.cost}
                    onChange={handleAccessoryChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="accessory-image">Image URL</label>
                  <input
                    type="url"
                    id="accessory-image"
                    name="image"
                    value={accessoryFormData.image}
                    onChange={handleAccessoryChange}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="accessory-description">Description</label>
                  <textarea
                    id="accessory-description"
                    name="description"
                    value={accessoryFormData.description}
                    placeholder="Enter detailed description about the accessory..."
                    onChange={handleAccessoryChange}
                    rows="4"
                    required
                  />
                </div>
                <div className="flex" style={{ gap: '10px' }}>
                  <button type="submit" className="btn btn-success">
                    Add Accessory
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddAccessoryForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          <div className="accessories-grid">
            {accessories.map((accessory) => (
              <div key={accessory._id} className="accessory-card">
                <div className="accessory-image-container">
                  <img
                    src={accessory.image || defaultImages.accessory}
                    alt={accessory.name}
                    className="accessory-image"
                    onError={handleImageError}
                  />
                  <div className="accessory-image-placeholder" style={{ display: 'none' }}>
                    <div>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>🛍️</div>
                      <div>Accessory</div>
                      <div style={{ fontSize: '12px', marginTop: '4px' }}>Image</div>
                    </div>
                  </div>
                </div>
                
                <div className="accessory-content">
                  <h3 className="accessory-title">{accessory.name}</h3>
                  
                  <div className="accessory-details">
                    <p className="accessory-detail">
                      <strong>For:</strong> {accessory.animalType}
                    </p>
                    <p className="accessory-detail">
                      <strong>Use:</strong> {accessory.useCase}
                    </p>
                    <p className="accessory-detail">
                      <strong>Cost:</strong> ₹{accessory.cost}
                    </p>
                    <p className="accessory-detail">
                      <strong>Status:</strong> {accessory.isAvailable ? 'Available' : 'Sold'}
                    </p>
                  </div>
                  
                  <div className="accessory-description-container">
                    <p className="accessory-description">
                      {accessory.description}
                    </p>
                  </div>
                  
                  <div className="accessory-actions">
                    <button
                      onClick={() => handleDeleteAccessory(accessory._id)}
                      className="btn"
                      style={{ backgroundColor: '#e17055' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && users.length === 0 && (
        <div className="text-center">
          <p>No users found.</p>
        </div>
      )}

      {activeTab === 'orders' && orders.length === 0 && (
        <div className="text-center">
          <p>No orders found.</p>
        </div>
      )}

      {activeTab === 'pets' && pets.length === 0 && (
        <div className="text-center">
          <p>No pets found.</p>
        </div>
      )}

      {activeTab === 'accessories' && accessories.length === 0 && (
        <div className="text-center">
          <p>No accessories found.</p>
        </div>
      )}
    </div>
  )
}

export default Admin 