import express from 'express'
import * as companyService from '../services/companyService'
import * as services from '../services/cardCreationService'
import * as rechargeServices from '../services/rechargeService'
import * as rechargeValidation from '../validations/rechargeValidations'
import { Request, Response } from 'express'

export async function rechargeCard(req:Request,res:Response){
    const { id, rechargeValue } = req.body;

    const apiKey = req.headers['x-api-key'] as string;
    console.log(apiKey)

    try {
        const verifyApiKey = await companyService.validateApiKey(apiKey)
        const validation = await rechargeValidation.rechargeValueValidation(id,rechargeValue);
        const verifyCard = await services.verifyCard(id);
        const verifyActivatedCard = await rechargeServices.verifyActivatedCard(id)
        const verifyExpiredCard = await services.verifyExpiredCard(id);
        const insertRecharge = await rechargeServices.insertRecharge(id,rechargeValue)

        return res.status(200).send(apiKey)
        
    } catch (error:any) {
        console.log(error);
        return res.status(500).send({
            "message":error[0]
        })
    }
}