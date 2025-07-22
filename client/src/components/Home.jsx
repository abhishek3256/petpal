import { Link } from 'react-router-dom'
import { socialLinks, handleSocialClick } from '../utils/socialLinks'

const Home = () => {
  return (
    <div style={{ background: 'linear-gradient(135deg, #ffd6c0 0%, #f7c6a3 40%, #d6f5e7 100%)', minHeight: '100vh' }}>
      <section className="hero">
        <div className="container">
          <h1>Welcome to PetPal</h1>
          <p>Your one-stop destination for all pet services and needs</p>
          <div className="flex" style={{ justifyContent: 'center', gap: '20px' }}>
            <Link to="/pets" className="btn">
              Browse Pets
            </Link>
            <Link to="/accessories" className="btn btn-secondary">
              Shop Accessories
            </Link>
          </div>
        </div>
      </section>

      <section className="features service-gradient-1" style={{ borderRadius: 0, padding: '32px 0' }}>
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">Everything your pet needs in one place</p>
          
          <div className="features-grid">
            <div className="feature-card service-gradient-1">
              <div className="feature-icon">🐕</div>
              <h3>Pet Adoption</h3>
              <p className="service-desc-green">Find your perfect companion from trusted sellers</p>
              <Link to="/pets" className="btn btn-secondary">
                Browse Pets
              </Link>
            </div>

            <div className="feature-card service-gradient-2">
              <div className="feature-icon">🩺</div>
              <h3>Veterinary Care</h3>
              <p className="service-desc-green">Book appointments with experienced veterinarians</p>
              <Link to="/vets" className="btn btn-secondary">
                Find Vets
              </Link>
            </div>

            <div className="feature-card service-gradient-3">
              <div className="feature-icon">🚶</div>
              <h3>Pet Walking</h3>
              <p className="service-desc-green">Professional pet walking services</p>
              <Link to="/walkers" className="btn btn-secondary">
                Find Walkers
              </Link>
            </div>

            <div className="feature-card service-gradient-4">
              <div className="feature-icon">🏠</div>
              <h3>Pet Daycare</h3>
              <p className="service-desc-green">Safe and caring daycare for your pets</p>
              <Link to="/daycare" className="btn btn-secondary">
                Find Daycare
              </Link>
            </div>

            <div className="feature-card service-gradient-5">
              <div className="feature-icon">🛍️</div>
              <h3>Pet Accessories</h3>
              <p className="service-desc-green">Everything your pet needs</p>
              <Link to="/accessories" className="btn btn-secondary">
                Shop Now
              </Link>
            </div>

            <div className="feature-card service-gradient-6">
              <div className="feature-icon">💰</div>
              <h3>Sell Your Pet</h3>
              <p className="service-desc-green">Sell your pets to loving families</p>
              <Link to="/sell" className="btn btn-secondary">
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-us" style={{ background: 'linear-gradient(135deg, #ffd6c0 0%, #f7c6a3 40%, #d6f5e7 100%)', padding: '48px 0' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 40 }}>
          <img src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop" alt="About PetPal" style={{ width: 340, height: 260, objectFit: 'cover', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }} />
          <div style={{ flex: 1, minWidth: 260 }}>
            <h2 style={{ fontSize: 32, marginBottom: 16 }}>About Us</h2>
            <p style={{ fontSize: 18, color: '#333', marginBottom: 16 }}>
              <b>PetPal</b> is your one-stop destination for all pet services and needs. Whether you want to adopt a pet, book a vet appointment, hire a pet walker or daycare, or shop for accessories, PetPal brings together trusted service providers and loving pet owners on a single, easy-to-use platform.
            </p>
            <p style={{ fontSize: 17, color: '#444', marginBottom: 12 }}>
              Our mission is to make pet care accessible, reliable, and joyful for everyone. We believe every pet deserves the best, and every owner deserves peace of mind.
            </p>
            <div style={{ fontWeight: 600, fontSize: 18, marginTop: 18 }}>Owner: Abhishek Ray</div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="contact-us" style={{ background: 'linear-gradient(135deg, #ffd6c0 0%, #d6f5e7 100%)', padding: '40px 0' }}>
        <div className="container" style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 30, marginBottom: 18 }}>Contact Us</h2>
          <p style={{ fontSize: 17, color: '#444', marginBottom: 24 }}>
            Have questions, suggestions, or want to connect? Reach out to us on social media!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 12 }}>
            <a href="#" onClick={e => { e.preventDefault(); window.location.reload(); }} title="Facebook" style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#4267B2"/><path d="M21.333 16h-3.2v8h-3.2v-8h-1.6v-2.667h1.6v-1.6c0-2.133 1.067-3.2 3.2-3.2h2.133V12.8h-1.067c-.8 0-1.066.267-1.066 1.067v1.467h2.133L21.333 16z" fill="#fff"/></svg>
            </a>
            <a href="#" onClick={e => { e.preventDefault(); window.location.reload(); }} title="Instagram" style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><radialGradient id="ig" cx="0.5" cy="0.5" r="0.5"><stop stopColor="#feda75"/><stop offset="0.5" stopColor="#fa7e1e"/><stop offset="1" stopColor="#d62976"/></radialGradient><circle cx="16" cy="16" r="16" fill="url(#ig)"/><rect x="9" y="9" width="14" height="14" rx="4" fill="#fff"/><circle cx="16" cy="16" r="4" fill="#d62976"/><circle cx="21.5" cy="10.5" r="1.5" fill="#fa7e1e"/></svg>
            </a>
            <a href="#" onClick={e => { e.preventDefault(); window.location.reload(); }} title="LinkedIn" style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#0077B5"/><rect x="10" y="14" width="3" height="8" fill="#fff"/><rect x="19" y="17" width="3" height="5" fill="#fff"/><circle cx="11.5" cy="11.5" r="1.5" fill="#fff"/><path d="M16 14h2.5c1.5 0 2.5 1 2.5 2.5V22h-3v-3c0-.5-.5-1-1-1s-1 .5-1 1v3h-3v-8h3v1z" fill="#fff"/></svg>
            </a>
            <a href="#" onClick={e => { e.preventDefault(); window.location.reload(); }} title="Reddit" style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#FF4500"/><ellipse cx="16" cy="20" rx="7" ry="4" fill="#fff"/><circle cx="12.5" cy="18.5" r="1.5" fill="#FF4500"/><circle cx="19.5" cy="18.5" r="1.5" fill="#FF4500"/><ellipse cx="16" cy="22" rx="2.5" ry="1" fill="#FF4500"/><circle cx="10" cy="12" r="2" fill="#fff"/><circle cx="22" cy="12" r="2" fill="#fff"/><circle cx="10" cy="12" r="1" fill="#FF4500"/><circle cx="22" cy="12" r="1" fill="#FF4500"/><rect x="15" y="8" width="2" height="6" rx="1" fill="#fff"/></svg>
            </a>
          </div>
          <div style={{ fontSize: 16, color: '#888' }}>Abhishek Ray &middot; PetPal &copy; 2025</div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>PetPal</h3>
            <p>Your trusted partner for all pet-related services and needs.</p>
          </div>
          
          <div className="footer-section">
            <h3>Services</h3>
            <ul>
              <li><Link to="/pets">Pet Adoption</Link></li>
              <li><Link to="/vets">Veterinary Care</Link></li>
              <li><Link to="/walkers">Pet Walking</Link></li>
              <li><Link to="/daycare">Pet Daycare</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Shop</h3>
            <ul>
              <li><Link to="/accessories">Pet Accessories</Link></li>
              <li><Link to="/sell">Sell Pets</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Connect</h3>
            <ul>
              <li><a href="#" onClick={() => handleSocialClick('facebook')}>Facebook</a></li>
              <li><a href="#" onClick={() => handleSocialClick('twitter')}>Twitter</a></li>
              <li><a href="#" onClick={() => handleSocialClick('instagram')}>Instagram</a></li>
              <li><a href="#" onClick={() => handleSocialClick('linkedin')}>LinkedIn</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 PetPal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home 