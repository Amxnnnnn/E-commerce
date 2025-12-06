import express, { Express } from 'express';
import { PORT } from './secret.validator'
import rootRouter from './routes/index.route'
import { errorMiddleware } from './middleware/error.mid';
import { connectDatabase, prismaClient } from './prisma_connection';
import { setupSwagger } from './swagger';

const app: Express = express()

app.use(express.json())

export { prismaClient }

// Setup Swagger API Documentation
setupSwagger(app);

app.use('/api', rootRouter)

app.use(errorMiddleware)


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
