const cloudinary = require('cloudinary').v2;
const ApiError = require('../utils/ApiError');

// Configure Cloudinary once on load
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class UploadService {
  async uploadImage(file, folder = 'soulsupport') {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: 'image',
            transformation: [
              { width: 1000, height: 1000, crop: 'limit' },
              { quality: 'auto' },
              { fetch_format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) {
              reject(new ApiError(500, 'Failed to upload image'));
            } else {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
              });
            }
          }
        );

        uploadStream.end(file.buffer);
      });
    } catch (error) {
      throw new ApiError(500, 'Failed to upload image');
    }
  }

  async deleteImage(publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  }
}

module.exports = new UploadService();
