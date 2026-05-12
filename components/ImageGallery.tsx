'use client'

import { useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

export default function ImageGallery({ images, name }: { images: any[], name: string }) {
  const [selected, setSelected] = useState(0)

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={urlFor(images[selected]).width(800).height(800).url()}
          alt={`${name} - image ${selected + 1}`}
          width={800}
          height={800}
          className="w-full h-full object-cover transition duration-300"
        />
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelected(index)}
              className={`flex-shrink-0 w-20 h-20 overflow-hidden border-2 transition ${
                selected === index ? 'border-gray-900' : 'border-transparent'
              }`}
            >
              <Image
                src={urlFor(image).width(200).height(200).url()}
                alt={`${name} thumbnail ${index + 1}`}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}