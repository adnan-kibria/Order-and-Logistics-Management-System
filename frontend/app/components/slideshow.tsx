"use client";

import { useEffect, useState } from "react";

export default function SlideShow(){
    const images = [
        "/headphone.jpg",
        "/camera.jpg",
        "/shirt.jpg",
        "/pant.jpg",
      ];
    
      const [currentIndex, setCurrentIndex] = useState(0);
    
      useEffect(() => {
        const interval = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
      }, [images.length]);

      return (
        <div className="max-w-sm rounded-lg shadow-2xl overflow-hidden">
            <img
            src={images[currentIndex]}
            className="w-[500px] h-[400px] object-cover transition-all duration-700 ease-in-out"
            alt="Shopping illustration"
            />
        </div>
      );
}