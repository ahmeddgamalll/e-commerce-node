const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function runMigrations() {
    let connection;
    try {
        // Create connection without database
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        console.log('Connected to MySQL server');

        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`Database ${process.env.DB_NAME} created or already exists`);

        // Use the database
        await connection.query(`USE ${process.env.DB_NAME}`);

        // Read and execute migration file
        const migrationPath = path.join(__dirname, '../migrations/create_tables.sql');
        const migrationSQL = await fs.readFile(migrationPath, 'utf8');

        // Split the SQL file into individual statements
        const statements = migrationSQL
            .split(';')
            .filter(statement => statement.trim())
            .map(statement => statement + ';');

        // Execute each statement
        for (const statement of statements) {
            try {
                await connection.query(statement);
                console.log('Executed:', statement.substring(0, 50) + '...');
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    console.log('Skipping duplicate entry...');
                } else {
                    throw error;
                }
            }
        }

        console.log('Migrations completed successfully');
    } catch (error) {
        console.error('Error running migrations:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

runMigrations();
