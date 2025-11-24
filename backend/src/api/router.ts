import express, { type Request, type Response } from "express";
import ordersRouter from "@/api/orders/router.js";
import paymentRouter from "@/api/payment/router.js";
import listingRouter from "@/api/listing/router.js";
import auctionRouter from "@/api/auction/router.js";
import categoryRouter from "@/api/category/router.js";
import reviewRouter from "@/api/review/router.js";
import usersRouter from "@/api/users/router.js";
import bidsRouter from "@/api/bids/router.js";

const router = express.Router();

router.use("/orders", ordersRouter);
router.use("/payment", paymentRouter);
router.use("/products", listingRouter);
router.use("/auction", auctionRouter);
router.use("/bids", bidsRouter);
router.use("/category", categoryRouter);
router.use("/review", reviewRouter);
router.use("/users", usersRouter);

router.get("/health", (req: Request, res: Response) => {
  res
    .json({
      system: "GO!",
      health: "OK",
      working_endpoints: {
        "/orders": "OK",
        "/payment": "OK",
        "/products": "OK",
        "/auction": "OK",
        "/category": "OK",
        "/review": "OK",
        "/users": "OK",
      },
    })
    .status(200);
});

export default router;
