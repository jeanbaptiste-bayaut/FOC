import axios from 'axios';
import React, { useState } from 'react';

function DropFile() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleCsv = async (e: any) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', file);

    console.log('formData:', formData);

    try {
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
        alert('Fichier CSV uploadé avec succès');
      } else {
        alert("Erreur lors de l'upload du fichier CSV");
      }
    } catch (error) {
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
