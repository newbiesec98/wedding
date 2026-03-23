export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

export function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180
}

/**
 * Returns a new Blob representing the cropped image.
 *
 * @param {string} imageSrc - The source of the image to crop
 * @param {Object} pixelCrop - The cropping area {x, y, width, height}
 */
export default async function getCroppedImg(
  imageSrc,
  pixelCrop,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  // Calculate bounding box of the rotated image
  const bBoxWidth =
    Math.abs(Math.cos(getRadianAngle(rotation))) * image.width +
    Math.abs(Math.sin(getRadianAngle(rotation))) * image.height
  const bBoxHeight =
    Math.abs(Math.sin(getRadianAngle(rotation))) * image.width +
    Math.abs(Math.cos(getRadianAngle(rotation))) * image.height

  // Set canvas size to match the bounding box
  canvas.width = bBoxWidth
  canvas.height = bBoxHeight

  // Translate canvas context to a central location to allow rotating and flipping
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(getRadianAngle(rotation))
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
  ctx.translate(-image.width / 2, -image.height / 2)

  // Draw rotated image
  ctx.drawImage(image, 0, 0)

  // Extract the cropped image data from the bounding box
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  )

  // Set canvas size to the final cropped size
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // Paste generated image data directly
  ctx.putImageData(data, 0, 0)

  // Return as a Promise resolving to a Blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      resolve(file)
    }, 'image/jpeg', 0.9)
  })
}
