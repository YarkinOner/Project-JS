const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const reservationsFile = path.join(__dirname, 'reservations.json');

const logements = [
  { 
    id: 1, 
    titre: 'Appartement à Paris', 
    prix: 120, 
    image: '/images/paris.jpg', 
    images: ['/images/paris.jpg', '/images/paris1.jpg', '/images/paris2.jpg'],
    description: 'Charmant appartement au cœur de Paris. Idéalement situé près de la Tour Eiffel.',
    longDescription: "Cet appartement lumineux de 40 m² est parfait pour un couple ou un voyageur solo. Il dispose d'une chambre confortable, d'une cuisine équipée, d'une salle de bain moderne et d'un balcon avec vue sur la ville. Connexion Wi-Fi haut débit incluse."
  },
  { 
    id: 2, 
    titre: 'Maison à Nice', 
    prix: 90, 
    image: '/images/nice.jpg', 
    images: ['/images/nice.jpg', '/images/nice1.jpg', '/images/nice2.jpg'],
    description: 'Vue imprenable sur la mer.',
    longDescription: "Spacieuse maison en bord de mer à Nice, parfaite pour les familles ou les groupes d’amis. Trois chambres, un salon lumineux, jardin privé et terrasse avec vue sur la mer."
  },
  { 
    id: 3, 
    titre: 'Appartement à Lyon', 
    prix: 150, 
    image: '/images/lyon.jpg',
    images: ['/images/lyon.jpg', '/images/lyon1.jpg', '/images/lyon2.jpg'],
    description: 'Appartement moderne au centre-ville.',
    longDescription: "Appartement moderne au cœur de Lyon. Design contemporain, cuisine équipée, chambre spacieuse, parfait pour un séjour professionnel ou touristique."
  },
  {
    id: 4,
    titre: "Chalet à Chamonix",
    prix: 110,
    image: "/images/chamonix.jpg",
    images: ['/images/chamonix.jpg', '/images/chamonix1.jpg', '/images/chamonix2.jpg'],
    description: "Idéal pour un séjour au ski.",
    longDescription: "Chalet en bois dans les montagnes. Deux chambres, cuisine équipée, vue panoramique, accès direct aux pistes de ski. Ambiance chaleureuse assurée."
  },
  {
    id: 5,
    titre: "Maison à Avignon",
    prix: 95,
    image: "/images/avignon.jpg",
    images: ['/images/avignon.jpg', '/images/avignon1.jpg', '/images/avignon2.jpg'],
    description: "Maison historique au centre d’Avignon.",
    longDescription: "Maison ancienne rénovée avec goût dans le centre historique. Proche du Palais des Papes et des remparts. Terrasse ombragée et jardin."
  },
  {
    id: 6,
    titre: "Appartement à Istanbul",
    prix: 80,
    image: "/images/istanbul.jpg",
    images: ['/images/istanbul.jpg', '/images/istanbul1.jpg', '/images/istanbul2.jpg'],
    description: "Vue spectaculaire sur le Bosphore.",
    longDescription: "Appartement lumineux avec balcon donnant sur le Bosphore. Cuisine ouverte, salon moderne, chambre calme. Idéal pour explorer la ville."
  }
];




if (!fs.existsSync(reservationsFile)) {
  fs.writeFileSync(reservationsFile, '[]');
}

app.get('/', (req, res) => {
  res.render('accueil', { logements });
});

app.get('/logement/:id', (req, res) => {
  const logement = logements.find(l => l.id === parseInt(req.params.id));
  if (!logement) return res.status(404).send('Logement non trouvé');

  const reservations = JSON.parse(fs.readFileSync(reservationsFile, 'utf-8'));
  const datesReservees = reservations
    .filter(r => r.logementId === logement.id)
    .flatMap(r => {
      const start = new Date(r.start);
      const end = new Date(r.end);
      const dates = [];
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d).toISOString().split('T')[0]);
      }
      return dates;
    });

  res.render('detail', { logement, datesReservees });
});

app.post('/reserver', (req, res) => {
  const { logementId, start, end } = req.body;
  const logement = logements.find(l => l.id === parseInt(logementId));

  if (!logement) return res.status(400).send('Logement invalide');

  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = (endDate - startDate) / (1000 * 60 * 60 * 24);

  if (isNaN(diff) || diff < 0 || diff > 7) {
    return res.status(400).send('La réservation doit être entre 1 et 7 jours.');
  }

  const nouvelleReservation = {
    logementId: parseInt(logementId),
    titre: logement.titre,
    image: logement.image,
    prix: logement.prix,
    start,
    end,
    dateReservation: new Date().toISOString()
  };

  const reservations = JSON.parse(fs.readFileSync(reservationsFile));
  reservations.push(nouvelleReservation);
  fs.writeFileSync(reservationsFile, JSON.stringify(reservations, null, 2));

  res.redirect('/mes-reservations');
});

app.get('/mes-reservations', (req, res) => {
  const reservations = JSON.parse(fs.readFileSync(reservationsFile));
  res.render('mes-reservations', { reservations });
});

app.post('/annuler/:id', (req, res) => {
  const id = req.params.id;
  let reservations = JSON.parse(fs.readFileSync(reservationsFile));

  const nouvelleListe = reservations.filter(r => r.dateReservation !== id);

  if (nouvelleListe.length === reservations.length) {
    return res.status(404).send("Réservation non trouvée.");
  }

  fs.writeFileSync(reservationsFile, JSON.stringify(nouvelleListe, null, 2));
  res.json({ success: true });

});

app.listen(3000, () => {
  console.log("Serveur lancé sur http://localhost:3000");
});