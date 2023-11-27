import axios from 'axios'

const baseURL = `${import.meta.env.VITE_API_URL}/api/order`

const create = async (newObject, token) => {
  const config = {
    headers: {
      authorization: `Bearer ${token}`
    }
  }

  const { data } = await axios.post(baseURL, newObject, config)
  return data
}

const getOrdersByUser = async (token) => {
  const config = {
    headers: {
      authorization: `Bearer ${token}`
    }
  }

  const { data } = await axios.get(`${baseURL}/getOrdersByUser`, config)
  return data
}

const getOrderById = async (id, token) => {
  const config = {
    headers: {
      authorization: `Bearer ${token}`
    }
  }

  const { data } = await axios.get(`${baseURL}/getOrderById/${id}`, config)
  return data
}

export default { create, getOrdersByUser, getOrderById }