import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

export const useCloudinaryConfig = ()=>{
    cloudinary.v2.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET,
        asset_folder:process.env.CLOUDINARY_ASSET_FOLDER
      });
}
