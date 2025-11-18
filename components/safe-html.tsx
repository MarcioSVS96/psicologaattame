"use client"

import DOMPurify from "isomorphic-dompurify"

interface SafeHTMLProps {
  htmlContent: string
}

export function SafeHTML({ htmlContent }: SafeHTMLProps) {
  const sanitizedHtml = DOMPurify.sanitize(htmlContent || "", {
    ADD_TAGS: ["iframe"], // Permite iframes (ex: YouTube)
  })

  return (
    <div
      className="prose prose-lg max-w-full text-gray-800 leading-relaxed break-words whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  )
}
