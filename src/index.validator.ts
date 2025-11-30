import express,{ Express,Request,Response} from 'express';
import {PORT} from './secret.validator'
import rootRouter from './routes/index.route'
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middleware/error.mid';

const app:Express = express()

app.use(express.json())

export const prismaClient = new PrismaClient({
    log:['query']
})

app.use('/api',rootRouter)

app.use(errorMiddleware)

// Database connection check crowwww!

async function connectDatabase(){
    try{
        console.log("Connecting to PostgreSQL Database...")

        // Test the connection
        await prismaClient.$connect();

        console.log("PostgreSQL database connected successfully!");
        return true;
    } catch(error){
        console.error('Failed to connect to PostSQL database: ',error);
        return false
    }
}

// After database connection verification (ki chalra hai ya nhi [considered as a good practice]) Now we can start the main app server!
async function startServer(){
    try{
        const isConnected = await connectDatabase();
        
        if(!isConnected){
            console.error('Server initialization aborted due to database connection failure! ')
            process.exit(1)
        }

        app.listen(PORT,()=>{
            console.log("Express server is running on port : ",PORT);
            console.log(`Server URL: http://localhost:${PORT}`);
        });
    }catch(error){
        console.error(`Failed to start server:`,error);
        process.exit(1);
    }
}

startServer();
