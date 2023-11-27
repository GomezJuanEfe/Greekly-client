import { createContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { errorConfig } from '../Config/toast'
import productService from '../services/product'
import Cookies from 'js-cookie'

export const ShoppingCartContext = createContext()

export const ShoppingCartProvider = ({ children }) => {
  // My account
  const [account, setAccount] = useState({})

  // Token
  const [token, setToken] = useState(null)

  // User profile
  const [userProfile, setUserProfile] = useState(null)

  // Shopping Cart · Increment quantity
  const [count, setCount] = useState(0)

  // Product Detail · Open/Close
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false)
  const openProductDetail = () => setIsProductDetailOpen(true)
  const closeProductDetail = () => setIsProductDetailOpen(false)

  // Checkout Side Menu · Open/Close
  const [isCheckoutSideMenuOpen, setIsCheckoutSideMenuOpen] = useState(false)
  const openCheckoutSideMenu = () => setIsCheckoutSideMenuOpen(true)
  const closeCheckoutSideMenu = () => setIsCheckoutSideMenuOpen(false)
  const toggleCheckoutSideMenu = () => setIsCheckoutSideMenuOpen(!isCheckoutSideMenuOpen)

  // Product Detail · Show product
  const [productToShow, setProductToShow] = useState({})

  // Shopping Cart · Add products to cart
  const [cartProducts, setCartProducts] = useState([])

  // Shopping Cart · Order
  const [orders, setOrders] = useState([])

  // Get products
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState(null)
  const [filteredItems, setFilteredItems] = useState(null)

  // Get products by title
  const [searchByTitle, setSearchByTitle] = useState(null)

  // Get products by category
  const [searchByCategory, setSearchByCategory] = useState(null)

  useEffect(() => {
    try {
      getAllProducts()
    } catch (error) {
      toast.error(error.message, errorConfig)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const loggedUserJSON = Cookies.get('userSession')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUserProfile(user.profile)
      setToken(user.token)
    }
  }, [])

  const getAllProducts = async () => {
    try {
      const { data } = await productService.getAll()

      setItems(data.products)
    } catch (error) {
      toast.error(error.message, errorConfig)
    }
  }

  const filteredItemsByTitle = (items, searchByTitle) => {
    return items?.filter(item => item.name.toLowerCase().includes(searchByTitle.toLowerCase()))
  }

  const filteredItemsByCategory = (items, searchByCategory) => {
    return items?.filter(item => item.category.toLowerCase().includes(searchByCategory.toLowerCase()))
  }

  const filterBy = (searchType, items, searchByTitle, searchByCategory) => {
    if (searchType === 'BY_TITLE') {
      return filteredItemsByTitle(items, searchByTitle)
    }

    if (searchType === 'BY_CATEGORY') {
      return filteredItemsByCategory(items, searchByCategory)
    }

    if (searchType === 'BY_TITLE_AND_CATEGORY') {
      return filteredItemsByCategory(items, searchByCategory).filter(item => item.name.toLowerCase().includes(searchByTitle.toLowerCase()))
    }

    if (!searchType) {
      return items
    }
  }

  useEffect(() => {
    if (searchByTitle && searchByCategory) setFilteredItems(filterBy('BY_TITLE_AND_CATEGORY', items, searchByTitle, searchByCategory))
    if (searchByTitle && !searchByCategory) setFilteredItems(filterBy('BY_TITLE', items, searchByTitle, searchByCategory))
    if (!searchByTitle && searchByCategory) setFilteredItems(filterBy('BY_CATEGORY', items, searchByTitle, searchByCategory))
    if (!searchByTitle && !searchByCategory) setFilteredItems(filterBy(null, items, searchByTitle, searchByCategory))
  }, [items, searchByTitle, searchByCategory])

  return (
    <ShoppingCartContext.Provider value={{
      count,
      setCount,
      openProductDetail,
      closeProductDetail,
      isProductDetailOpen,
      productToShow,
      setProductToShow,
      cartProducts,
      setCartProducts,
      isCheckoutSideMenuOpen,
      openCheckoutSideMenu,
      closeCheckoutSideMenu,
      toggleCheckoutSideMenu,
      orders,
      setOrders,
      items,
      setItems,
      searchByTitle,
      setSearchByTitle,
      filteredItems,
      searchByCategory,
      setSearchByCategory,
      account,
      setAccount,
      token,
      setToken,
      userProfile,
      setUserProfile,
      loading
    }}>
      {children}
    </ShoppingCartContext.Provider>
  )
}

