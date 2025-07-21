import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { defaultImages } from '../utils/imageLinks'

const Orders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(null)

  useEffect(() => {
    if (user) fetchOrders()
    // eslint-disable-next-line
  }, [user])

  const fetchOrders = async () => {
    setOrdersLoading(true)
    try {
      let url = `${import.meta.env.VITE_API_BASE_URL}/orders/my-orders`
      const res = await axios.get(url, { withCredentials: true })
      setOrders(res.data)
    } catch (error) {
      toast.error('Failed to fetch orders')
    } finally {
      setOrdersLoading(false)
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

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdating(orderId)
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}/status`, { status: newStatus }, { withCredentials: true })
      toast.success('Order status updated!')
      fetchOrders()
    } catch (error) {
      toast.error('Failed to update order status')
    } finally {
      setStatusUpdating(null)
    }
  }

  if (!user) return <div className="container"><div className="card text-center">Please login to view your orders.</div></div>

  return (
    <div className="container" style={{ maxWidth: 900, margin: '40px auto', background: 'linear-gradient(135deg, #ffe3cf 0%, #bfc3d9 100%)', borderRadius: 16 }}>
      <div className="card" style={{ padding: 32, position: 'relative', background: 'linear-gradient(120deg, #fff 80%, #f3e8ff 100%)' }}>
        <h2 style={{ margin: '0 0 18px 0' }}>My Orders</h2>
        <button className="btn btn-secondary" style={{ marginBottom: 12 }} onClick={fetchOrders} disabled={ordersLoading}>
          {ordersLoading ? 'Refreshing...' : 'Refresh Orders'}
        </button>
        {ordersLoading ? (
          <div>Loading orders...</div>
        ) : orders.filter(order => order.type === 'pet' || order.type === 'accessory').length === 0 ? (
          <div>No orders found.</div>
        ) : (
          <div className="grid">
            {orders.filter(order => order.type === 'pet' || order.type === 'accessory').map(order => {
              const details = getOrderItemDetails(order);
              return (
                <div key={order._id} className="card" style={{ minWidth: 220, margin: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {details.image && <img src={details.image} alt={details.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />}
                  <p><strong>Type:</strong> {order.type.charAt(0).toUpperCase() + order.type.slice(1)}</p>
                  <p><strong>Item:</strong> {details.name}</p>
                  {details.extra && <p>{details.extra}</p>}
                  <p><strong>Amount:</strong> ₹{order.amount}</p>
                  <p><strong>Status:</strong> <span style={{ color: order.status === 'cancelled' ? 'red' : order.status === 'completed' ? 'green' : order.status === 'confirmed' ? '#137547' : '#888' }}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></p>
                  {/* Admin status change UI removed for My Orders view */}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders 