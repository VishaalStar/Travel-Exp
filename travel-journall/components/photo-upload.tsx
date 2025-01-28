"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"
import Image from "next/image"
import { storage } from "@/lib/auth"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import type { Photo } from "@/types/journal"

interface PhotoUploadProps {
  onPhotosUploaded: (photos: Photo[]) => void
}

export function PhotoUpload({ onPhotosUploaded }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true)
      const uploadedPhotos: Photo[] = []

      try {
        for (const file of acceptedFiles) {
          const storageRef = ref(storage, `photos/${Date.now()}-${file.name}`)

          // Upload file
          await uploadBytes(storageRef, file)

          // Get download URL
          const url = await getDownloadURL(storageRef)

          uploadedPhotos.push({
            id: storageRef.fullPath,
            url,
            tags: [],
          })
        }

        onPhotosUploaded(uploadedPhotos)
      } catch (error) {
        console.error("Error uploading photos:", error)
      } finally {
        setUploading(false)
        setUploadProgress({})
      }
    },
    [onPhotosUploaded],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    multiple: true,
  })

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
        transition-colors duration-200
        ${isDragActive ? "border-zinc-900 bg-zinc-900/5 dark:border-zinc-50 dark:bg-zinc-50/5" : "border-gray-300 hover:border-zinc-900 dark:hover:border-zinc-50"}
      `}
    >
      <input {...getInputProps()} />
      <Upload className="w-10 h-10 mx-auto mb-4 text-gray-400" />
      {isDragActive ? (
        <p>Drop the photos here...</p>
      ) : (
        <div>
          <p className="text-lg font-medium">Drag & drop photos here</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">or click to select files</p>
        </div>
      )}
      {uploading && (
        <div className="mt-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Uploading...</p>
        </div>
      )}
    </div>
  )
}

