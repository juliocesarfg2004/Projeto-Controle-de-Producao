import express from 'express'
import cors from 'cors'
import usersRouter from './routes/usuarios.js'
import produtosRouter from './routes/produtos.js'
import produtosTiposRouter from './routes/produtosTipos.js'
import ordemProducaoRouter from './routes/ordemProducao.js'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.use('/', usersRouter)
app.use('/', produtosRouter)
app.use('/', produtosTiposRouter)
app.use('/', ordemProducaoRouter)

app.listen(port, () => console.log(`Servidor rodando na porta http://localhost:${port}`))