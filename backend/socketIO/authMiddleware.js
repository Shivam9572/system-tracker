import jwt from "jsonwebtoken";

const JWT_SECRET = "secret"; // use env variable in production

export const socketAuthMiddleware = async (socket, next) => {
  try {
    // Token can come from query or auth headers
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication error: No token"));

    // Verify JWT
    const id = jwt.verify(token, JWT_SECRET);
    
    socket.userId = id; // attach userId to socket
 // save for disconnect
    next();
  } catch (err) {
    console.error(err);
    next(new Error("Authentication error"));
  }
};