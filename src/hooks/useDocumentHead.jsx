import { useEffect } from 'react';

export default function useDocumentHead({ title, description }) {
  useEffect(() => {
    if (title) document.title = title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (description && metaDescription) {
      metaDescription.setAttribute('content', description);
    }
  }, [title, description]);
}