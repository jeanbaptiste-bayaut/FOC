import './DropFile.scss';
import axios from 'axios';
import React, { useState } from 'react';
import useAxiosInterceptors from '../../service/axiosInterceptor';

function DropFile() {
  // intercept the response from the server if no token is provided or if the token is expired redirect to login
  useAxiosInterceptors();
  const [file, setFile] = useState<File | null>(null);

  // handle the file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // handle the csv file and send it to the server
  const handleCsv = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file.');
      return;
    }

    // Create a FormData object with the file
    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      // Call to the upload coupon endpoint
      const response = await axios.post(
        'http://localhost:3000/api/upload/coupon',
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response) {
        alert(response.data.message);
      } else {
        alert("Erreur lors de l'upload du fichier CSV");
      }
      setFile(null);
      // Reset the form
      (document.getElementById('uploadForm') as HTMLFormElement)?.reset();
    } catch (error) {
      setFile(null);
      // Reset the form
      (document.getElementById('uploadForm') as HTMLFormElement)?.reset();
      console.error('Erreur:', error);
      alert("Erreur lors de l'upload du fichier CSV");
    }
  };

  return (
    <div>
      <h1>Upload CSV File</h1>
      <form id="uploadForm" encType="multipart/form-data" onSubmit={handleCsv}>
        <input
          type="file"
          id="csvFile"
          name="csvFile"
          accept=".csv"
          required
          onChange={handleFileChange}
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default DropFile;
