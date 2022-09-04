import express from 'express'
import * as companyRepository from '../repositories/companyRepository'

export async function validateApiKey(apykey:string){
    const isValidKey = await companyRepository.getapikey(apykey);
    if(!isValidKey){
        throw Error('Api Key inválida')
    }
}
