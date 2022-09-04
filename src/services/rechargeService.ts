import express from 'express'
import * as companyRepository from '../repositories/companyRepository'
import * as cardRepository from '../repositories/cardRepository'
import * as rechargeRepository from '../repositories/rechargesRepository'

export async function verifyActivatedCard(id:number) {
    const activatedcard = await cardRepository.getPassword(id);
    console.log(activatedcard)
    if(activatedcard.password==null){
        throw Error('Cartão ainda não foi ativado')
    }
}

export async function insertRecharge(id:number,rechargeValue:number) {
    const insertValue = await rechargeRepository.insertRecharge(id,rechargeValue);
    console.log(insertValue)
    return insertValue
}