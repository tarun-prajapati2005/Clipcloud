import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI?.trim();

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in your environment variables");

}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
    const uri = MONGODB_URI;

    if (!uri) {
        throw new Error("Please define MONGODB_URI in your environment variables");
    }

    if (cached.conn) {
        return cached.conn
    }
    if (!cached.promise) {
        const opts = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 10000
        }

        cached.promise = mongoose
            .connect(uri, opts)
            .then(() => mongoose.connection)

    }

    try {
        cached.conn = await cached.promise
        return cached.conn
    } catch (error) {
        cached.promise = null
        throw error
    }
}