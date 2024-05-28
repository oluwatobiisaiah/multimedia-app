import cloudinary from 'cloudinary';
import { useCloudinaryConfig } from '../config/cloudinary';

export const uploadToCloudinary = (image:string, uploadType:string) => {
    useCloudinaryConfig();
    return new Promise( async (resolve, reject) => {
        await cloudinary.v2.uploader.upload(image, { folder: `${uploadType}` }, (err, res) => {
            if (err) reject(err);
            else resolve(res?.secure_url);
        })
    });
}