const Layout = ({ children }) => {
  return (
    <div className='flex flex-col items-center lg:mt-20 md:mt-[100px] max-sm:mt-[120px]'>
      {children}
    </div>
  )
}

export default Layout