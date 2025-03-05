import React, { useEffect, useState } from 'react'
import Header from './Header'
import { Outlet, useLocation } from 'react-router-dom'
import { db } from '../firebase-config'
import { collection, query, where, getDocs } from 'firebase/firestore'

import MiniHeader from './MiniHeader'

const PageLayout = () => {
  const [blogs, setBlogs] = useState([])
  
  const location = useLocation()

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
    <div className={`${blogs.length > 0 ? "" : "h-screen"} w-full overflow-hidden bg-[#000]`}>
      <div className='hidden lg:block'>
        <Header />
      </div>
      <div className='xs:flex lg:hidden' >
        <MiniHeader />
      </div>
      <div className=''>
        <Outlet />
      </div>
    </div>
  )
}

export default PageLayout