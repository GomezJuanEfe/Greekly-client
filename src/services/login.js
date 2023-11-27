import axios from 'axios'

const baseURL = `${import.meta.env.VITE_API_URL}/auth/local/login`

const login = async (credentials) => {
  const { data } = await axios.post(baseURL, credentials)
  return data
}

export default { login }