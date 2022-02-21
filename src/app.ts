import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import config from 'config'
import logger from './utils/logger'
import { version } from '../package.json'

import { nanoid } from "nanoid";

import socket from './socket'

const port = config.get<number>('port')
const host = config.get<string>('host')
const corsOrigin = config.get<string>('corsOrigin')

const app = express()
app.use(express.json({ limit: '100mb'}))
app.use(express.urlencoded({ limit: '100mb', extended:true }))
app.use(express.static('public'))

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    credentials: true
  }
})

const convertObjectToArray = (object: any) => {
  return [...Object.values(object)]
}

const Users: Record<string, { name: string, id:string,username:string }> = {};
const Talks: Record<string, { name: string, id:string,attendees: Array<Object> }> = {};

app.get('/', (_, res) =>
  res.send(`Server is up and running version ${version}`)
)

app.post('/user', (req, res, next) => {
  const _id = nanoid();
  Users[_id] = {...req.body, _id};
  res.send({data: convertObjectToArray(Users), msg: "User added successfully"})
  return next()
})

app.post('/talk', (req, res, next) => {
  const _id = nanoid();
  Talks[_id] = {...req.body, _id};
  res.send({data: convertObjectToArray(Talks), msg: "Talk added successfully"})
  return next()
})

app.post('/talk/attendee', (req, res, next) => {
  const {talkId, userId} = req.body;
    
  if(!Talks[talkId]?.attendees){
    Talks[talkId].attendees = []
  }

  Talks[talkId].attendees.push(Users[userId]) 
  res.send({data: convertObjectToArray(Talks), msg: "Attendee added to talk successfully"})
  return next()
})

app.delete('/talk/:talkId', (req, res, next) => {
  const _id = req.params.talkId;
  delete Talks[_id]
  res.send({data: convertObjectToArray(Talks), msg: `Talk ${_id} deleted successfully`})
  return next()
})

httpServer.listen(port, host, () => {
  logger.info(`🚀 Server version ${version} is listening 🚀`)
  logger.info(`http://${host}:${port}`)

  socket({ io })
})
