import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);

  useEffect(() => {
    // Carica l'elenco dei file PDF dalla directory corrente
    fetchFiles();
  }, []);

  useEffect(() => {
    // Filtra l'elenco dei file in base alla query di ricerca
    const filtered = files.filter(file => file.name.toLowerCase().includes(searchInput.toLowerCase()));
    setFilteredFiles(filtered);
  }, [searchInput, files]);

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://schede:5000/pdf-files/');
      const filesList = await response.json();
      const files = filesList.map(file => ({
        name: file.name,
        url: `http://schede:5000/pdf-files/${encodeURIComponent(file.name)}`,
        date: formatDate(new Date(file.createdDate))
      }));
      setFiles(files);
    } catch (error) {
      console.error('Errore durante il caricamento dei file:', error);
    }
  };

  const formatDate = (date) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('it-IT', options);
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  return (
    <div className="App">
      <h1>Elenco dei file DELLE RICETTE DI PRODUZIONE in formato PDF:</h1>

      <input 
        type="text" 
        value={searchInput} 
        onChange={handleSearchInputChange} 
        placeholder="Cerca per nome del file..."
      />

      <table>
        <thead>
          <tr>
            <th>Nome del File</th>
            <th>Data di Creazione</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {filteredFiles.map((file, index) => (
            <tr key={index}>
              <td>{file.name}</td>
              <td>{file.date}</td>
              <td><a href={file.url} className="action-link" download={file.name} target="_blank" rel="noreferrer">Download</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
