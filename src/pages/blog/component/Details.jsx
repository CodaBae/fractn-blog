import React, { useState, useEffect } from 'react'
import {  useLocation, useNavigate, useParams } from 'react-router-dom'
// import { Helmet } from 'react-helmet-async';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import useDocumentHead from "../../../hooks/useDocumentHead"

const Details = () => {
    const { slug } = useParams()
    const { state } = useLocation()
    const [post, setPost] = useState(null);
    const navigate = useNavigate()

    console.log(slug, "slug")

  
    useEffect(() => {
        const fetchPost = async () => {
        const docRef = doc(db, 'blogs', state?.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setPost(docSnap.data());
        }
    };
    
    fetchPost();
  }, [slug]);

    const getFormattedDate = () => {
        if (!post?.createdAt) return '';
    
        // Convert Firestore Timestamp object to a JavaScript Date
        if (typeof post?.createdAt.toDate === 'function') {
            return post?.createdAt.toDate().toDateString();
        }
    
        // Convert Firestore Timestamp-like object to a Date (if it has seconds)
        if (typeof post?.createdAt.seconds === 'number') {
            return new Date(post?.createdAt.seconds * 1000).toDateString();
        }
    
        // Fallback in case of unexpected format
        return new Date(post?.createdAt).toDateString();
    };

    console.log(post, "max")

    useDocumentHead({
        title: `${post?.topic}`,
        description: `${post?.metaDescription}`
    });
    

    return (
        <>
            {/* <Helmet>
                <title>{post?.topic}</title>
                <meta name="description" content={post?.metaDescription} />
                
                {/* Open Graph 
                <meta property="og:title" content={post?.topic} />
                <meta property="og:description" content={post?.metaDescription} />
                <meta property="og:image" content={post?.imageUrl} />
                
                {/* Twitter Card 
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post?.topic} />
                <meta name="twitter:description" content={post?.metaDescription} />
                <meta name="twitter:image" content={post?.imageUrl} />
            </Helmet> */}
            <main className='w-full px-4 sm:px-6 lg:px-8'>
                <article className='mx-auto mt-20 md:mt-32 gap-6 md:gap-10 flex flex-col max-w-4xl'>
                    <header>
                        <button 
                            onClick={() => {navigate(-1), window.scrollTo(0, 0)}} 
                            className='bg-[#000] border border-[#fff] w-28 md:w-32 flex items-center justify-center h-11 rounded-[15px] hover:opacity-80 transition-opacity'
                        >
                            <p className='text-[#fff] font-inter font-semibold text-base md:text-lg'>Back</p>
                        </button>
                    
                        <div className='w-full aspect-video md:aspect-auto mt-5 md:h-96 overflow-hidden rounded-xl'>
                            <img 
                                src={post?.imageUrl} 
                                className='w-full h-full object-cover' 
                                alt={post?.topic} 
                            />
                        </div>

                        <div className='space-y-4 md:space-y-8 mt-6'>
                            <h1 className='font-euclid text-2xl md:text-4xl lg:text-5xl font-bold text-[#6B7280] leading-snug'>
                                {post?.topic}
                            </h1>
                            
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-4'>
                                    <img src={post?.authorImageUrl} alt={post?.author} className="rounded-full w-10 h-10" />
                                    <p className='font-euclid text-[#6B7280] font-[600] text-xs md:text-[18px]'>
                                        {post?.author}
                                    </p>
                                </div>
                                <div className='font-euclid text-[#6B7280] text-sm md:text-[18px] flex flex-col md:flex-row md:items-center gap-2 md:gap-4'>
                                    <span className='font-medium'>{post?.category}</span>
                                    <span className='hidden md:block'>•</span>
                                    <span>{getFormattedDate()}</span>
                                </div>
                            </div>
                        </div>
                    </header>

                    <section className='prose prose-invert max-w-none w-full'>
                        <div 
                            dangerouslySetInnerHTML={{ __html: post?.content }} 
                            className='text-[#6B7280] font-euclid text-base md:text-lg leading-relaxed'
                        />
                    </section>
                </article>
            </main>
        </>
    )
}

export default Details