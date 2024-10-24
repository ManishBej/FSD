// routes/logs.js
const express = require('express');
const router = express.Router();
const AccessLog = require('../models/AccessLog');
const auth = require('../middleware/auth');


router.get('/', auth, async (req, res) => {
    try {
        const {
            startDate,
            endDate,
            employeeName,
            algoStatus,
            sort
        } = req.query;

      
        let query = {};
        
        if (startDate && endDate) {
            query.access_date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        if (employeeName) {
            query.employee_name = new RegExp(employeeName, 'i');
        }

        if (algoStatus && algoStatus !== 'all') {
            query.algo_status = algoStatus;
        }

      
        let sortObj = {};
        if (sort) {
            sortObj[sort.key] = sort.direction === 'asc' ? 1 : -1;
        } else {
            sortObj = { access_time: -1 };
        }

        const logs = await AccessLog
            .find(query)
            .sort(sortObj)
            .limit(100); 

        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;