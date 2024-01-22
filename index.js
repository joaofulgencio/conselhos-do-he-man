const express = require('express');
const fs = require('fs');
const path = require('path');
const { startOfDay, isBefore, addDays } = require('date-fns');

const app = express();
const port = process.env.PORT || 3000;

// Diretório das imagens
const imageDirectory = path.join(__dirname, 'conselhos_do_he-man');

// Array para manter o controle das imagens
let allImages = [];
let currentImage = null;
let currentDate = null;

// Função para ler todas as imagens no diretório
fs.readdir(imageDirectory, (err, files) => {
    if (err) {
        console.error('Erro ao ler o diretório de imagens', err);
        return;
    }

    allImages = files;
});

// Função para escolher uma nova imagem no início do dia
function chooseNewImage() {
    const today = startOfDay(new Date());

    if (!currentDate || isBefore(today, currentDate)) {
        if (allImages.length === 0) {
            console.log('Todas as imagens já foram exibidas.');
            return null;
        }

        const randomIndex = Math.floor(Math.random() * allImages.length);
        currentImage = allImages.splice(randomIndex, 1)[0];
        currentDate = today;

        console.log('Nova imagem selecionada para o dia', today);

        return currentImage;
    }

    return currentImage;
}

// Rota para exibir a página principal (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para exibir a imagem aleatória
app.get('/imagem', (req, res) => {
    const selectedImage = chooseNewImage();
    if (!selectedImage) {
        res.send('Todas as imagens já foram exibidas.');
        return;
    }

    const imagePath = path.join(imageDirectory, selectedImage);

    res.sendFile(imagePath);
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
