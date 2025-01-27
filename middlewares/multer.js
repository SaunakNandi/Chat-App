import multer from "multer"

const multerUpload=multer({limits:{fileSize:1024*1024*100}}) //100mb

// image upload
export const singleAvatar=multerUpload.single("avatar")

// file upload
export const attachments=multerUpload.array('files',6)