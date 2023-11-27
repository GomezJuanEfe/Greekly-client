import { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { ShoppingCartContext } from '../../Context'
import Layout from '../../Components/Layout'
import OrderCard from '../../Components/OrderCard' 
import orderService from '../../services/order'
import { toast } from 'react-hot-toast'
import { errorConfig } from '../../Config/toast'
import Loading from '../../Components/Loading'
import { formatToDollars } from '../../utils'

function MyOrder() {
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState(null)
  const context = useContext(ShoppingCartContext)
  const currentPath = window.location.pathname
  let productId = currentPath.substring(currentPath.lastIndexOf('/') + 1)

  useEffect(() => {
    if(!context.token) return

    getOrdedById()
  }, [context.token])

  const getOrdedById = async () => {
    try {
      setLoading(true)

      const order = await orderService.getOrderById(productId, context.token)

      setOrder(order.data.order)

      toast.success(order.message)
    } catch (error) {
      toast.error(error.message, errorConfig)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className='flex items-center justify-center relative w-80 mb-6'>
        <Link to='/my-orders' className='absolute left-0'>
          <ChevronLeftIcon className='h-6 w-6 text-black cursor-pointer' />
        </Link>
        <h1>My Order</h1>
      </div>
      <div className='flex flex-col w-80'>
        {
          loading
          ? <Loading />
          : (
            <>
              {
                order.products.map(order => (
                  <OrderCard
                    key={order.id}
                    id={order.id}
                    title={order.name}
                    imageUrl={order.image}
                    price={order.price}
                  />
                ))
              }
              <h1>Total: {formatToDollars(order.order_total)}</h1>
            </>
          )
        }
      </div>
    </Layout>
  )
}

export default MyOrder