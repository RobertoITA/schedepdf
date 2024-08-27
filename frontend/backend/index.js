const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');

app.use(cors());

app.get('/pdf-files', (req, res) => {
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error('Errore durante la lettura dei file:', err);
            res.status(500).send('Errore durante il recupero dell\'elenco dei file');
        } else {
            const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');
            const filesWithDates = pdfFiles.map(file => ({
                name: file,
                createdDate: fs.statSync(path.join(uploadsDir, file)).birthtime // Ottieni la data di creazione
            }));
            res.json(filesWithDates);
        }
    });
});

app.use('/pdf-files', express.static(uploadsDir)); // Consenti il download dei file

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
