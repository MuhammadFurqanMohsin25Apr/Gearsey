import { cancelAuction, closeAuction, deleteAuction, getAuctions, updateAuction } from '@/controllers/auction/auction-controller.js';
import express from 'express';

const router = express.Router();

// router.use('bids', bidsRouter);

router.get('/', getAuctions);
router.put('/', updateAuction);
router.put('/close', closeAuction);
router.put('/cancel', cancelAuction);
router.delete('/', deleteAuction);


export default router;