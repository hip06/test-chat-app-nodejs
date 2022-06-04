import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import http from 'http'
let app = express()
dotenv.config()
app.use(cors({ origin: process.env.URL_REACT_APP }))
let server = http.createServer(app)
let io = new Server(server, {
    cors: {
        origin: process.env.URL_REACT_APP,
        methods: ["GET", "POST"]
    }
})
app.get('/', (req, res) => {
    return res.send('hello')
})

io.on('connection', (socket) => {
    let uniqRoom
    socket.on('join-room', (data) => {
        if (data.prev) {
            socket.leave(data.prev)
        }
        socket.join(data.room)
        console.log(`userID ${socket.id} joined the room ${data.room}`);


    })
    socket.on('send-message', (data) => {
        socket.to(data.room).emit('receive-message', data)
    })
    socket.on('disconnect', () => {
        console.log('disconnected: ' + socket.id);
    })
})


let port = process.env.PORT || 1234
server.listen(port, () => console.log('connected : ' + port))

