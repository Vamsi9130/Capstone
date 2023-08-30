const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const app = express();

// Firebase Admin SDK setup
const serviceAccount = require('./key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files and set the view engine
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });
    // You can add code here to handle user creation success
    res.redirect('/');
  } catch (error) {
    // Handle error appropriately
    console.error(error);
    res.redirect('/');
  }
});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await admin.auth().getUserByEmail(email);
    // You can add code here to handle user retrieval success
    res.redirect('/');
  } catch (error) {
    // Handle error appropriately
    console.error(error);
    res.redirect('/');
  }
});

// Movie API configuration
const TMDB_API_KEY = '3ec45fc5';
const TMDB_API_BASE_URL = 'http://www.omdbapi.com/apikey.aspx?VERIFYKEY=259711df-396e-4574-97aa-986e504ad6a4';

app.get('/movies', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_API_BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
      },
    });
    const movies = response.data.results;
    // You can render the movies using EJS or send them as JSON
    res.json(movies);
  } catch (error) {
    // Handle error appropriately
    console.error(error);
    res.status(500).send('Error fetching movies');
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
