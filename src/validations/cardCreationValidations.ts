import Joi from "joi";

export async function cardCreationValidations(id:number,typeOfCards:string){
    const schema_for_cardCreation = Joi.object({
        // allow only certain values
        id:Joi.required(),
        typeOfCards: Joi.string().valid('groceries','restaurants','transport','education','health').required(),
    })

    const validation = schema_for_cardCreation.validate({id,typeOfCards});
    const { error } = validation;
    if(error){
        throw Error('Erro de validação dos dados de criação do cartão')
   }
}