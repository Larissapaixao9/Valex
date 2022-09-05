import express from 'express'
import Joi from 'joi'
import * as services from '../services/cardCreationService'
import * as companyService from '../services/companyService'
import { Request, Response } from 'express'
import * as cardCreationValidations from '../validations/cardCreationValidations'

export async function createCard(req:Request, res:Response){
    const {typeOfCards, id}=req.body;
    const apiKey = req.headers['x-api-key'] as string;

   try {
    const verifyApiKey = await companyService.validateApiKey(apiKey)
    const validateCardCreation = await cardCreationValidations.cardCreationValidations(id,typeOfCards)
    const r = await services.getEmployee(id,typeOfCards);
    console.log(r)
     return res.status(200).send({
        "message":"cartão criado com sucesso. Mais detalhes no console"
     })
    
   } catch (error) {
    console.log(error)
    return res.status(500).send(error)
   }    
}
export async function unlockCard(req:Request,res:Response){
    const { id, cvc } = req.body
  
    try {
        const cardRowCount = await services.findCard(id,cvc)
        console.log(cardRowCount)

        return res.status(200).send(cardRowCount)
        
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

export async function getTransactions(req:Request,res:Response){
    const { id } = req.body;
    if(!id){
        return res.sendStatus(404);
    }
    try {

        const allTransactions = await services.getTransactions(id);
        console.log(allTransactions)
        const rechargeData = await services.getRechargesData(id);
        const paymentsData = await services.getPaymentsData(id);

        let balence = (rechargeData.recharges_amount - paymentsData.payments_amount)
        res.status(200).send({
            "balance":balence,
            "transactions": paymentsData.payments,
            "recharges": rechargeData.rechargeData
        });

        
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}
export async function blockCard(req:Request,res:Response){
    const { id, password } = req.body
    try {
        const verifyCard = await services.verifyCard(id);
        const verifyExpiredCard = await services.verifyExpiredCard(id);
        const verifyLockedCard = await services.isCardLocked(id);
        const verifyPassword = await services.verifyPassword(id,password);
        const blockTheCard = await services.blockCard(id,verifyPassword.password);

        return res.status(200).send({
            "resultado":"cartão Bloqueado com sucesso"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

export async function unblockCard(req:Request,res:Response){
    const { id, password } = req.body;

    try {
        const verifyCard = await services.verifyCard(id);
        const verifyExpiredCard = await services.verifyExpiredCard(id);
        const verifyLockedCard = await services.isCardUnlocked(id);
        const verifyPassword = await services.verifyPassword(id,password);
        const unblockTheCard = await services.unblocktheCard(id,verifyPassword.password);

        return res.status(200).send({
            "resultado":"cartão desbloqueado com sucesso"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }
}
