import React, { useState, useEffect } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { db } from '../../firebase-config'
import { collection, query, where, getDocs } from 'firebase/firestore'

const Blog = () => {
    const [topicOption, setTopicOption] = useState("")
    const [loading, setLoading] = useState(false)
    const [yearOption, setYearOption] = useState("")
    const [blogs, setBlogs] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        getBlogs()
    }, [topicOption, yearOption])

    const handleOptionChange = (e) => {
        setTopicOption(e.target.value)
    }

    const handleYearChange = (e) => {
        setYearOption(e.target.value)
    }

    const getBlogs = async () => {
        setLoading(true)
        try {
            const blogsRef = collection(db, 'blogs')
            const filters = []
            
            if (topicOption) {
                filters.push(where('topic', '==', topicOption))
            }
            
            if (yearOption) {
                filters.push(where('year', '==', yearOption))
            }
            
            const q = filters.length > 0 
                ? query(blogsRef, ...filters) 
                : blogsRef

            const querySnapshot = await getDocs(q)
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

    console.log(blogs, "blogs")

  return (
        <div 
            className='w-full'
        >
            <div className="flex flex-col items-center mt-20 gap-8 md:gap-20 px-4 md:px-8 lg:px-16 xl:px-32 py-8 md:py-16">
                <p className='text-white font-euclid text-3xl md:text-4xl lg:text-5xl font-bold text-center'>BLOG</p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 w-full max-w-4xl">
                    {/* Topic Select */}
                    <div className="relative w-full md:w-48">
                        <select 
                            value={topicOption} 
                            onChange={(e) => handleOptionChange(e)} 
                            className='bg-gray-100 w-full outline-none h-10 rounded-lg px-3 appearance-none border border-gray-300 text-sm md:text-base'
                        >
                            <option value="">All topics</option>
                            <option value="Security">Security</option>
                    
                        </select>
                        <FiChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
                    </div>

                    {/* Year Select */}
                    <div className="relative w-full md:w-48">
                        <select 
                            value={yearOption} 
                            onChange={(e) => handleYearChange(e)} 
                            className='bg-gray-100 w-full h-10 outline-none rounded-lg px-3 appearance-none border border-gray-300 text-sm md:text-base'
                        >
                            <option value="">All years</option>
                            <option value="2025">2025</option>
                        </select>
                        <FiChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className={`${blogs?.length > 0 ? "grid grid-cols-1 md:grid-cols-2 gap-6" :  "flex items-center justify-center"} px-4 md:px-8 lg:px-16 xl:px-32 pb-16`}>
                {loading ? 
                    <p className='text-xl md:text-2xl text-white text-center font-semibold'>Loading Blog...</p> :
                    blogs.length > 0 ?
                    blogs.map((item) => (
                        <div key={item.id} className='flex cursor-pointer flex-col h-auto md:h-[28rem] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow' onClick={() => {navigate("/view-details", {state: item}), window.scrollTo(0,0)}} >
                            <div className="aspect-video overflow-hidden">
                                <img 
                                    src={item.imageUrl} 
                                    alt="event" 
                                    className='w-full h-full object-cover' 
                                />
                            </div>
                            <div className='flex flex-col gap-3 bg-[#1A1818] p-4 h-48 md:h-52'>
                                <p className='font-medium font-euclid text-[#fff] text-sm md:text-base'>{item.topic}</p>
                                <p className='font-semibold font-euclid text-[#fff] text-lg md:text-xl line-clamp-2'>{item.title}</p>
                                <p className='font-euclid text-[#fff] font-medium text-xs md:text-sm'>
                                    {item.createdAt?.toDate().toDateString()}
                                </p>
                            </div>
                        </div>
                    )) : 
                    <p className='text-xl md:text-2xl text-white text-center font-euclid font-semibold'>No Blogs Available</p>
                }
            </div>
        </div>
 
  )
}

export default Blog