'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from './Lightbox';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <div className="space-y-4">
        <div 
          className="relative h-64 sm:h-80 md:h-96 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={images[selectedIndex]}
            alt={`${title} - Image ${selectedIndex + 1}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 66vw"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-md overflow-hidden ${
                index === selectedIndex ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <Image
                src={image}
                alt={`${title} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 20vw, 10vw"
              />
            </button>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={images}
          initialIndex={selectedIndex}
          title={title}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
