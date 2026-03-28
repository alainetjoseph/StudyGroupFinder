import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Activity, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  User, 
  Users, 
  Mail, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

const BACKEND = import.meta.env.VITE_BACKEND_URL;

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedLog, setExpandedLog] = useState(null);
  
  // Filtering & Pagination State
  const [filters, setFilters] = useState({
    actionType: '',
    status: '',
    search: '',
    startDate: '',
    endDate: ''
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [actionTypes, setActionTypes] = useState([]);

  useEffect(() => {
    fetchActionTypes();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [page, filters.actionType, filters.status, filters.startDate, filters.endDate]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { actionType, status, search, startDate, endDate } = filters;
      const res = await axios.get(`${BACKEND}/admin/logs`, {
        params: {
          page,
          limit: 15,
          actionType,
          status,
          search,
          startDate,
          endDate
        },
        withCredentials: true
      });

      if (res.data.success) {
        setLogs(res.data.logs);
        setTotalPages(res.data.pagination.pages);
        setTotalLogs(res.data.pagination.total);
      }
    } catch (err) {
      setError("Failed to fetch logs. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActionTypes = async () => {
    try {
      const res = await axios.get(`${BACKEND}/admin/logs/types`, { withCredentials: true });
      if (res.data.success) {
        setActionTypes(res.data.types);
      }
    } catch (err) {
      console.error("Failed to fetch action types", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      actionType: '',
      status: '',
      search: '',
      startDate: '',
      endDate: ''
    });
    setPage(1);
  };

  const toggleExpand = (id) => {
    setExpandedLog(expandedLog === id ? null : id);
  };

  const getActionIcon = (type) => {
    if (type.includes('USER')) return <User size={18} className="text-blue-400" />;
    if (type.includes('GROUP')) return <Users size={18} className="text-purple-400" />;
    if (type.includes('EMAIL')) return <Mail size={18} className="text-green-400" />;
    if (type.includes('REPORT')) return <AlertCircle size={18} className="text-red-400" />;
    return <Activity size={18} className="text-gray-400" />;
  };

  const getStatusBadge = (status) => {
    if (status === 'success') {
      return (
        <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
          <CheckCircle2 size={12} /> Success
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
        <XCircle size={12} /> Failed
      </span>
    );
  };

  const formatActionType = (type) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Activity Logs
          </h1>
          <p className="text-slate-400 mt-1">Audit and monitor all platform activities</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchLogs}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            title="Refresh logs"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 text-sm font-medium">
            Total Logs: <span className="text-indigo-400">{totalLogs}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-8 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              name="search"
              placeholder="Search user or group..."
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
            />
          </form>

          {/* Action Type */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <select
              name="actionType"
              value={filters.actionType}
              onChange={handleFilterChange}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
            >
              <option value="">All Actions</option>
              {actionTypes.map(type => (
                <option key={type} value={type}>{formatActionType(type)}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
               <Activity size={18} />
            </div>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
            >
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Date Picker (Simplistic) */}
          <div className="lg:col-span-2 flex gap-2">
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
              />
            </div>
            <button 
              onClick={resetFilters}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-sm font-medium transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="max-w-7xl mx-auto bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Action</th>
                <th className="px-6 py-4 font-semibold">Actor</th>
                <th className="px-6 py-4 font-semibold">Target</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Time</th>
                <th className="px-6 py-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex justify-center flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                      <p className="text-slate-500">Loading logs...</p>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No logs found matching your criteria
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <React.Fragment key={log._id}>
                    <tr className={`hover:bg-slate-800/30 transition-colors cursor-pointer ${expandedLog === log._id ? 'bg-slate-800/30' : ''}`}
                        onClick={() => toggleExpand(log._id)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-800 p-2 rounded-lg">
                            {getActionIcon(log.actionType)}
                          </div>
                          <span className="font-medium text-slate-200">
                            {formatActionType(log.actionType)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-slate-200">{log.actor?.name || 'System'}</p>
                          <p className="text-slate-500 text-xs italic">{log.actor?.type}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-slate-200">{log.target?.name || 'N/A'}</p>
                          <p className="text-slate-500 text-xs italic">{log.target?.type}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(log.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-slate-200">{formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}</p>
                          <p className="text-slate-500 text-[10px]">{format(new Date(log.createdAt), 'MMM d, h:mm a')}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {expandedLog === log._id ? <ChevronUp size={20} className="inline text-slate-500" /> : <ChevronDown size={20} className="inline text-slate-500" />}
                      </td>
                    </tr>
                    
                    {/* Expandable Meta Section */}
                    {expandedLog === log._id && (
                      <tr className="bg-slate-800/20">
                        <td colSpan="6" className="px-6 py-6 border-l-2 border-indigo-500">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">Context Metadata</h4>
                              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-700 space-y-3">
                                {log.metadata && Object.keys(log.metadata).length > 0 ? (
                                  Object.entries(log.metadata).map(([key, value]) => (
                                    <div key={key} className="flex flex-col gap-1">
                                      <span className="text-[10px] uppercase text-slate-500 font-semibold">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                      <span className="text-sm text-indigo-300 font-mono break-all">
                                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                      </span>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-slate-500 text-sm italic">No additional metadata</p>
                                )}
                                
                                {log.target?.id && (
                                  <div className="mt-4 pt-4 border-t border-slate-800">
                                    <a 
                                      href={log.target.type === 'user' ? `/admin/users/${log.target.id}` : log.target.type === 'group' ? `/admin/groups/${log.target.id}` : '#'}
                                      className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors inline-flex items-center gap-1"
                                      onClick={(e) => {
                                        if (['user', 'group'].includes(log.target.type)) return;
                                        e.preventDefault();
                                      }}
                                    >
                                      View {log.target.type} details
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">System & Actor Info</h4>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm py-2 border-b border-slate-800">
                                  <span className="text-slate-500">Actor ID</span>
                                  <span className="text-slate-300 font-mono text-[10px]">{log.actor?.id || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm py-2 border-b border-slate-800">
                                  <span className="text-slate-500">IP Address</span>
                                  <span className="text-slate-300 font-mono text-xs">{log.ipAddress || 'Unknown'}</span>
                                </div>
                                <div className="flex justify-between items-baseline text-sm py-2 border-b border-slate-800">
                                  <span className="text-slate-500 whitespace-nowrap mr-4">User Agent</span>
                                  <span className="text-slate-400 text-[10px] text-right break-all leading-tight">{log.userAgent || 'Not recorded'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm py-2">
                                  <span className="text-slate-500">Log ID</span>
                                  <span className="text-slate-300 font-mono text-[9px]">{log._id}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && logs.length > 0 && (
          <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-800 flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Showing page <span className="text-slate-200">{page}</span> of <span className="text-slate-200">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 transition-colors"
                title="Previous Page"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className=" flex gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                   let pageNum;
                   if (totalPages <= 5) pageNum = i + 1;
                   else if (page <= 3) pageNum = i + 1;
                   else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                   else pageNum = page - 2 + i;
                   
                   return (
                     <button
                       key={pageNum}
                       onClick={() => setPage(pageNum)}
                       className={`px-3 py-1 rounded-lg text-sm font-medium border transition-all ${
                         page === pageNum 
                           ? 'bg-blue-600 border-blue-500 text-white' 
                           : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                       }`}
                     >
                       {pageNum}
                     </button>
                   );
                })}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 transition-colors"
                title="Next Page"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogs;
