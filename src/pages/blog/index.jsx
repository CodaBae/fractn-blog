import React, { useState, useEffect } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { db } from '../../firebase-config'
import { collection, query, where, getDocs } from 'firebase/firestore'

const Blog = () => {
    const [categoryOption, setCategoryOption] = useState("")
    const [loading, setLoading] = useState(false)
    const [yearOption, setYearOption] = useState("")
    const [allBlogs, setAllBlogs] = useState([]) // Store all fetched blogs
    const [filteredBlogs, setFilteredBlogs] = useState([]) // Stores filtered blogs
    const [search, setSearch] = useState("")

    const navigate = useNavigate()

    const handleOptionChange = (e) => {
        setCategoryOption(e.target.value)
    }

    const handleYearChange = (e) => {
        setYearOption(e.target.value)
    }

    const categoryOptions = [
        "Product Guides",
        "Personal Finance & Money Management",
        "Security & Fraud Prevention",
        "Product Updates & Features",
        "Use cases & Testimonials"
    ] 

    const getBlogs = async () => {
        setLoading(true)
        try {
            const blogsRef = collection(db, 'blogs')
            const filters = []
            
            if (categoryOption) {
                filters.push(where('category', '==', categoryOption))
            }
            
            const q = filters.length > 0 
                ? query(blogsRef, ...filters) 
                : blogsRef

            const querySnapshot = await getDocs(q)
            const blogsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            setAllBlogs(blogsData)
            setFilteredBlogs(blogsData)
        } catch (error) {
            console.error("Error fetching blogs: ", error)
        } finally {
            setLoading(false)
        }
    }

    // Apply filters whenever search, year, or allBlogs change
    useEffect(() => {
        let result = [...allBlogs]

        // Apply year filter
        if (yearOption) {
            result = result.filter(item => {
                const createdAtDate = item.createdAt?.toDate()
                if (!createdAtDate) return false
                return createdAtDate.getFullYear().toString() === yearOption
            })
        }

        // Apply search filter
        if (search) {
            const searchLower = search.toLowerCase()
            result = result.filter(item => item.topic?.toLowerCase().includes(searchLower))
        }

        setFilteredBlogs(result)
    }, [search, yearOption, allBlogs])

    // Fetch blogs when category changes
    useEffect(() => {
        getBlogs()
    }, [categoryOption])

    return (
        <div className='w-full'>
            <div className="flex flex-col items-center mt-20 gap-8 md:gap-20 px-4 md:px-8 lg:px-16 xl:px-32 py-8 md:py-16">
                <p className='text-white font-euclid text-3xl md:text-4xl lg:text-5xl font-bold text-center'>BLOG</p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 w-full max-w-4xl">
                    {/* Topic Select */}
                    <div className="relative w-full md:w-48">
                        <select 
                            value={categoryOption} 
                            onChange={handleOptionChange} 
                            className='bg-gray-100 w-full outline-none h-10 rounded-lg px-3 appearance-none border border-gray-300 text-sm md:text-base'
                        >
                            <option value="">Select Category</option>
                            {categoryOptions.map((item, index) => (
                                <option key={index} value={item}>{item}</option>
                            ))}
                        </select>
                        <FiChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
                    </div>

                    {/* Year Select */}
                    <div className="relative w-full md:w-48">
                        <select 
                            value={yearOption} 
                            onChange={handleYearChange} 
                            className='bg-gray-100 w-full h-10 outline-none rounded-lg px-3 appearance-none border border-gray-300 text-sm md:text-base'
                        >
                            <option value="">All years</option>
                            <option value="2025">2025</option>
                            {/* Add more years as needed */}
                        </select>
                        <FiChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
                    </div>
                </div>

                {/* Search Input */}
                <input 
                    className='w-full lg:max-w-4xl h-[50px] outline-none rounded-lg p-2 border border-gray-300'
                    type='text'
                    placeholder='Search articles...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className={`${filteredBlogs?.length > 0 ? "grid grid-cols-1 md:grid-cols-2 gap-6" :  "flex items-center justify-center"} px-4 md:px-8 lg:px-16 xl:px-32 pb-16`}>
                {loading ? 
                    <p className='text-xl md:text-2xl text-white text-center font-semibold'>Loading Blog...</p> :
                    filteredBlogs.length > 0 ?
                    filteredBlogs.map((item) => (
                        <div key={item.id} className='flex cursor-pointer flex-col h-auto md:h-[28rem] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow' onClick={() => {navigate(`/blog/${item.slug}`, {state: item}), window.scrollTo(0,0)}} >
                            <div className="aspect-video overflow-hidden">
                                <img 
                                    src={item.imageUrl} 
                                    alt="event" 
                                    className='w-full h-full object-cover' 
                                />
                            </div>
                            <div className='flex flex-col gap-3 bg-[#1A1818] p-4 h-48 md:h-52'>
                                <p className='font-medium font-euclid text-[#fff] text-sm md:text-base'>{item.category}</p>
                                <p className='font-semibold font-euclid text-[#fff] text-lg md:text-xl line-clamp-2'>{item.topic}</p>
                                <div className='flex items-center gap-5'>
                                    <div className='flex items-center gap-4'>
                                        <img src={item?.authorImageUrl} alt={item?.author} className="rounded-full w-10 h-10" />
                                        <p className='font-euclid text-[#fff] font-medium text-xs md:text-base'>
                                            {item?.author}
                                        </p>
                                    </div>
                                  
                                    <span className='hidden text-white md:block'>•</span>
                                    <p className='font-euclid text-[#fff] font-medium text-xs md:text-sm'>
                                        {item.createdAt?.toDate().toDateString()}
                                    </p>
                                </div>
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