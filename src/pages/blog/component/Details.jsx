import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Details = () => {
    const { state } = useLocation()
    const navigate = useNavigate()

    const getFormattedDate = () => {
        if (!state?.createdAt) return '';
    
        // Convert Firestore Timestamp object to a JavaScript Date
        if (typeof state?.createdAt.toDate === 'function') {
            return state?.createdAt.toDate().toDateString();
        }
    
        // Convert Firestore Timestamp-like object to a Date (if it has seconds)
        if (typeof state?.createdAt.seconds === 'number') {
            return new Date(state?.createdAt.seconds * 1000).toDateString();
        }
    
        // Fallback in case of unexpected format
        return new Date(state?.createdAt).toDateString();
    };
    

    return (
        <div className='w-full px-4 sm:px-6 lg:px-8'>
            <div className='mx-auto mt-20 md:mt-32 gap-6 md:gap-10 flex flex-col max-w-4xl'>
                <button 
                    onClick={() => {navigate(-1), window.scrollTo(0, 0)}} 
                    className='bg-white w-28 md:w-32 flex items-center justify-center h-11 rounded-lg hover:opacity-80 transition-opacity'
                >
                    <p className='text-black font-inter text-base md:text-lg'>Back</p>
                </button>
                
                {/* Responsive Image Container */}
                <div className='w-full aspect-video md:aspect-auto md:h-96 overflow-hidden rounded-xl'>
                    <img 
                        src={state?.imageUrl} 
                        className='w-full h-full object-cover' 
                        alt='Blog' 
                    />
                </div>

                <div className='w-full mx-auto space-y-6 md:space-y-10'>
                    <div className='space-y-4 md:space-y-6'>
                        <h1 className='font-euclid text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-snug'>
                            {state?.title}
                        </h1>
                        
                        <div className='font-euclid text-white text-sm md:text-base flex flex-col md:flex-row md:items-center gap-2 md:gap-4'>
                            <span className='font-medium'>{state?.topic}</span>
                            <span className='hidden md:block'>•</span>
                            <span>{getFormattedDate()}</span>
                        </div>

                        <article className='prose prose-invert max-w-none w-full'>
                            <div 
                                dangerouslySetInnerHTML={{ __html: state?.content }} 
                                className='text-white font-euclid text-base md:text-lg leading-relaxed'
                            />
                        </article>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Details