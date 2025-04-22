import multer from "multer";
import path from "path";
import {v2 as cloudinary} from "cloudinary";    

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(process.cwd(), "uploads"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });




  export const fileUploader = {
    upload
  };