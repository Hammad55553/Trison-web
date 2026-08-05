import React, { useState, useEffect } from 'react';
import { Download, UploadCloud, AlertTriangle, CheckCircle, XCircle, Cloud } from 'lucide-react';
import './BackupManager.css';

const BackupManager = () => {
  const [downloading, setDownloading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [uploadingDrive, setUploadingDrive] = useState(false);
  const [driveAuthenticated, setDriveAuthenticated] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === 'google_auth_success') {
        setDriveAuthenticated(true);
        setMessage({ type: 'success', text: 'Google Drive connected successfully!' });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleDriveAuth = () => {
    window.open('http://localhost:5000/api/drive/auth', 'googleAuth', 'width=500,height=600');
  };

  const handleDriveUpload = async () => {
    setUploadingDrive(true);
    setMessage(null);
    try {
      const response = await fetch('http://localhost:5000/api/drive/upload', {
        method: 'POST',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload to Google Drive');
      }
      setMessage({ type: 'success', text: data.message });
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: error.message });
      if (error.message.includes('not authenticated')) {
         setDriveAuthenticated(false);
      }
    } finally {
      setUploadingDrive(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    setMessage(null);
    try {
      const response = await fetch('http://localhost:5000/api/backup', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to download backup');
      }

      // Create a blob from the response and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trison_db_backup_${new Date().toISOString().split('T')[0]}.sql`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      setMessage({ type: 'success', text: 'Backup downloaded successfully.' });
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to download backup. Make sure server is running and database is connected.' });
    } finally {
      setDownloading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.name.endsWith('.sql')) {
        setMessage({ type: 'error', text: 'Please select a valid .sql backup file.' });
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setMessage(null);
    }
  };

  const handleRestore = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first.' });
      return;
    }

    if (!window.confirm('WARNING: Restoring the database will overwrite your current data. Are you sure you want to proceed?')) {
      return;
    }

    setRestoring(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('backupFile', file);

    try {
      const response = await fetch('http://localhost:5000/api/restore', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to restore database');
      }

      setMessage({ type: 'success', text: 'Database restored successfully!' });
      setFile(null);
      // Reset file input
      document.getElementById('backupFileInput').value = '';
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: error.message || 'Failed to restore database. Please try again.' });
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="backup-manager-container">
      <div className="backup-manager-header">
        <h2>Database Backup & Restore</h2>
        <p>Safely export your data to a file or restore the system from a previous backup.</p>
      </div>

      {message && (
        <div className={`message-alert ${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={18} style={{marginRight: '8px', verticalAlign: 'middle'}}/> : <XCircle size={18} style={{marginRight: '8px', verticalAlign: 'middle'}}/>}
          {message.text}
        </div>
      )}

      <div className="backup-section">
        <div className="backup-card">
          <div className="backup-card-title">
            <Download size={24} />
            Download Backup
          </div>
          <p>
            Generate a full SQL dump of your current database. This file will contain all panels,
            leads, and other structured data. Save it in a secure location.
          </p>
          <button 
            className="backup-btn" 
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? 'Generating Backup...' : 'Download Database Backup'}
          </button>
        </div>

        <div className="backup-card" style={{ backgroundColor: '#f4fafe', borderColor: '#b8daff' }}>
          <div className="backup-card-title">
            <Cloud size={24} />
            Backup to Google Drive
          </div>
          <p>
            Securely save a copy of your database directly to your Google Drive account, similar to WhatsApp backups.
          </p>
          {!driveAuthenticated ? (
            <button 
              className="backup-btn" 
              style={{ backgroundColor: '#4285F4' }}
              onClick={handleDriveAuth}
            >
              Connect Google Drive
            </button>
          ) : (
            <button 
              className="backup-btn" 
              style={{ backgroundColor: '#0f9d58' }}
              onClick={handleDriveUpload}
              disabled={uploadingDrive}
            >
              {uploadingDrive ? 'Uploading to Drive...' : 'Upload Backup to Drive'}
            </button>
          )}
        </div>

        <div className="backup-card">
          <div className="backup-card-title">
            <UploadCloud size={24} />
            Restore Database
          </div>
          
          <div className="warning-alert">
            <AlertTriangle size={24} style={{flexShrink: 0, marginTop: '2px'}}/>
            <div>
              <strong>Warning:</strong> Restoring a database will overwrite current data. 
              Only use a trusted <code>.sql</code> backup file generated by this system.
            </div>
          </div>

          <div className="file-input-wrapper">
            <input 
              id="backupFileInput"
              type="file" 
              accept=".sql" 
              className="file-input"
              onChange={handleFileChange}
              disabled={restoring}
            />
          </div>

          <button 
            className="backup-btn restore" 
            onClick={handleRestore}
            disabled={restoring || !file}
          >
            {restoring ? 'Restoring Data...' : 'Restore from Backup'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackupManager;
