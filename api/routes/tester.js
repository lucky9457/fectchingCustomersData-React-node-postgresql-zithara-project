// app.js
// app.js
const { json } = require('body-parser');
const express = require('express');
const app = express.Router();
const PORT = 3007;
const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'fogi9457',
    port: 5432,
});



app.get('/api/data', async (req, res,next) => {
    try {
        const { page = 1, pageSize = 20, search = '', sort = 'sno' } = req.query;
        const offset = (page - 1) * pageSize;

        const filterCondition = `customer_name ILIKE '%${search}%' OR location ILIKE '%${search}%'`;

        const countQuery = `SELECT COUNT(*) FROM customers WHERE ${filterCondition}`;
        const totalRecords = await pool.query(countQuery);
        const totalCount = parseInt(totalRecords.rows[0].count);

        const dataQuery = `
            SELECT *
            FROM customers
            WHERE ${filterCondition}
            ORDER BY ${sort}
            LIMIT ${pageSize}
            OFFSET ${offset} 
        `;

        const result = await pool.query(dataQuery);

        res.json({ success: true, data: result.rows, totalRecords: totalCount });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = app