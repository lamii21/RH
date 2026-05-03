"use client";

import { useEffect, useState } from 'react';
import { Upload, File as FileIcon, Download, Trash2, Loader2, CheckCircle, Search, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState('CV');
  const [targetEmployeeId, setTargetEmployeeId] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees?size=100');
      setEmployees(res.data.content);
      if (res.data.content.length > 0) {
        setTargetEmployeeId(res.data.content[0].id.toString());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDocuments = async () => {
    if (!targetEmployeeId) return;
    setLoading(true);
    try {
      const res = await api.get(`/documents/employee/${targetEmployeeId}`);
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [targetEmployeeId]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !targetEmployeeId) return;

    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('employeeId', targetEmployeeId);
    formData.append('documentType', type);

    try {
      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
          setUploadProgress(percentCompleted);
        }
      });
      setFile(null);
      fetchDocuments();
    } catch (err) {
      alert('Upload failed. Check server logs.');
    } finally {
      setUploading(false);
    }
  };

  const downloadFile = (id: number, fileName: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
    window.open(`${baseUrl}/api/v1/documents/${id}/download`, '_blank');
  };

  const deleteDocument = async (id: number) => {
    if (!confirm('Permanently delete this document?')) return;
    try {
      await api.delete(`/documents/${id}`);
      fetchDocuments();
    } catch (err) {
      alert('Failed to delete document.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-title text-3xl font-black">Document Repository</h1>
          <p className="page-subtitle">Secure storage for contracts, IDs and certifications.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-2 rounded-2xl shadow-sm">
          <User size={18} className="text-gray-400 ml-2" />
          <select 
            className="bg-transparent border-none focus:ring-0 text-sm font-bold w-full sm:w-48"
            value={targetEmployeeId}
            onChange={(e) => setTargetEmployeeId(e.target.value)}
          >
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card shadow-lg dark:bg-slate-900 border-none">
          <h3 className="font-black text-lg mb-6">Upload New Archive</h3>
          <form onSubmit={handleUpload} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Document Classification</label>
              <select className="input rounded-xl" value={type} onChange={e => setType(e.target.value)}>
                <option value="CV">Curriculum Vitae (CV)</option>
                <option value="CONTRACT">Employment Contract</option>
                <option value="IDENTIFICATION">ID / Passport</option>
                <option value="CERTIFICATE">Professional Certificate</option>
                <option value="OTHER">Other Documents</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Archive</label>
              <div className="relative group">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                />
                <div className={`p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${
                  file ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-100 dark:border-slate-800 group-hover:border-primary-color'
                }`}>
                  {file ? (
                    <>
                      <CheckCircle className="text-emerald-500 mb-2" size={32} />
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 truncate w-full text-center px-4">{file.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </>
                  ) : (
                    <>
                      <Upload className="text-gray-300 mb-2 group-hover:text-primary-color transition-colors" size={32} />
                      <p className="text-xs font-bold text-gray-400">Drag & drop or <span className="text-primary-color underline">browse</span></p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span className="text-primary-color animate-pulse">Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-primary-color" 
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full btn btn-primary py-3 rounded-xl shadow-lg shadow-primary-color/20 flex items-center justify-center gap-2" 
              disabled={!file || uploading}
            >
              {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
              {uploading ? 'Processing Archive...' : 'Submit to Repository'}
            </button>
          </form>
        </div>

        <div className="card lg:col-span-2 shadow-xl dark:bg-slate-900 border-none p-0 overflow-hidden">
          <div className="p-6 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-black text-lg">Digital Vault</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input type="text" placeholder="Search archive..." className="pl-9 pr-4 py-1.5 bg-gray-50 dark:bg-slate-800 border-none rounded-lg text-xs w-48" />
            </div>
          </div>
          
          <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 w-full bg-gray-50 dark:bg-slate-800 rounded-2xl animate-pulse" />
              ))
            ) : documents.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center opacity-30">
                <FileIcon size={48} className="mb-4" />
                <p className="text-sm font-black uppercase tracking-widest text-gray-400">Vault is empty</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {documents.map((doc, i) => (
                  <motion.div 
                    key={doc.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex justify-between items-center p-4 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-primary-color/30 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-primary-color/5 text-primary-color group-hover:scale-110 transition-transform">
                        <FileIcon size={24} />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 dark:text-white group-hover:text-primary-color transition-colors">{doc.fileName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-black text-primary-color/70 bg-primary-color/5 px-2 py-0.5 rounded-md uppercase">{doc.documentType}</span>
                          <span className="text-[10px] font-medium text-gray-400">{new Date(doc.uploadedAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => downloadFile(doc.id, doc.fileName)}
                        className="p-2.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all"
                        title="Download"
                      >
                        <Download size={20} />
                      </button>
                      <button 
                        onClick={() => deleteDocument(doc.id)}
                        className="p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
