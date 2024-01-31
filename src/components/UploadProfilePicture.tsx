import React, { useState, ChangeEvent } from 'react';
import UserService from '../services/UserService';
import './Components.css';

const UploadProfilePicture = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);

        }
    };

    const handleUpload = async () => {
        try {
            if (!selectedFile) {
                setUploadStatus('Please select a file.');
                return;
            }

            const response = await UserService.uploadImage(selectedFile);

            if (response.status == 201) {
                setUploadStatus('File uploaded successfully!');
                window.location.reload();
            } else {
                setUploadStatus('Failed to upload file.');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadStatus('Internal Server Error');
        }
    };

    return (
        <div className='upload-pic'>
            <div className="file-input">
                <input type="file" onChange={handleFileChange} />
            </div>
            <button onClick={handleUpload}>Upload File</button>
            {uploadStatus && <p>{uploadStatus}</p>}
        </div>
    );
};

export default UploadProfilePicture;
