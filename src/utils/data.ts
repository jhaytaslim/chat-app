
interface User { name: string, _id:string,username:string }
interface Room { name: string, _id:string,attendees: Array<Object> }

const users: Record<string, User> = {};
const rooms: Record<string, Room> = {};


export  {users,rooms,User,Room }