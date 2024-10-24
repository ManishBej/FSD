// components/AccessLogs.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AccessLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({
        key: 'access_time',
        direction: 'desc'
    });
    const [filter, setFilter] = useState({
        startDate: '',
        endDate: '',
        employeeName: '',
        algoStatus: 'all'
    });

   
    const fetchLogs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/logs`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    ...filter,
                    sort: sortConfig
                }
            });
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

   
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchLogs();
    };

  
    const formatDateTime = (date, time) => {
        const dateObj = new Date(`${date}T${time}`);
        return dateObj.toLocaleString();
    };

    useEffect(() => {
        fetchLogs();
    }, [sortConfig]); 

    return (
        <div className="bg-white rounded-lg shadow p-6">
            {/* Filter Form */}
            <form onSubmit={handleFilterSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                    </label>
                    <input
                        type="date"
                        className="w-full p-2 border rounded"
                        value={filter.startDate}
                        onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                    </label>
                    <input
                        type="date"
                        className="w-full p-2 border rounded"
                        value={filter.endDate}
                        onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employee Name
                    </label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={filter.employeeName}
                        onChange={(e) => setFilter({ ...filter, employeeName: e.target.value })}
                        placeholder="Search employee..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Energy Saving Mode
                    </label>
                    <select
                        className="w-full p-2 border rounded"
                        value={filter.algoStatus}
                        onChange={(e) => setFilter({ ...filter, algoStatus: e.target.value })}
                    >
                        <option value="all">All</option>
                        <option value="ON">ON</option>
                        <option value="OFF">OFF</option>
                    </select>
                </div>
                <div className="md:col-span-4">
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Apply Filters
                    </button>
                </div>
            </form>

            {/* Logs Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => requestSort('access_time')}
                            >
                                Access Time
                                {sortConfig.key === 'access_time' && (
                                    <span className="ml-2">
                                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => requestSort('employee_name')}
                            >
                                Employee Name
                                {sortConfig.key === 'employee_name' && (
                                    <span className="ml-2">
                                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => requestSort('algo_status')}
                            >
                                Energy Saving Mode
                                {sortConfig.key === 'algo_status' && (
                                    <span className="ml-2">
                                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="3" className="text-center py-4">
                                    <div className="animate-pulse flex justify-center items-center">
                                        Loading...
                                    </div>
                                </td>
                            </tr>
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="text-center py-4">
                                    No logs found
                                </td>
                            </tr>
                        ) : (
                            logs.map((log, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formatDateTime(log.access_date, log.access_time)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {log.employee_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            log.algo_status === 'ON' 
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {log.algo_status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}