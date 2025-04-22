//imports
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()
/// Login - Modifique para:
router.post('/login', async(req, res)=>{
    const {email, senha} = req.body  // Alterado para receber email/senha
    try{
        const [users] = await db.execute(
            'SELECT * FROM membro WHERE email = ?',  // Alterado para buscar por email
            [email] 
        )
        const user = users[0]
        if (!user) return res.status(400).json({error: 'Usuário não encontrado'})
        const valid = await bcrypt.compare(senha, user.senha)
        if(!valid) return res.status(401).json({error: 'Senha Incorreta'})
        
        const token = jwt.sign(
            { id: user.id, nome: user.nome, email: user.email },  // Adicionado email
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        
        res.json({
            token,
            user: {  // Adicionado objeto user completo
                id: user.id,
                nome: user.nome,
                email: user.email
            }
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({error: 'Erro ao fazer login'})
    }
})

// Login - Modifique para:
router.post('/login', async(req, res)=>{
    const {email, senha} = req.body  // Alterado para receber email/senha
    try{
        const [users] = await db.execute(
            'SELECT * FROM membro WHERE email = ?',  // Alterado para buscar por email
            [email] 
        )
        const user = users[0]
        if (!user) return res.status(400).json({error: 'Usuário não encontrado'})
        const valid = await bcrypt.compare(senha, user.senha)
        if(!valid) return res.status(401).json({error: 'Senha Incorreta'})
        
        const token = jwt.sign(
            { id: user.id, nome: user.nome, email: user.email },  // Adicionado email
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        
        res.json({
            token,
            user: {  // Adicionado objeto user completo
                id: user.id,
                nome: user.nome,
                email: user.email
            }
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({error: 'Erro ao fazer login'})
    }
})

//Middlewares
function authMiddleware(req, res, next){
    const auth = req.headers.authorization
    if(!auth) return res.status(401).send('Token Ausente')
       const token = auth.split(' ')[1] //inserir um espaço dentro das ''
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    }catch{
        res.status(403).send('Token inválido ou expirado')
    }
}
//Rotas Privadas
router.get('/private', authMiddleware, (req, res)=>{
    res.json({message: `Bem-Vindo, ${req.user.username}`})
})

export default router