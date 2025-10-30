"use client"

import Image from "next/image"

interface PostImagePreviewProps {
  src: string
  alt: string
}

export function PostImagePreview({ src, alt }: PostImagePreviewProps) {
  return (
    <Image src={src} alt={alt} fill sizes="80px" className="object-cover" />
  )
}