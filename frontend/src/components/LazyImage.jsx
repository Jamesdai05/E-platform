import { useState, useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap';

const LazyImage = ({ src, alt, style, className, variant = "top" }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

//   for resetting the states when image src changes.
  useEffect(() => {
    // Reset states when src changes
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  useEffect(() => {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: load image immediately if IntersectionObserver is not supported
      setIsInView(true);
      return;
    }
    // create oberver for the loading.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01,
      }
    );

    const currentRef = imgRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  return (
    <div ref={imgRef} style={{ position: 'relative', ...style }}>
      {/* Loading Placeholder - only show when image is in view but not loaded yet */}
      {isInView && !isLoaded && !hasError && (
        <div
          style={{
            ...style,
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '14px',
          }}
        >
          Loading...
        </div>
      )}

      {/* Error Placeholder - only show when there's actually an error */}
      {hasError && (
        <div
          style={{
            ...style,
            backgroundColor: '#f8f8f8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            fontSize: '14px',
            border: '1px solid #ddd',
          }}
        >
          Image not available
        </div>
      )}

      {/* Actual Image */}
      {isInView && !hasError && (
        <Card.Img
          variant={variant}
          src={src}
          alt={alt}
          className={className}
          style={{
            ...style,
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy" // Native browser lazy loading as fallback
        />
      )}
    </div>
  );
};

export default LazyImage;
