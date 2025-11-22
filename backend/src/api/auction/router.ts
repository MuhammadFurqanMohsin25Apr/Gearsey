import { 
  cancelAuction, 
  closeAuction, 
  deleteAuction, 
  getAuctions, 
  updateAuction,
  getAuctionById
} from '@/controllers/auction/auction-controller.js';
import express from 'express';

const router = express.Router();

router.get('/', getAuctions);
router.get('/:auctionId', getAuctionById);
router.put('/:auctionId', updateAuction);
router.put('/close', closeAuction);
router.put('/cancel', cancelAuction);
router.delete('/:auctionId', deleteAuction);


export default router;