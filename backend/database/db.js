import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
});

const testConnection = async () => {
    try {
        await db.getConnection();
        console.log("Database connected");
    } catch (error) {
        console.log("Error connecting to database", error);
    }
}

const query = async (query, value) => {
    try {
        const [rows] = await db.query(query, value);
        return rows;
    } catch (error) {
        console.log(error);
    }
}

export { testConnection, query };