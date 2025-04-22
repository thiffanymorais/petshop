import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes.js'

dotenv.config()
const app = express()
const port = process.env.PORT || 3000


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) //permite envio por forms com action
app.use(express.static('public')) //Adicione isso para servir os HTMLs
app.use('/api', routes)

app.listen(port, ()=>{
    console.log(`Servidor Rodando em: http://localhost:${port}`)
})