import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cardrouters from './routes/cardRoute'
import rechargeRouters from './routes/rechargeRoute'
import PaymentRouters from './routes/paymentRoute'
//import bodyParser from 'body-parser'
dotenv.config()
const app = express()

//middlewares

app.use(cors())
app.use(express.json())
app.use(cardrouters)
app.use(rechargeRouters)
app.use(PaymentRouters)
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({
//     extended: true
//   }))



const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>console.log(`rodando na porta ${PORT}`))