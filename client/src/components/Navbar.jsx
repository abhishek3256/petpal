import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { socialLinks, handleSocialClick } from '../utils/socialLinks'
import { useState, useEffect, useRef } from 'react'
import { defaultImages } from '../utils/imageLinks'

const dropdownBtnStyle = {
  width: '100%',
  padding: '12px 18px',
  background: 'linear-gradient(90deg, #c2e9fb 0%, #a1c4fd 100%)',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  fontWeight: 700,
  color: '#137547',
  borderRadius: 8,
  marginBottom: 6,
  fontSize: 16,
  transition: 'background 0.2s, color 0.2s',
}
const dropdownBtnHoverStyle = {
  background: 'linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%)',
  color: '#fff',
}

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showServicesMenu, setShowServicesMenu] = useState(false)
  const profileMenuRef = useRef()
  const profileBtnRef = useRef()
  const servicesMenuRef = useRef()
  const servicesBtnRef = useRef()
  // For hover effect, track hovered button
  const [hoveredBtn, setHoveredBtn] = useState('')

  useEffect(() => {
    if (!showProfileMenu) return;
    const handleClick = (e) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target) &&
        profileBtnRef.current &&
        !profileBtnRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showProfileMenu]);

  // Add click outside handler for Services dropdown
  useEffect(() => {
    if (!showServicesMenu) return;
    const handleClick = (e) => {
      if (
        servicesMenuRef.current &&
        !servicesMenuRef.current.contains(e.target) &&
        servicesBtnRef.current &&
        !servicesBtnRef.current.contains(e.target)
      ) {
        setShowServicesMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showServicesMenu]);

  return (
    <nav className="navbar">
      <div className="navbar-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Link to="/" className="navbar-brand" style={{ marginRight: 32 }}>
          🐾 PetPal
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginLeft: 'auto' }}>
          <ul className="navbar-nav" style={{ display: 'flex', alignItems: 'center', gap: 18, margin: 0, padding: 0, listStyle: 'none' }}>
            <li>
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/pets" className={location.pathname === '/pets' ? 'active' : ''}>
                Pets
              </Link>
            </li>
            <li>
              <Link to="/accessories" className={location.pathname === '/accessories' ? 'active' : ''}>
                Accessories
              </Link>
            </li>
            <li style={{ position: 'relative' }}>
              <button
                ref={servicesBtnRef}
                className="btn btn-secondary"
                style={{ fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', color: location.pathname.startsWith('/vets') || location.pathname.startsWith('/walkers') || location.pathname.startsWith('/daycare') ? '#137547' : undefined }}
                onClick={() => setShowServicesMenu((v) => !v)}
              >
                Services
              </button>
              {showServicesMenu && (
                <div
                  ref={servicesMenuRef}
                  className="services-dropdown"
                  style={{ position: 'absolute', left: 0, top: 40, background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.12)', borderRadius: 8, minWidth: 160, zIndex: 100, padding: 8 }}
                >
                  <button
                    className="profile-dropdown-btn"
                    style={hoveredBtn === 'vet' ? { ...dropdownBtnStyle, ...dropdownBtnHoverStyle } : dropdownBtnStyle}
                    onMouseEnter={() => setHoveredBtn('vet')}
                    onMouseLeave={() => setHoveredBtn('')}
                    onClick={() => { setShowServicesMenu(false); navigate('/vets') }}
                  >
                    Vet
                  </button>
                  <button
                    className="profile-dropdown-btn"
                    style={hoveredBtn === 'walker' ? { ...dropdownBtnStyle, ...dropdownBtnHoverStyle } : dropdownBtnStyle}
                    onMouseEnter={() => setHoveredBtn('walker')}
                    onMouseLeave={() => setHoveredBtn('')}
                    onClick={() => { setShowServicesMenu(false); navigate('/walkers') }}
                  >
                    Walker
                  </button>
                  <button
                    className="profile-dropdown-btn"
                    style={hoveredBtn === 'daycare' ? { ...dropdownBtnStyle, ...dropdownBtnHoverStyle } : dropdownBtnStyle}
                    onMouseEnter={() => setHoveredBtn('daycare')}
                    onMouseLeave={() => setHoveredBtn('')}
                    onClick={() => { setShowServicesMenu(false); navigate('/daycare') }}
                  >
                    Daycare
                  </button>
                </div>
              )}
            </li>
            {user?.role === 'seller' && (
              <li>
                <Link to="/sell" className={location.pathname === '/sell' ? 'active' : ''}>
                  Sell
                </Link>
              </li>
            )}
            {user?.role === 'admin' && (
              <li>
                <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                  Admin
                </Link>
              </li>
            )}
            {user && (
              // Show Appointments link for all logged-in users, including admin
              <>
                <li>
                  <Link to="/appointments" className={location.pathname === '/appointments' ? 'active' : ''} title="View and manage your appointments here!">
                    Appointments
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className={location.pathname === '/orders' ? 'active' : ''}>
                    My Orders
                  </Link>
                </li>
              </>
            )}
          </ul>
          {user ? (
            <div className="navbar-profile" style={{ position: 'relative' }}>
              <button
                ref={profileBtnRef}
                className="profile-avatar-btn"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                onClick={() => setShowProfileMenu((v) => !v)}
              >
                <img
                  src={user.image || defaultImages.user}
                  alt="Profile"
                  style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #eee', marginRight: 8 }}
                />
                <span style={{ fontWeight: 700, fontSize: 18, color: '#111' }} aria-label="User Name">{user.fullName?.split(' ')[0] || 'Profile'}</span>
              </button>
              {showProfileMenu && (
                <div
                  ref={profileMenuRef}
                  className="profile-dropdown"
                  style={{ position: 'absolute', right: 0, top: 48, background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.12)', borderRadius: 8, minWidth: 160, zIndex: 100 }}
                >
                  <button
                    className="profile-dropdown-btn"
                    style={hoveredBtn === 'profile' ? { ...dropdownBtnStyle, ...dropdownBtnHoverStyle } : dropdownBtnStyle}
                    onMouseEnter={() => setHoveredBtn('profile')}
                    onMouseLeave={() => setHoveredBtn('')}
                    onClick={() => { setShowProfileMenu(false); navigate('/profile') }}
                  >
                    Profile
                  </button>
                  <button
                    className="profile-dropdown-btn"
                    style={hoveredBtn === 'signout' ? { ...dropdownBtnStyle, ...dropdownBtnHoverStyle } : dropdownBtnStyle}
                    onMouseEnter={() => setHoveredBtn('signout')}
                    onMouseLeave={() => setHoveredBtn('')}
                    onClick={async () => { setShowProfileMenu(false); await logout(); }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-secondary" style={{ fontWeight: 500 }}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar 