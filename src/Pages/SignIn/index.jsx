import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCartContext } from '../../Context'
import loginService from '../../services/login'
import userService from '../../services/user'
import Layout from '../../Components/Layout'
import Cookies from 'js-cookie'
import { toast } from 'react-hot-toast'
import { errorConfig } from '../../Config/toast'
import Loading from '../../Components/Loading'

function SignIn() {
  const context = useContext(ShoppingCartContext)
  const [view, setView] = useState('user-info')

  const [loading, setLoading] = useState(false)

  const [userEmail, setUserEmail] = useState('')
  const [password, setPassword] = useState('')

  const [userNameCreate, setUserNameCreate] = useState('')
  const [userEmailCreate, setUserEmailCreate] = useState('')
  const [userPasswordCreate, setUserPasswordCreate] = useState('')

  const navigate = useNavigate();

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)

      const user = await loginService.login({
        email: userEmail,
        password
      })

      Cookies.set('userSession', JSON.stringify(user), { expires: 1 })

      context.setToken(user.token)
      context.setUserProfile(user.profile)

      setUserEmail('')
      setPassword('')

      navigate('/')

      toast.success(user.message)
    } catch (error) {
      toast.error(error.message, errorConfig)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAccountSubmit = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)

      const user = await userService.create({
        name: userNameCreate,
        email: userEmailCreate,
        password: userPasswordCreate
      })

      Cookies.set('userSession', JSON.stringify(user), { expires: 1 })

      context.setToken(user.token)
      context.setUserProfile(user.profile)

      setUserNameCreate('')
      setUserEmailCreate('')
      setUserPasswordCreate('')

      navigate('/')

      toast.success(user.message)
    } catch (error) {
      toast.error(error.message, errorConfig)
    } finally {
      setLoading(false)
    }
  }

  const renderLogIn = () => {
    return (
      <div className='flex flex-col w-80'>
        <form onSubmit={handleLoginSubmit} className='flex flex-col gap-4 w-80'>
          {
            loading
            ? <Loading />
            : (
              <>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="email" className='font-light text-sm'>Your email:</label>
                  <input
                    className='rounded-lg border border-black placeholder:font-light placeholder:text-sm placeholder:text-black/60 focus:outline-none py-2 px-4'
                    type='text'
                    id='email'
                    value={userEmail}
                    name='email'
                    placeholder='user@mail.com'
                    onChange={({ target }) => setUserEmail(target.value)}
                  />
                </div>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="password" className='font-light text-sm'>Your password:</label>
                  <input
                    className='rounded-lg border w-full border-black placeholder:font-light placeholder:text-sm placeholder:text-black/60 focus:outline-none py-2 px-4'
                    type='password'
                    id='password'
                    value={password}
                    name='password'
                    placeholder='*******'
                    onChange={({ target }) => setPassword(target.value)}
                  />
                </div>
              </>
            )
          }
          
          <button
            className={`bg-black disabled:bg-black/40 text-white  w-full rounded-lg py-3 mt-4 mb-2 ${loading && 'opacity-60'}`}
            disabled={loading}
          >
            Login
          </button>
        </form>

        <button
          className={`border border-black disabled:text-black/40 disabled:border-black/40 rounded-lg mt-6 py-3 ${loading && 'opacity-60'}`}
          disabled={loading}
          onClick={() => setView('create-user-info')}
        >
          Sign up
        </button>
      </div>
    )
  }

  const renderCreateUserInfo = () => {
    return (
      <div>
        <form onSubmit={handleCreateAccountSubmit} className='flex flex-col gap-4 w-80'>
          {
            loading
            ? <Loading />
            : (
              <>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="name" className='font-light text-sm'>Your name:</label>
                  <input
                    className='rounded-lg border border-black placeholder:font-light placeholder:text-sm placeholder:text-black/60 focus:outline-none py-2 px-4'
                    type="text"
                    id="name"
                    name="name"
                    value={userNameCreate}
                    placeholder="Peter"
                    onChange={({ target }) => setUserNameCreate(target.value)}
                  />
                </div>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="email" className='font-light text-sm'>Your email:</label>
                  <input
                    className='rounded-lg border border-black placeholder:font-light placeholder:text-sm placeholder:text-black/60 focus:outline-none py-2 px-4'
                    type="text"
                    id="email"
                    name="email"
                    value={userEmailCreate}
                    placeholder="hi@helloworld.com"
                    onChange={({ target }) => setUserEmailCreate(target.value)}
                  />
                </div>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="password" className='font-light text-sm'>Your password:</label>
                  <input
                    className='rounded-lg border border-black placeholder:font-light placeholder:text-sm placeholder:text-black/60 focus:outline-none py-2 px-4'
                    type="password"
                    id="password"
                    name="password"
                    value={userPasswordCreate}
                    placeholder="******"
                    onChange={({ target }) => setUserPasswordCreate(target.value)}
                  />
                </div>
              </>
            )
          }
          
          <button
            className={`bg-black text-white w-full rounded-lg py-3 ${loading && 'opacity-60'}`}
            disabled={loading}
          >
            Create
          </button>
        </form>
        <button
          className={`border border-black disabled:text-black/40 disabled:border-black/40 w-full rounded-lg mt-6 py-3 ${loading && 'opacity-60'}`}
          disabled={loading}
          onClick={() => setView('user-info')}
        >
          Login
        </button>
      </div>
    )
  }

  const renderView = () => view === 'create-user-info' ? renderCreateUserInfo() : renderLogIn()

  return (
    <Layout>
      <h1 className="font-medium text-xl text-center mb-6 w-80">Welcome</h1>
      {renderView()}
    </Layout>
  )
}

export default SignIn