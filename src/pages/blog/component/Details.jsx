import React, { useState, useEffect } from 'react'
import {  useLocation, useNavigate, useParams } from 'react-router-dom'
import { 
  collection, 
  query, 
  where, 
  limit, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../../../firebase-config';
import useDocumentHead from "../../../hooks/useDocumentHead"

const Details = () => {
    const { slug } = useParams()
    const { state } = useLocation()
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    console.log(slug, "slug")


    useEffect(() => {
        const fetchPost = async () => {
        try {
            setLoading(true);
            if (!slug) return;

            const blogsRef = collection(db, 'blogs');
            const q = query(blogsRef, where("slug", "==", slug), limit(1));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
            setPost(querySnapshot.docs[0].data());
            } else {
            navigate('/', { replace: true });
            }
        } catch (error) {
            console.error("Error fetching post:", error);
            navigate('/', { replace: true });
        } finally {
            setLoading(false);
        }
        };

        fetchPost();
    }, [slug, navigate]);

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
    
    if (loading) {
        return <div className="text-center py-20 mt-20 font-euclid text-[#6B7280] font-[600] text-base md:text-[18px]">Loading post...</div>;
    }

    if (!post) {
        return <div className="text-center py-20 mt-20 font-euclid text-[#6B7280] font-[600] text-base md:text-[18px]">Post not found</div>;
    }

    return (
        <>
            <main className='w-full px-4 sm:px-6 lg:px-8'>
                <article className='mx-auto mt-20 md:mt-32 gap-6 md:gap-10 flex flex-col max-w-4xl'>
                    <header>
                        <button 
                            onClick={() => {navigate('/'), window.scrollTo(0, 0)}} 
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
                            
                            <div className='flex flex-col md:flex-row items-start gap-5 md:gap-auto md:items-center justify-between'>
                                <div className='flex items-center gap-4'>
                                    <img src={post?.authorImageUrl} alt={post?.author} className="rounded-full w-10 h-10" />
                                    <p className='font-euclid text-[#6B7280] font-[600] text-base md:text-[18px]'>
                                        {post?.author}
                                    </p>
                                </div>
                                <div className='font-euclid text-[#6B7280] text-base md:text-[18px] flex flex-col md:flex-row md:items-center gap-2 md:gap-4'>
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