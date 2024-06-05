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
export const uploadVideoToCloudinary= (video:string, uploadType:string) => {
    useCloudinaryConfig();
    return new Promise( async (resolve, reject) => {
        await cloudinary.v2.uploader.upload(video, { resource_type: "video", folder: `${uploadType}` }, (err, res) => {
            if (err) reject(err);
            else resolve(res?.secure_url);
        })
    });
}

export const uploadAudioToCloudinary = (audio:string, uploadType:string) => {
    useCloudinaryConfig();
    return new Promise( async (resolve, reject) => {
        await cloudinary.v2.uploader.upload(audio, { resource_type: "video", folder: `${uploadType}` }, (err, res) => {
            if (err) reject(err);
            else resolve(res?.secure_url);
        })
    });
}

export const generateRandomString = (length:number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}