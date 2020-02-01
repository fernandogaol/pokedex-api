require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'; // if in production mode logging is tiny, else logging is common
const POKEDEX = require('./pokedex.json');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

app.use(helmet()); // gets rid of powered by = express on network dev tool
app.use(cors());
app.use(morgan(morganSetting));

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
  console.log(authToken);

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }

  next();
});

const validTypes = [
  `Bug`,
  `Dark`,
  `Dragon`,
  `Electric`,
  `Fairy`,
  `Fighting`,
  `Fire`,
  `Flying`,
  `Ghost`,
  `Grass`,
  `Ground`,
  `Ice`,
  `Normal`,
  `Poison`,
  `Psychic`,
  `Rock`,
  `Steel`,
  `Water`
];
app.get('/', (req, res) => {
  res.redirect('/pokemon');
});

app.get('/types', function handleGetTypes(req, res) {
  res.json(validTypes);
});

app.get('/pokemon', function handleGetPokemon(req, res) {
  let response = POKEDEX.pokemon;
  const { name, type } = req.query;

  // filter our pokemon by name if name query param is present
  if (name) {
    response = response.filter(pokemon =>
      // case insensitive searching
      pokemon.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // filter our pokemon by type if type query param is present
  if (type) {
    response = response.filter(pokemon => pokemon.type.includes(type));
  }

  res.json(response);
});

const PORT = 8000 || process.env.PORT;

app.listen(PORT, () => {
  return PORT;
});
