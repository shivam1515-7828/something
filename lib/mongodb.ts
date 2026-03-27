import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  const uri = process.env.MONGODB_URI;
  
  // Only throw at RUNTIME if someone actually tries to connect without a URI
  if (!uri) {
    if (process.env.NODE_ENV === "production") {
       console.warn("MONGODB_URI is missing. Database connection will fail.");
       return; // Silent fail at build for better deployment, but will fail at actual request
    }
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
