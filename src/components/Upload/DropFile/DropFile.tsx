import './DropFile.scss';
import axios from 'axios';
import React, { useState } from 'react';
import useAxiosInterceptors from '../../../service/axiosInterceptor';

function DropFile() {
  // intercept the response from the server if no token is provided or if the token is expired redirect to login
  useAxiosInterceptors();
  const [file, setFile] = useState<File | null>(null);

  // handle the file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    console.log(selectedFile);

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
        `${import.meta.env.VITE_API_URL}/api/upload/coupon`,
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
      <div className="dropzone">
        <form
          id="uploadForm"
          encType="multipart/form-data"
          onSubmit={handleCsv}
        >
          <input
            type="file"
            id="csvFile"
            name="csvFile"
            accept=".csv"
            required
            onChange={handleFileChange}
          />
          <button type="submit">Upload FOC coupon</button>
          <small>format file : exemple-foc.csv</small>
          <table>
            <thead>
              <tr>
                <th>code</th>
                <th>amount</th>
                <th>wetsuit</th>
                <th>brand</th>
                <th>country</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ivip-...</td>
                <td>1000</td>
                <td>false</td>
                <td>quiksilver</td>
                <td>france</td>
              </tr>
            </tbody>
          </table>
        </form>
        <form
          id="uploadForm"
          encType="multipart/form-data"
          onSubmit={handleCsv}
        >
          <input
            type="file"
            id="freeshipping"
            name="freeshipping"
            accept=".csv"
            required
            onChange={handleFileChange}
          />
          <button type="submit">Upload Freeshipping</button>
          <small>format file : exemple-freeshipping.csv</small>
          <table>
            <thead>
              <tr>
                <th>code</th>
                <th>brand</th>
                <th>country</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>freeshipping-...</td>
                <td>quiksilver</td>
                <td>france</td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
}

export default DropFile;
