import express from 'express'
import { createCard, unlockCard, getTransactions, blockCard, unblockCard } from '../controllers/cardCreationController'
const router=express.Router()

router.post('/cardcreation',createCard)
router.post('/unlockCard',unlockCard);
router.post('/getTransactions',getTransactions)
router.post('/blockCard',blockCard)
router.post('/unblockCard',unblockCard)

export default router