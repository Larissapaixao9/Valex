import express from 'express'
import { Request, Response } from 'express'
import * as paymentValidations from '../validations/paymentValidations'
import * as services from '../services/cardCreationService'
import * as rechargeServices from '../services/rechargeService'
import * as paymentServices from '../services/paymentService'

export async function doPayment(req:Request,res:Response) {
    const { cardId,amount,password,companyId } = req.body

    try {
        const validateData = await paymentValidations.PaymentValidation(cardId,amount,password,companyId)
        const verifyCard = await services.verifyCard(cardId);
        const verifyActivatedCard = await rechargeServices.verifyActivatedCard(cardId)
        const verifyExpiredCard = await services.verifyExpiredCard(cardId);
        const veryCardLocked = await services.isCardLocked(cardId);
        const verifyPassword = await services.verifyPassword(cardId,password);
        const verifyBusiness = await paymentServices.getById(companyId);
        const verifyifTypesMatches = await paymentServices.verifyifTypesMatches(cardId,companyId)

        const recharges = await services.getRechargesData(cardId);
        const payments = await services.getPaymentsData(cardId);
        const verifyFunds = await paymentServices.verifyFunds(recharges.recharges_amount,payments.payments_amount,amount)
        const insertPayment = await paymentServices.insertPayment(cardId,companyId,amount)


        return res.status(200).send({
            cardId,
            companyId,
            amount
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }
}