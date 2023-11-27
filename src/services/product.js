import axios from 'axios'

const baseURL = `${import.meta.env.VITE_API_URL}/api/product`

const getAll = async () => {
  const { data } = await axios.get(baseURL)
  return data
}

export default { getAll }