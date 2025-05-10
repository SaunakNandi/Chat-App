export const corsOptions={
    origin:['http://localhost:5173','http://localhost:4173','http://localhost:5174',process.env.CLIENT_URL],
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    credentials:true,  // so that we can send header 
}

export const chat_token='chat_token'