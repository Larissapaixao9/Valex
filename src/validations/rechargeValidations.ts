import Joi from "joi";

export async function rechargeValueValidation(id:number, rechargeValue:number) {
    const schema_for_rechargeValue = Joi.object({
        // allow only certain values
        id:Joi.required(),
        rechargeValue: Joi.number().min(1),
    })
    const validation = schema_for_rechargeValue.validate({id,rechargeValue});
    const { error } = validation;
    if(error){
        console.log(error)
        throw Error('Erro de validação')
   }
  
}