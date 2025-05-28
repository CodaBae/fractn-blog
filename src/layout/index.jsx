import React, { useEffect, useState } from 'react'
import Header from './Header'
import { Outlet, useLocation } from 'react-router-dom'
import { db } from '../firebase-config'
import { collection, query, where, getDocs } from 'firebase/firestore'

import MiniHeader from './MiniHeader'

const PageLayout = () => {
  const [blogs, setBlogs] = useState([])
  
  const location = useLocation()

  const isBlogContent = location.pathname.startsWith('/blog');

  useEffect(() => {
      getBlogs()
  }, [])



  const getBlogs = async () => {
      try {
          const blogsRef = collection(db, 'blogs')
          const querySnapshot = await getDocs(blogsRef)
          const blogsData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
          }))
          setBlogs(blogsData)
      } catch (error) {
          console.error("Error fetching blogs: ", error)
      } finally {
          setLoading(false)
      }
  }

  return (
    <div className={`${isBlogContent ? "bg-[#fff]" : "bg-[#000]"} h-screen w-full overflow-x-hidden `}> {/* bg-[#fff] */}
      <div className='hidden lg:block'>
        <Header />
      </div>
      <div className='xs:flex lg:hidden' >
        <MiniHeader />
      </div>
      <div 
        className='w-full'
        style={isBlogContent ? { backgroundColor: "#fff"}  : {
          backgroundImage: "url(https://finestwp.co/demos/wp/suzly/wp-content/uploads/2023/11/Ellipse-475-4.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <Outlet />
      </div>
    </div>
  )
}

export default PageLayout