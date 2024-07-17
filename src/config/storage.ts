import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from 'path';
import { Request } from "express";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

export const upload = (folderName: string) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      const folder = path.join(__dirname, folderName)
      const format = path.extname(file.originalname).substring(1)
      const public_id = new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname

      return { folder, public_id, format }
    }
  })

  const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }

  return multer({
    storage,
    limits: { fieldSize: 5 * 1024 * 1024 }, // Image sizes must be less than 5MB
    fileFilter
  })
}