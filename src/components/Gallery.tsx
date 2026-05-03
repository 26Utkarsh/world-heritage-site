import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { cn } from '../utils/helpers';

interface GalleryProps {
  images: string[];
  name: string;
}

export default function Gallery({ images, name }: GalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {images.map((img, idx) => (
          <div key={idx} className="group relative overflow-hidden rounded-2xl bg-zinc-100 aspect-[4/3]">
            <img 
              src={img} 
              alt={`${name} - image ${idx + 1}`} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
              onClick={() => openModal(idx)}
              loading={idx === 0 ? "eager" : "lazy"}
            />
            <button 
              onClick={() => openModal(idx)}
              className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-center bg-black/opacity-0 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100"
            >
              <Maximize2 className="h-8 w-8 text-white drop-shadow-md" />
            </button>
          </div>
        ))}
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div className="absolute top-4 right-4 z-50">
            <button 
              onClick={closeModal}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="absolute left-4 z-50">
             <button 
              onClick={prevImage}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          </div>

          <div className="absolute right-4 z-50">
             <button 
              onClick={nextImage}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>

          <div 
            className="flex h-full w-full items-center justify-center p-4 sm:p-12"
            onClick={(e) => e.stopPropagation()}
          >
             <div className="relative max-h-full max-w-7xl overflow-hidden rounded-xl bg-zinc-900 shadow-2xl">
               <img 
                 key={currentIndex}
                 src={images[currentIndex]} 
                 alt={`${name} - fullsize ${currentIndex + 1}`} 
                 className="max-h-[85vh] w-auto max-w-full object-contain transition-all duration-300"
               />
               <div className="absolute bottom-0 inset-x-0 flex justify-center bg-gradient-to-t from-black/80 to-transparent p-4">
                 <p className="text-white text-sm font-medium drop-shadow-md">
                   {currentIndex + 1} / {images.length}
                 </p>
               </div>
             </div>
          </div>
        </div>
      )}
    </>
  );
}
