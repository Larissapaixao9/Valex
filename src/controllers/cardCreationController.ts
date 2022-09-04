import express from 'express'
import Joi from 'joi'
import * as services from '../services/cardCreationService'
import { Request, Response } from 'express'
//import { validatecardtype } from '../services/cardCreationService'

const schema_for_cardCreation = Joi.object({
      // allow only certain values
      id:Joi.required(),
      typeOfCards: Joi.string().valid('groceries','restaurants','transport','education','health').required(),
  })

  const schema_for_unlockCard = Joi.object({
    id:Joi.number().required(),
    cvc:Joi.number().required()
  })


export async function createCard(req:Request, res:Response){
    const {typeOfCards}=req.body;
    const apiKey = req.headers['x-api-key'] as string;


    const{ id } = req.body;
    const validation = schema_for_cardCreation.validate(req.body);
    const { error } = validation;
    if(error){
        return res.status(422).send(error)
   }
   try {
    const r = await services.getEmployee(id,typeOfCards);
    console.log(r)
     return res.sendStatus(200)
    
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

        //const existinfCardById = await services.findCardById(id)
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
        //const getRecharges = await services
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