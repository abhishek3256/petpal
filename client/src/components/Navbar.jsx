import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { socialLinks, handleSocialClick } from '../utils/socialLinks'
import { useState, useEffect, useRef } from 'react'
import { defaultImages } from '../utils/imageLinks'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const profileMenuRef = useRef()
  const profileBtnRef = useRef()

  useEffect(() => {
    if (!showProfileMenu) return
    const handleClick = (e) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target) &&
        profileBtnRef.current &&
        !profileBtnRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showProfileMenu])

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
            <li>
              <Link to="/vets" className={location.pathname === '/vets' ? 'active' : ''}>
                Vets
              </Link>
            </li>
            <li>
              <Link to="/walkers" className={location.pathname === '/walkers' ? 'active' : ''}>
                Walkers
              </Link>
            </li>
            <li>
              <Link to="/daycare" className={location.pathname === '/daycare' ? 'active' : ''}>
                Daycare
              </Link>
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
                    style={{ width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                    onClick={() => { setShowProfileMenu(false); navigate('/profile') }}
                  >
                    Profile
                  </button>
                  <button
                    className="profile-dropdown-btn"
                    style={{ width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#e17055' }}
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