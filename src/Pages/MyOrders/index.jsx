import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../Components/Layout'
import { ShoppingCartContext } from '../../Context'
import OrdersCard from '../../Components/OrdersCard'
import orderService from '../../services/order'
import { toast } from 'react-hot-toast'
import { errorConfig } from '../../Config/toast'
import Loading from '../../Components/Loading'

function MyOrders() {
  const [loading, setLoading] = useState(false)
  const context = useContext(ShoppingCartContext)

  useEffect(() => {
    if (!context.token) return

    getOrdersByUser()
  }, [context.token])

  const getOrdersByUser = async () => {
    try {
      setLoading(true)

      const orders = await orderService.getOrdersByUser(context.token)

      context.setOrders(orders.data.orders)

      toast.success(orders.message)
    } catch (error) {
      toast.error(error.message, errorConfig)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className='flex items-center justify-center relative w-80 mb-4'>
        <h1 className='font-medium text-xl'>My Orders</h1>
      </div>
      {
        loading
        ? <Loading />
        : (
          context.orders.map((order ) => (
            <Link key={order.id} to={`/my-orders/${order.id}`}>
              <OrdersCard
                totalPrice={order.order_total}
                totalProducts={order.products.length} />
            </Link>
          ))
        )
      }
    </Layout>
  )
}

export default MyOrders