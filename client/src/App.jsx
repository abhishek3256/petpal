import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Pets from './components/Pets'
import Accessories from './components/Accessories'
import Vets from './components/Vets'
import Walkers from './components/Walkers'
import Daycare from './components/Daycare'
import Sell from './components/Sell'
import Login from './components/Login'
import Register from './components/Register'
import Admin from './components/Admin'
import Profile from './components/Profile'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/accessories" element={<Accessories />} />
            <Route path="/vets" element={<Vets />} />
            <Route path="/walkers" element={<Walkers />} />
            <Route path="/daycare" element={<Daycare />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App 