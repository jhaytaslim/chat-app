import { createServer } from 'http'
import config from 'config'
import { Server } from 'socket.io'
import express from 'express'
import cors from 'cors'

const corsOrigin = config.get<string>('corsOrigin')
const app = express()

app.use(express.json({ limit: '100mb'}))
app.use(express.urlencoded({ limit: '100mb', extended:true }))
app.use(express.static('public'))
app.use(cors({
  origin: corsOrigin,
  credentials: true
}))

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    credentials: true
  }
})

export {app, httpServer, io}