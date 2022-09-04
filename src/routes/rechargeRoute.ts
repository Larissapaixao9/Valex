import express from 'express'
const router = express.Router()
import { rechargeCard } from '../controllers/rechargeControlle'

router.post('/recharge',rechargeCard)




export default router