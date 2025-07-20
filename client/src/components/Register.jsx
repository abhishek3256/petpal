import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    age: '',
    sex: '',
    location: '',
    role: 'buyer',
    hourlyRate: '',
    image: '',
    contactNumber: ''
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userData = {
        ...formData,
        age: parseInt(formData.age),
        hourlyRate: formData.role !== 'buyer' ? parseFloat(formData.hourlyRate) : 0
      }

      const result = await register(userData)
      if (result.success) {
        toast.success('Registration successful!')
        navigate('/')
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const showContact = formData.role === 'buyer' || formData.role === 'seller'

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #ffd6c0 0%, #f7c6a3 40%, #d6f5e7 100%)' }}>
      <div className="card" style={{ maxWidth: '500px', margin: '50px auto', background: 'linear-gradient(120deg, #fff 80%, #f3e8ff 100%)' }}>
        <h2 className="text-center" style={{ marginBottom: '30px' }}>
          Register for PetPal
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="18"
              max="100"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="sex">Sex</label>
            <select
              id="sex"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              required
            >
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="walker">Pet Walker</option>
              <option value="daycare">Pet Daycare</option>
              <option value="vet">Veterinarian</option>
            </select>
          </div>
          
          {formData.role !== 'buyer' && (
            <div className="form-group">
              <label htmlFor="hourlyRate">Hourly Rate (₹)</label>
              <input
                type="number"
                id="hourlyRate"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
          )}

          {showContact && (
            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number</label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter your contact number"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <button
            type="submit"
            className="btn"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <p className="text-center" style={{ marginTop: '20px' }}>
          Already have an account?{' '}
          <Link to="/login" className="text-primary">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register 