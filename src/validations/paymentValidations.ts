import Joi from "joi";

export async function PaymentValidation(cardId:number, amount:number, password:any, companyId:number) {
    const schema_for_payment = Joi.object({
        // allow only certain values
        cardId:Joi.required(),
        password: Joi.required(),
        companyId:Joi.required(),
        amount:Joi.number().min(1)

    })
    const validation = schema_for_payment.validate({cardId,amount,password,companyId});
    const { error } = validation;
    if(error){
        console.log(error)
        throw Error('Erro de validação')
   }
  
}