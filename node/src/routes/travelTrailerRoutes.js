import { Router } from 'express';
import { selectTrailer, listTrailers } from '../controllers/travelTrailerController.js';

const router = Router();
router.get('/select', selectTrailer);
router.get('/', listTrailers);
export default router;
