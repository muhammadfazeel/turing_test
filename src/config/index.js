import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const envFound = dotenv.config();

if (envFound.error) {
    // This error should crash whole process
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {

    port: parseInt(3002, 10),
    databaseURL: process.env.MONGODB_URI,
    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },
    api: {
        prefix: '/api',
    }
};
