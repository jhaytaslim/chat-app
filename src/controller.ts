import express from 'express'
import { nanoid } from 'nanoid'
import { version } from '../package.json'
import { createRoom } from './service'
import { rooms, users } from './utils/data'
import { io } from './startup'

const router = express.Router();

const convertObjectToArray = (object: any) => {
  return [...Object.values(object)]
}

router.get('/', (_, res) =>
  res.send(`Server is up and running version ${version}`)
)

router.post('/user', (req, res, next) => {
  const _id = nanoid()
  users[_id] = { ...req.body, _id }
  res.send({
    data: convertObjectToArray(users),
    msg: 'User added successfully'
  })
  return next()
})

router.post('/talk', (req, res, next) => {
  const _id = nanoid()
  const newRooms = createRoom({ ...req.body, _id })

  res.send({
    data: convertObjectToArray(newRooms),
    msg: 'Talk added successfully'
  })
  return next()
})

router.post('/talk/attendee', (req, res, next) => {
  const { talkId, userId } = req.body

  if (!rooms[talkId]?.attendees) {
    rooms[talkId].attendees = []
  }

  rooms[talkId].attendees.push(users[userId])
  res.send({
    data: convertObjectToArray(rooms),
    msg: 'Attendee added to talk successfully'
  })
  return next()
})

router.delete('/talk/:talkId', (req, res, next) => {
  const _id = req.params.talkId
  delete rooms[_id]
  res.send({
    data: convertObjectToArray(rooms),
    msg: `Talk ${_id} deleted successfully`
  })
  return next()
})

export default router
