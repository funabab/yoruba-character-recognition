import React, { useEffect, useState } from 'react'
import { useCharacterImageClassifier } from './hooks/useCharacterImageClassifier'
import { useDropzone } from 'react-dropzone'
import clsx from 'clsx'

interface Props {}

const App: React.FC<Props> = () => {
  const [uploadedFile, setUploadedFile] = useState<File | undefined>()
  const [prediction, setPredicttion] = useState<
    { label: string; accuracy: number } | undefined
  >()
  const [uploadImageUrl, setUploadedImageUrl] = useState<string | undefined>()

  const { isDragReject, getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    multiple: false,
    onDropAccepted: (files) => {
      setUploadedFile(files[0])
    },
  })
  const { isLoading, predict } = useCharacterImageClassifier()

  useEffect(() => {
    let url: string | undefined
    if (uploadedFile) {
      url = URL.createObjectURL(uploadedFile)
      setUploadedImageUrl(url)
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url)
      }
    }
  }, [uploadedFile])

  useEffect(() => {
    if (uploadImageUrl) {
      const elImage = document.createElement('img')
      elImage.onload = async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result = await predict(elImage)
        setPredicttion(result)
      }
      elImage.src = uploadImageUrl
    }
  }, [uploadImageUrl, predict])

  return (
    <div
      {...getRootProps()}
      className={clsx(
        'text-2xl w-screen h-screen flex flex-col justify-center items-center gap-y-5 border-4 border-white border-dashed',
        {
          'border-red-600': isDragReject,
        }
      )}
    >
      <input type="hidden" className="hidden" {...getInputProps()} />
      {!prediction && <strong>Drag Image here or Click to Upload</strong>}

      {uploadImageUrl && <img src={uploadImageUrl} className="h-40" />}

      <p>
        {isLoading
          ? 'Loading...'
          : prediction &&
            `Prodiction: ${
              prediction.label
            }, Accuracy: ${prediction.accuracy.toFixed(2)}%`}
      </p>
    </div>
  )
}

export default App
