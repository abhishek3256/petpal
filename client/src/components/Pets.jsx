import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { defaultImages } from '../utils/imageLinks'

const Pets = () => {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedDescriptions, setExpandedDescriptions] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [animalFilter, setAnimalFilter] = useState('All')
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, [user])

  useEffect(() => {
    fetchPets()
  }, [])

  const fetchPets = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/pets`)
      setPets(response.data)
    } catch (error) {
      toast.error('Failed to fetch pets')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (petId) => {
    if (!user) {
      toast.error('Please login to purchase pets')
      return
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/orders/pet`, {
        petId
      }, {
        withCredentials: true
      })
      toast.success('Pet purchased successfully!')
      fetchPets()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Purchase failed')
    }
  }

  const handleImageError = (e) => {
    e.target.style.display = 'none'
    const placeholder = e.target.parentNode.querySelector('.pet-image-placeholder')
    if (placeholder) {
      placeholder.style.display = 'flex'
    }
  }

  const toggleDescription = (id) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const startEdit = (pet) => {
    setEditingId(pet._id)
    setEditForm({ ...pet })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    })
  }

  const saveEdit = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/pets/${editingId}`, {
        name: editForm.name,
        type: editForm.type,
        breed: editForm.breed,
        age: editForm.age,
        price: editForm.price,
        description: editForm.description,
        image: editForm.image
      }, { withCredentials: true })
      toast.success('Pet updated!')
      setEditingId(null)
      setEditForm({})
      fetchPets()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update pet')
    }
  }

  if (loading) {
    return <div className="loading">Loading pets...</div>
  }

  return (
    <div className="container" style={{ background: 'linear-gradient(135deg, #c2e9fb 0%, #fdf6e3 100%)', borderRadius: 16, padding: 24 }}>
      <h1 className="section-title">Available Pets</h1>
      <p className="section-subtitle">Find your perfect companion</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {['All', 'Dog', 'Cat', 'Lion', 'Tiger', 'Otter', 'Capybara', 'Beaver'].map(type => (
          <button
            key={type}
            className={`btn btn-secondary${animalFilter === type ? ' active' : ''}`}
            style={{ padding: '8px 18px', fontWeight: 500, borderRadius: 8, background: animalFilter === type ? '#a18cd1' : undefined, color: animalFilter === type ? '#fff' : undefined }}
            onClick={() => setAnimalFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="pets-grid">
        {pets
          .filter(pet => animalFilter === 'All' ? true : pet.type === animalFilter)
          .map((pet) => (
          <div key={pet._id} className="pet-card">
            <div className="pet-image-container">
              <img
                src={pet.image || defaultImages.pet}
                alt={pet.name}
                className="pet-image"
                onError={handleImageError}
                style={{ display: editingId === pet._id ? 'none' : 'block' }}
              />
              <div className="pet-image-placeholder" style={{ display: 'none' }}>
                <div>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🐾</div>
                  <div>Pet Image</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>Vertical Rectangle</div>
                </div>
              </div>
              {editingId === pet._id && (
                <input
                  type="url"
                  name="image"
                  value={editForm.image}
                  onChange={handleEditChange}
                  className="form-group"
                  style={{ width: '100%', marginTop: 8 }}
                  placeholder="Image URL"
                />
              )}
            </div>
            <div
              className={editingId === pet._id ? 'pet-content editing' : 'pet-content'}
              style={editingId === pet._id ? { position: 'relative' } : {}}
            >
              {editingId === pet._id ? (
                <>
                  <div className="pet-edit-form-scroll">
                    <div className="pet-edit-image-preview">
                      <img
                        src={editForm.image || defaultImages.pet}
                        alt="Preview"
                        onError={e => (e.target.src = defaultImages.pet)}
                      />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className="form-group"
                      style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: 8 }}
                      placeholder="Pet Name"
                    />
                    <select
                      name="type"
                      value={editForm.type}
                      onChange={handleEditChange}
                      className="form-group"
                      style={{ marginBottom: 8 }}
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
                    <input
                      type="text"
                      name="breed"
                      value={editForm.breed}
                      onChange={handleEditChange}
                      className="form-group"
                      placeholder="Breed"
                    />
                    <input
                      type="number"
                      name="age"
                      value={editForm.age}
                      onChange={handleEditChange}
                      className="form-group"
                      placeholder="Age (years)"
                    />
                    <input
                      type="number"
                      name="price"
                      value={editForm.price}
                      onChange={handleEditChange}
                      className="form-group"
                      placeholder="Price (₹)"
                    />
                    <input
                      type="url"
                      name="image"
                      value={editForm.image}
                      onChange={handleEditChange}
                      className="form-group"
                      placeholder="Image URL"
                    />
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      className="form-group"
                      rows={3}
                      placeholder="Description"
                    />
                  </div>
                  <div className="pet-actions">
                    <button className="btn btn-success" onClick={saveEdit}>Save</button>
                    <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
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
                      <strong>Location:</strong> {pet.seller?.location || 'N/A'}
                    </p>
                    <p className="pet-detail">
                      <strong>Seller:</strong> {pet.seller?.fullName || 'N/A'}
                    </p>
                  </div>
                  <div style={{ marginBottom: 8, color: '#137547', fontWeight: 600 }}>
                    Stock: {pet.stock ?? 1}
                  </div>
                  <div className="pet-description-container">
                    <p className={`pet-description ${expandedDescriptions[pet._id] ? 'expanded' : ''}`}>
                      {pet.description}
                    </p>
                    <button
                      onClick={() => toggleDescription(pet._id)}
                      className="view-details-btn"
                    >
                      {expandedDescriptions[pet._id] ? 'Show Less' : 'View Details'}
                    </button>
                  </div>
                  <div className="pet-actions">
                    <span className="price">₹{pet.price}</span>
                    <button
                      onClick={() => handlePurchase(pet._id)}
                      className="btn btn-success"
                    >
                      Buy This Pet
                    </button>
                    {user?.role === 'admin' && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => startEdit(pet)}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {pets.length === 0 && (
        <div className="text-center">
          <p>No pets available at the moment.</p>
        </div>
      )}
    </div>
  )
}

export default Pets 