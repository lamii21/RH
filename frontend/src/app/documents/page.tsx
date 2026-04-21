"use client";

import { useEffect, useState } from 'react';
import { Upload, File } from 'lucide-react';
import api from '@/lib/api';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState('CV');
  const [uploading, setUploading] = useState(false);
  const [employeeId] = useState(1); // Demo ID

  const fetchDocuments = async () => {
    try {
      const res = await api.get(`/documents/employee/${employeeId}`);
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('employeeId', employeeId.toString());
    formData.append('documentType', type);

    try {
      await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFile(null);
      fetchDocuments();
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;

  return (
    <div className="animate-fade-in flex flex-col gap-6" style={{ flexDirection: 'row' }}>
      <div className="card w-full" style={{ flex: '1 1 300px' }}>
        <h3 className="font-bold text-xl mb-4">Upload Document</h3>
        <form onSubmit={handleUpload} className="flex gap-4" style={{ flexDirection: 'column' }}>
          <div>
            <label>Document Type</label>
            <select className="input" value={type} onChange={e => setType(e.target.value)}>
              <option value="CV">Curriculum Vitae (CV)</option>
              <option value="CONTRACT">Employment Contract</option>
              <option value="IDENTIFICATION">Identification</option>
              <option value="CERTIFICATE">Certificate</option>
            </select>
          </div>
          <div>
            <label>Select File</label>
            <input 
              type="file" 
              className="input" 
              onChange={e => setFile(e.target.files?.[0] || null)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary mt-2" disabled={!file || uploading}>
            <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>
      </div>

      <div className="card w-full" style={{ flex: '2 1 500px' }}>
        <h3 className="font-bold text-xl mb-4">My Documents</h3>
        <div className="flex gap-3" style={{ flexDirection: 'column' }}>
          {documents.length === 0 ? (
            <p className="color-secondary p-4 text-center rounded-md" style={{ border: '1px solid var(--border-color)' }}>No documents uploaded yet.</p>
          ) : (
            documents.map(doc => (
              <div key={doc.id} className="flex justify-between items-center p-3 rounded-md" style={{ border: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)' }}>
                    <File size={20} className="color-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{doc.fileName}</p>
                    <p className="text-sm color-secondary">Type: {doc.documentType}</p>
                  </div>
                </div>
                <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
                  View
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
