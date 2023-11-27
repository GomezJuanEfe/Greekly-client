import { useContext, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { ShoppingCartContext } from '../../Context'
import OrderCard from '../../Components/OrderCard'
import { totalPrice, formatToDollars } from '../../utils'
import { toast } from 'react-hot-toast'
import { errorConfig } from '../../Config/toast'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import CheckoutForm from '../CheckoutForm'
import './styles.css'

const stripePromise = loadStripe('pk_test_51OGt8BBhQLi2uPXuOZfyp9sTgm0qXvXOX7sdaJmyqFMSEIhqvtdBC9O4PwalgtqAdXJ3Y7XkldxFb75ihv5S1Wo900i8lUM9rJ')


const CheckoutSideMenu = () => {
  const context = useContext(ShoppingCartContext)
  const [view, setView] = useState('order');

  const handleDelete = (id) => {
    const filteredProducts = context.cartProducts.filter(product => product.id != id)
    context.setCartProducts(filteredProducts)
  }

  const orderTotal = totalPrice(context.cartProducts)
  const products = context.cartProducts.map(product => product.id);

  const handleCheckout = () => {
    if (!context.userProfile) return toast.error('You must be logged in to make a purchase', errorConfig)
    if (products.length === 0) return toast.error('Your cart is empty', errorConfig)

    setView('checkout')
  }

  const renderBody = () => {
    if (view === 'order') {
      return (
        <>
          <div className='flex justify-between items-center p-6'>
            <h2 className='font-medium text-xl'>My Order</h2>
            <div>
              <XMarkIcon
                className='h-6 w-6 text-black cursor-pointer'
                onClick={() => context.closeCheckoutSideMenu()}
              />
            </div>
          </div>
          <div className='px-6 overflow-y-scroll flex-1'>
            {
              context.cartProducts.map(product => (
                <OrderCard
                  key={product.id}
                  id={product.id}
                  title={product.name}
                  imageUrl={product.image}
                  price={product.price}
                  handleDelete={handleDelete}
                />
              ))
            }
          </div>
        </>
      )
    } else {
      return (
        <>
          <div className='flex justify-between items-center p-6'>
            <h2 className='font-medium text-xl'>Payment</h2>
            <div>
              <ChevronLeftIcon
                className='h-6 w-6 text-black cursor-pointer'
                onClick={() => setView('order')}
              />
            </div>
          </div>
          <div className='px-6 flex-1'>
            <Elements stripe={stripePromise}>
              <CheckoutForm orderTotal={orderTotal} />
            </Elements>
          </div>
        </>
      )
    }
  }

  return (
    <aside
      className={`${context.isCheckoutSideMenuOpen ? 'flex' : 'hidden'} checkout-side-menu flex-col fixed right-0 border border-black rounded-lg bg-white`}>
      {renderBody()}
      {
        view === 'order' &&
        <div className='px-6 mb-6'>
          <p className='flex justify-between items-center mb-2'>
            <span className='font-light'>Total:</span>
            <span className='font-medium text-2xl'>{formatToDollars(orderTotal)}</span>
          </p>
          <button
            className={`bg-black py-3 text-white w-full rounded-lg`}
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      }
    </aside>
  )
}

export default CheckoutSideMenu