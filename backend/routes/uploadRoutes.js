import path from 'path';
import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';

const router = express.Router();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use the uploads folder in the root directory
    cb(null, path.join(__dirname, '../../uploads'));
  },

  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post('/', upload.single('image'), (req, res) => {
  if (req.file) {
    res.status(200).json({
      message: 'Image uploaded successfully',
      image: `/uploads/${req.file.filename}`,
    });
  } else {
    res.status(400).json({ error: 'No image uploaded' });
  }
});

export default router;
