import { useState, useContext } from "react"
import { toast } from 'react-hot-toast'
import { errorConfig } from '../../Config/toast'
import checkoutService from '../../services/checkout';
import orderService from '../../services/order.js'
import { ShoppingCartContext } from '../../Context'
import { formatToDollars } from '../../utils'
import {
  useElements,
  useStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import Loading from "../Loading";

const inputStyles = 'bg-white rounded-lg py-3 px-4 border border-gray-300 focus:outline-none focus:border-blue-500'

const CheckoutForm = ({ orderTotal }) => {
  const [loading, setLoading] = useState(false)
  const context = useContext(ShoppingCartContext)
  const stripe = useStripe()
  const elements = useElements()

  const products = context.cartProducts.map(product => product.id);

  const handlePayment = async (paymentId) => {
    const order = {
      products,
      paymentId,
      order_status: "CONFIRMED"
    }

    const res = await orderService.create(order, context.token)

    toast.success(res.message)

    context.setCartProducts([])
    context.setSearchByTitle(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      if (products.length === 0) {
        throw new Error('No products in cart')
      }

      setLoading(true)

      if (!context.userProfile) {
        throw new Error('You must be logged in to make a purchase')
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(
          CardNumberElement,
          CardExpiryElement,
          CardCvcElement,
        ),
      })

      if (error) {
        throw error
      }

      const response = await checkoutService.checkout({
        paymentMethod,
        amount: orderTotal,
      })

      if (response.status === 201) {
        toast.success(response.data.message)
      } else {
        context.closeCheckoutSideMenu()
        throw error
      }

      await handlePayment(response.data.payment.id)
      context.closeCheckoutSideMenu()
    } catch (error) {
      toast.error(error.message, errorConfig)
    } finally {
      setLoading(false)
      elements.getElement(
        CardNumberElement,
        CardExpiryElement,
        CardCvcElement,
      ).clear();
    }




  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col flex-1 h-full"
    >

      <div className="flex-1 flex flex-col gap-2">
        <input className={inputStyles} type="text" placeholder="Name on Card" />
        <CardNumberElement className={inputStyles} />
        <CardExpiryElement className={inputStyles} />
        <CardCvcElement className={inputStyles} />
      </div>

      {
        loading && <Loading />
      }

      <div className="mb-6">
        <button
          className={`bg-black py-3 font-medium text-white w-full rounded-lg ${loading && 'opacity-60'}`}
          disabled={loading}
        >
          Pay {formatToDollars(orderTotal)}
        </button>
      </div>
    </form>
  )
}

export default CheckoutForm