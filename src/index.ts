import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/UserRoutes";

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

AppDataSource.initialize().then(() => {
    console.log("Database connected!");

    app.get('/', async (req, res) => {
        res.send('Server is running');
    });

    // Use user routes
    app.use('/api', userRoutes);

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(error => console.log(error));