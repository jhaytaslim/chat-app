import { nanoid } from 'nanoid'
import { Room, rooms } from './utils/data'
import { io } from './startup'
import EVENTS from './utils/event'

const createRoom = (body: Room) => {
  const _id = nanoid()
  rooms[_id] = { ...body, _id }

  const { sockets } = io

  sockets.socketsJoin(_id)

  // broadcast an event saying there is a new room
  //   sockets.broadcast.emit(EVENTS.SERVER.ROOMS, rooms)

  // emit back to the room creator with all the rooms
  sockets.emit(EVENTS.SERVER.ROOMS, rooms)
  // emit event back the room creator saying they have joined a room
  sockets.emit(EVENTS.SERVER.JOINED_ROOM, _id)

  return rooms
}

export { createRoom }
