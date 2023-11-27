import axios from 'axios'

const baseURL = `${import.meta.env.VITE_API_URL}/api/user`

const create = async (credentials) => {
  const { data } = await axios.post(baseURL, credentials)
  return data
}

export default { create }