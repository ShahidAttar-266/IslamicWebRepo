"use client";
import { useState } from 'react';
import { Upload as UploadIcon, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '@/api/axios';
import { toast } from 'react-hot-toast';
import { useQueryClient, useQuery } from '@tanstack/react-query';

const AdminUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const queryClient = useQueryClient();

  const { data: logs, isLoading } = useQuery({
    queryKey: ['upload-logs'],
    queryFn: async () => {
      const res = await api.get('/admin/names/upload-logs');
      return res.data;
    }
  });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/admin/names/upload-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data.data);
      toast.success('File uploaded and processed successfully!');
      queryClient.invalidateQueries({ queryKey: ['upload-logs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-names'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['names'] });
      queryClient.invalidateQueries({ queryKey: ['recentNames'] });
      setFile(null); // reset file input
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-text">Excel Bulk Upload</h1>
      
      <div className="bg-card border border-border p-8 rounded-xl flex flex-col items-center justify-center text-center">
        <UploadIcon size={48} className="text-primary mb-4" />
        <h3 className="text-lg font-bold text-text mb-2">Upload Names Data</h3>
        <p className="text-text-muted mb-6">Select an .xlsx file containing names to import into the database.</p>
        
        <input 
          type="file" 
          accept=".xlsx, .xls"
          id="file-upload" 
          className="hidden" 
          onChange={handleFileChange} 
        />
        
        <label 
          htmlFor="file-upload" 
          className="cursor-pointer bg-bg border border-primary/50 hover:border-primary text-text px-6 py-3 rounded-lg font-medium transition-all mb-4"
        >
          {file ? file.name : 'Select Excel File'}
        </label>

        {file && (
          <button 
            onClick={handleUpload}
            disabled={uploading}
            className="bg-primary text-bg hover:bg-opacity-90 px-8 py-3 rounded-lg font-bold transition-all disabled:opacity-50"
          >
            {uploading ? 'Processing...' : 'Upload & Import'}
          </button>
        )}
      </div>

      {result && (
        <div className="bg-card border border-primary/30 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-text mb-4">Import Results</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-bg p-4 rounded-lg flex items-center gap-3">
              <CheckCircle className="text-primary" />
              <div>
                <p className="text-2xl font-bold text-primary">{result.successCount}</p>
                <p className="text-sm text-text-muted">Successfully Imported</p>
              </div>
            </div>
            <div className="bg-bg p-4 rounded-lg flex items-center gap-3">
              <AlertTriangle className={result.errorCount > 0 ? "text-danger" : "text-text-muted"} />
              <div>
                <p className={`text-2xl font-bold ${result.errorCount > 0 ? "text-danger" : "text-text"}`}>{result.errorCount}</p>
                <p className="text-sm text-text-muted">Failed Rows</p>
              </div>
            </div>
          </div>
          {result.errors && result.errors.length > 0 && (
            <div className="mt-4">
              <p className="font-bold text-danger mb-2">Error Details:</p>
              <ul className="text-sm text-text-muted space-y-1 max-h-40 overflow-y-auto bg-bg p-3 rounded">
                {result.errors.map((err, i) => (
                  <li key={i}>Row {err.row}: {err.message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Upload History */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-text mb-4">Upload History</h2>
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-text-muted">Loading logs...</p>
          ) : logs?.data?.length === 0 ? (
            <p className="text-text-muted">No past uploads found.</p>
          ) : (
            logs?.data?.map(log => (
              <div key={log._id} className="bg-bg p-4 rounded-lg flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
                <div>
                  <p className="font-bold text-text">{log.fileName}</p>
                  <p className="text-sm text-text-muted">{new Date(log.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-4 text-sm font-medium">
                  <span className="text-primary">{log.successCount} Success</span>
                  <span className={log.errorCount > 0 ? "text-danger" : "text-text-muted"}>{log.errorCount} Errors</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUpload;