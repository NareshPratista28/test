import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from "./database/db.js";
import router from "./routes/index.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(process.env.APP_PORT, () => {
    testConnection();
    console.log(`Server running on port http://localhost:${process.env.APP_PORT}`);
})