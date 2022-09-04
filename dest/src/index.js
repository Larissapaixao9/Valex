"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cardRoute_1 = __importDefault(require("./routes/cardRoute"));
//import bodyParser from 'body-parser'
dotenv_1.default.config();
const app = (0, express_1.default)();
//middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(cardRoute_1.default);
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({
//     extended: true
//   }))
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`rodando na porta ${PORT}`));
