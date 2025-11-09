import { createReview, deleteReview, getAllReviews, getProductReviews, getUserReviews } from '@/controllers/review/review-controller.js';
import Express from 'express';


const router = Express.Router();

router.get('/', getAllReviews);
router.get('/:productId', getProductReviews);
router.get('/user/:userId', getUserReviews);
router.post('/', createReview);
router.delete('/:reviewId', deleteReview);

export default router;
