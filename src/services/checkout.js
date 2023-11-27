import axios from 'axios'

const baseURL = `${import.meta.env.VITE_API_URL}/api/checkout`

const checkout = async (paymentInfo) => {
  console.log(paymentInfo)
  const res = await axios.post(baseURL, paymentInfo)
  return res
}

export default { checkout }