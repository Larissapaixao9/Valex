import express from 'express'
const router = express.Router()
import { doPayment } from '../controllers/paymentController'

router.post('/pay',doPayment)




export default router