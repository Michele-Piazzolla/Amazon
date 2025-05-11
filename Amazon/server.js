const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

const porta = 3000;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Carrello in memoria (array semplice)
let carrello = [];

// Homepage
app.get('/', (req, res) => {
  const prodotti = JSON.parse(fs.readFileSync('./dati/prodotti.json'));
  res.render('home', { 
    prodotti,
    carrelloCount: carrello.length 
  });
});

// Dettaglio prodotto
app.get('/prodotto/:id', (req, res) => {
  const prodotti = JSON.parse(fs.readFileSync('./dati/prodotti.json'));
  const prodotto = prodotti.find(p => p.id == req.params.id);
  
  if (prodotto) {
    res.render('prodotto', { 
      prodotto,
      carrelloCount: carrello.length 
    });
  } else {
    res.status(404).send('Prodotto non trovato');
  }
});

// Aggiungi al carrello
app.post('/aggiungi-carrello', (req, res) => {
  const { id, nome, prezzo } = req.body;
  carrello.push({ id, nome, prezzo: parseFloat(prezzo) });
  res.redirect('/');
});

// Pagina carrello
app.get('/carrello', (req, res) => {
  res.render('carrello', { 
    carrello,
    carrelloCount: carrello.length,
    totale: carrello.reduce((sum, item) => sum + item.prezzo, 0)
  });
});

// Rimuovi dal carrello
app.post('/rimuovi-carrello/:id', (req, res) => {
  carrello = carrello.filter(item => item.id != req.params.id);
  res.redirect('/carrello');
});

app.listen(porta, () => {
  console.log(`Server avviato su http://localhost:${porta}`);
});