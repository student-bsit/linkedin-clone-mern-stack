import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public'); // Or './uploads' — just make sure this exists
  },
  
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // to avoid name conflicts
  }
});
console.log("mutlter  ma hon",storage)

const upload = multer({ storage }); // ✅ lowercase 'storage'

export default upload;
