import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { defaultImages } from '../utils/imageLinks'

const Accessories = () => {
  const [accessories, setAccessories] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedDescriptions, setExpandedDescriptions] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const { user } = useAuth()

  useEffect(() => {
    fetchAccessories()
  }, [])

  const fetchAccessories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || '/api'}/accessories`)
      setAccessories(response.data)
    } catch (error) {
      toast.error('Failed to fetch accessories')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (accessoryId) => {
    if (!user) {
      toast.error('Please login to purchase accessories')
      return
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || '/api'}/orders/accessory`, {
        accessoryId
      }, {
        withCredentials: true
      })
      if (response.status === 201) {
        toast.success('Accessory purchased successfully!')
        fetchAccessories()
      } else {
        toast.error(response.data?.message || 'Purchase failed')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Purchase failed')
    }
  }

  const handleImageError = (e) => {
    e.target.style.display = 'none'
    const placeholder = e.target.parentNode.querySelector('.accessory-image-placeholder')
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

  const startEdit = (accessory) => {
    setEditingId(accessory._id)
    setEditForm({ ...accessory })
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
      await axios.put(`${import.meta.env.VITE_API_BASE_URL || '/api'}/accessories/${editingId}`, {
        name: editForm.name,
        description: editForm.description,
        cost: editForm.cost,
        image: editForm.image,
        animalType: editForm.animalType,
        useCase: editForm.useCase,
        isAvailable: editForm.isAvailable
      }, { withCredentials: true })
      toast.success('Accessory updated!')
      setEditingId(null)
      setEditForm({})
      fetchAccessories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update accessory')
    }
  }

  if (loading) {
    return <div className="loading">Loading accessories...</div>
  }

  return (
    <div className="container" style={{ background: 'linear-gradient(135deg, #e3eef7 0%, #b0cbe5 100%)', borderRadius: 16, padding: 24 }}>
      <h1 className="section-title">Pet Accessories</h1>
      <p className="section-subtitle">Everything your pet needs</p>
      <div className="accessories-grid">
        {accessories.map((accessory) => (
          <div key={accessory._id} className="accessory-card">
            <div className="accessory-image-container">
              <img
                src={accessory.image || defaultImages.accessory}
                alt={accessory.name}
                className="accessory-image"
                onError={handleImageError}
                style={{ display: editingId === accessory._id ? 'none' : 'block' }}
              />
              <div className="accessory-image-placeholder" style={{ display: 'none' }}>
                <div>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🛍️</div>
                  <div>Accessory</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>Image</div>
                </div>
              </div>
              {editingId === accessory._id && (
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
            <div className={editingId === accessory._id ? 'accessory-content editing' : 'accessory-content'}>
              {editingId === accessory._id ? (
                <>
                  <div className="accessory-edit-form-scroll">
                    <div className="accessory-edit-image-preview">
                      <img
                        src={editForm.image || defaultImages.accessory}
                        alt="Preview"
                        onError={e => (e.target.src = defaultImages.accessory)}
                      />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className="form-group"
                      style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: 8 }}
                      placeholder="Accessory Name"
                    />
                    <select
                      name="animalType"
                      value={editForm.animalType}
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
                      <option value="All">All Animals</option>
                    </select>
                    <input
                      type="text"
                      name="useCase"
                      value={editForm.useCase}
                      onChange={handleEditChange}
                      className="form-group"
                      placeholder="How is it useful?"
                    />
                    <input
                      type="number"
                      name="cost"
                      value={editForm.cost}
                      onChange={handleEditChange}
                      className="form-group"
                      placeholder="Cost (₹)"
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
                  <div className="accessory-actions">
                    <button className="btn btn-success" onClick={saveEdit}>Save</button>
                    <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="accessory-title">{accessory.name}</h3>
                  <div className="accessory-details">
                    <p className="accessory-detail">
                      <strong>For:</strong> {accessory.animalType}
                    </p>
                    <p className="accessory-detail">
                      <strong>Use:</strong> {accessory.useCase}
                    </p>
                    <p className="accessory-detail">
                      <strong>Added by:</strong> {accessory.addedBy?.fullName || 'Admin'}
                    </p>
                  </div>
                  <div className="accessory-description-container">
                    <p className={`accessory-description ${expandedDescriptions[accessory._id] ? 'expanded' : ''}`}>
                      {accessory.description}
                    </p>
                    <button
                      onClick={() => toggleDescription(accessory._id)}
                      className="view-details-btn"
                    >
                      {expandedDescriptions[accessory._id] ? 'Show Less' : 'View Details'}
                    </button>
                  </div>
                  <div className="accessory-actions">
                    <span className="price">₹{accessory.cost}</span>
                    <button
                      onClick={() => handlePurchase(accessory._id)}
                      className="btn btn-success"
                    >
                      Buy This Accessory
                    </button>
                    {user?.role === 'admin' && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => startEdit(accessory)}
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
      {accessories.length === 0 && (
        <div className="text-center">
          <p>No accessories available at the moment.</p>
        </div>
      )}
    </div>
  )
}

export default Accessories 