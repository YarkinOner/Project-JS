const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

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

const reservations = [
  {
    image: '/images/paris.jpg',
    titre: 'Appartement à Paris',
    prix: 120
  },
  {
    image: '/images/nice.jpg',
    titre: 'Maison à Nice',
    prix: 90
  }
];


app.get('/', (req, res) => {
  res.render('accueil', { logements });
});

app.get('/logement/:id', (req, res) => {
  const logement = logements.find(l => l.id === parseInt(req.params.id));
  if (!logement) return res.status(404).send('Logement non trouvé');
  res.render('detail', { logement });
});

app.get('/profil', (req, res) => {
  res.render('profil', { reservations });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
