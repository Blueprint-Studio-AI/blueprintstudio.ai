// @/hooks/useViewport.ts
import { useState, useEffect } from 'react';

interface ViewportDimensions {
    width: number;
    height: number;
}

export function useViewport(): ViewportDimensions {
    const [dimensions, setDimensions] = useState<ViewportDimensions>({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return dimensions;
}