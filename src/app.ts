import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import config from 'config'
import logger from './utils/logger'
import { version } from '../package.json'


import { nanoid } from "nanoid";
import {users,rooms,Room, User} from './utils/data'
import socket from './socket'
import { createRoom } from './service'
import controller from './controller'
import { app, httpServer, io } from './startup'

const port = config.get<number>('port')
const host = config.get<string>('host')

app.use("/", controller);

httpServer.listen(port, host, () => {
  logger.info(`🚀 Server version ${version} is listening 🚀`)
  logger.info(`http://${host}:${port}`)

  socket({ io })
})
