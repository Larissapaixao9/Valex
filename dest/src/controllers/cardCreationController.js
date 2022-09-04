"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCard = void 0;
const joi_1 = __importDefault(require("joi"));
//import { validatecardtype } from '../services/cardCreationService'
const schema_for_cardCreation = joi_1.default.object({
    // allow only certain values
    typeOfCards: joi_1.default.string().valid('groceries', 'restaurants', 'transport', 'education', 'health').required(),
});
function createCard(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { typeofcard } = req.body;
        const validation = schema_for_cardCreation.validate(req.body);
        const { error } = validation;
        if (error) {
            return res.status(422).send(error);
        }
        return res.sendStatus(200);
        // const result =await  validatecardtype(req.body);
        // if(result===1){
        //     return res.send('tudo certo na criação');
        // }
        // else{
        //     return res.sendStatus(404);
        // }
    });
}
exports.createCard = createCard;
