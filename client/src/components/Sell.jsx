import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { defaultImages } from '../utils/imageLinks'

const Sell = () => {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    price: '',
    description: '',
    image: ''
  })
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role === 'seller') {
      fetchMyPets()
    }
  }, [user])

  const fetchMyPets = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/pets/my-pets`, {
        withCredentials: true
      })
      setPets(response.data)
    } catch (error) {
      toast.error('Failed to fetch your pets')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/pets`, {
        ...formData,
        age: parseInt(formData.age),
        price: parseFloat(formData.price)
      }, {
        withCredentials: true
      })
      
      toast.success('Pet listed successfully!')
      setShowForm(false)
      setFormData({
        name: '',
        type: '',
        breed: '',
        age: '',
        price: '',
        description: '',
        image: ''
      })
      fetchMyPets()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to list pet')
    }
  }

  const handleDelete = async (petId) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/pets/${petId}`, {
          withCredentials: true
        })
        toast.success('Pet deleted successfully!')
        fetchMyPets()
      } catch (error) {
        toast.error('Failed to delete pet')
      }
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (!user || user.role !== 'seller') {
    return (
      <div className="container">
        <div className="card text-center">
          <h2>Access Denied</h2>
          <p>Only sellers can access this page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="loading">Loading your pets...</div>
  }

  return (
    <div className="container" style={{ background: 'linear-gradient(135deg, #c2e9fb 0%, #fdf6e3 100%)', borderRadius: 16, padding: 24 }}>
      <h1 className="section-title">Sell Your Pets</h1>
      <p className="section-subtitle">List your pets for adoption</p>
      {showForm && (
        <div className="card" style={{ maxWidth: '600px', margin: '30px auto' }}>
          <h3>Add New Pet</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Pet Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="type">Animal Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
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
              <label htmlFor="breed">Breed</label>
              <input
                type="text"
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="age">Age (years)</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
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
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="image">Image URL</label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>
            
            <div className="flex" style={{ gap: '10px' }}>
              <button type="submit" className="btn btn-success">
                List Pet
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="text-center" style={{ marginBottom: '30px' }}>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-success"
        >
          Add New Pet
        </button>
      </div>
      <div className="sell-pets-grid">
        {pets.map((pet) => (
          <div key={pet._id} className="card sell-pet-card" style={{ display: 'flex', minHeight: 180, padding: 0, overflow: 'hidden' }}>
            <div className="sell-pet-image-container" style={{ flex: '1 1 50%', height: '100%' }}>
              <img
                src={pet.image || defaultImages.pet}
                alt={pet.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div style={{ flex: '1 1 50%', padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ margin: '0 0 8px 0' }}>{pet.name}</h3>
              <p style={{ margin: 0 }}><strong>Type:</strong> {pet.type}</p>
              <p style={{ margin: 0 }}><strong>Breed:</strong> {pet.breed}</p>
              <p style={{ margin: 0 }}><strong>Age:</strong> {pet.age} years</p>
              <p style={{ margin: 0 }}><strong>Price:</strong> ₹{pet.price}</p>
              <p style={{ margin: 0 }}><strong>Status:</strong> {pet.isAvailable ? 'Available' : 'Sold'}</p>
              <div style={{ marginTop: 10 }}>
                <button
                  onClick={() => handleDelete(pet._id)}
                  className="btn"
                  style={{ backgroundColor: '#e17055' }}
                >
                  Delete
                </button>
              </div>
              <p style={{ marginTop: 8, fontSize: '14px', color: '#666' }}>{pet.description}</p>
            </div>
          </div>
        ))}
      </div>
      {pets.length === 0 && (
        <div className="text-center">
          <p>You haven't listed any pets yet.</p>
        </div>
      )}
    </div>
  )
}

export default Sell 