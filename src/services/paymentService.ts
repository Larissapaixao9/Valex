import express from 'express'
import * as companyRepository from '../repositories/companyRepository'
import * as cardRepository from '../repositories/cardRepository'
import * as rechargeRepository from '../repositories/rechargesRepository'
import * as paymentRepository from '../repositories/paymentsRepository'

export async function getById(id:number){
    const businessId = await paymentRepository.getById(id);
    if(!businessId){
        throw Error('empresa não cadastrada')
    }
}

export async function verifyifTypesMatches(cardId:number,businessId:number){
    const cardType = await paymentRepository.getCardType(cardId);
    console.log(cardType.type)

    const businessType = await paymentRepository.getBusinessType(businessId);
    console.log(businessType.type)
    if(cardType.type!=businessType.type){
        throw Error('O cartão e a empresa possuem tipos distintos')
    }
}

export async function verifyFunds(rechargeAmount:number, paymentAmount:number, amount:number){
    let balance = rechargeAmount - paymentAmount - amount;
    if(balance<0){
        throw Error('Saldo insuficiente')
    }
}

export async function insertPayment(cardId:number,businessId:number,amount:number){
    const paymentInserted = await paymentRepository.insertNewPayment(cardId,businessId,amount);
    console.log(paymentInserted);
    return paymentInserted
}