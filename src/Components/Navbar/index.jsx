import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { ShoppingCartContext } from '../../Context'
import ShoppingCart from '../ShoppingCart'
import Cookies from 'js-cookie'

const Navbar = () => {
  const context = useContext(ShoppingCartContext)
  const activeStyle = 'underline underline-offset-4'

  const handleSignOut = () => {
    context.setUserProfile(null)
    context.setToken(null)
    Cookies.remove('userSession')
  }

  const renderView = () => {
    if (context.userProfile) {
      return (
        <>
          <li className='text-black/60'>
            {context.userProfile.email}
          </li>
          <li>
            <NavLink
              to='/my-orders'
              className={({ isActive }) => isActive ? activeStyle : undefined}>
              My Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/my-account'
              className={({ isActive }) => isActive ? activeStyle : undefined}>
              My Account
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/sign-in'
              className={({ isActive }) => isActive ? activeStyle : undefined}
              onClick={() => handleSignOut()}>
              Sign out
            </NavLink>
          </li>
        </>
      )
    } else {
      return (
        <li>
          <NavLink
            to="/sign-in"
            className={({ isActive }) => isActive ? activeStyle : undefined}
            onClick={() => handleSignOut()}>
            Sign in
          </NavLink>
        </li>
      )
    }
  }

  return (
    <nav className='flex justify-between items-center fixed z-10 top-0 w-full py-5 px-8 text-sm gap-3 font-light bg-white max-md:flex-col lg:flex-row'>
      <ul className='flex items-center gap-3'>
        <li className='font-semibold text-lg'>
          <NavLink
            to={`${context.userProfile ? '/' : '/sign-in'}`}
            onClick={() => context.setSearchByCategory()}
          >
            Greekly
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/'
            onClick={() => context.setSearchByCategory()}
            className={({ isActive }) =>
              isActive ? activeStyle : undefined
            }>
            All
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/shirts'
            onClick={() => context.setSearchByCategory('shirt')}
            className={({ isActive }) =>
              isActive ? activeStyle : undefined
            }>
            Shirts
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/hats'
            onClick={() => context.setSearchByCategory('hat')}
            className={({ isActive }) =>
              isActive ? activeStyle : undefined
            }>
            Hats
          </NavLink>
        </li>
      </ul>
      <ul className='flex items-center gap-3'>
        {renderView()}
        <li className='flex items-center'>
          <ShoppingCart />
        </li>
      </ul>
    </nav>
  )
}

export default Navbar