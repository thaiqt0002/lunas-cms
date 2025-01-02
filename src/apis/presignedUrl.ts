import axios from 'axios'

/**
 * @param {string} url - The presigned url to upload the file
 * @param {File} file - The file to upload
 * @returns {Promise<void>} - The response of the request
 */
const presignedUrl = async (url: string, file: File): Promise<void> => {
  try {
    await axios.put(url, file, {
      headers: {
        'Content-Type': file.type,
      },
    })
    // eslint-disable-next-line no-console
  } catch (error: any) {
    throw new Error(error)
  }
}
export { presignedUrl }
