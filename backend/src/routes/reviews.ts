import { Router, Request } from 'express';
import { ReviewController } from '../controllers/ReviewController';
import { authenticate } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// prepare uploads directory and configure multer storage
const uploadsDir = path.join(__dirname, '..', '..', 'uploads', 'reviews');
try {
  fs.mkdirSync(uploadsDir, { recursive: true });
} catch (err) {
  // ignore errors, multer will fail if needed
}

const storage = multer.diskStorage({
  destination: function (_req: Request, _file: any, cb: any) {
    cb(null, uploadsDir);
  },
  filename: function (_req: Request, _file: any, cb: any) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(_file.originalname) || '';
    cb(null, _file.fieldname + '-' + unique + ext);
  }
});

const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: any) => {
    if (allowedMimes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type'), false);
  }
});

// public routes (no authentication needed)
router.get('/public', ReviewController.getPublic);

// all routes below require authentication
router.use(authenticate);

router.post('/', ReviewController.create);
router.get('/:bookingId', ReviewController.getByBooking);

// allow image uploads for a given review id (owner or admin)
router.post('/:id/images', upload.array('images', 5), ReviewController.uploadImages);

// admin only
router.get('/admin/all', ReviewController.listAll);
router.put('/admin/:id/approve', ReviewController.approve);
router.delete('/admin/:id', ReviewController.delete);

export default router;
