import express, {Application} from 'express';

// Express server
const app = express();
const PORT = process.env.PORT || 3000;

// Defaul endpoint
app.use('/', (req, res) => {
  res.status(200).json({ping: 'pong'});
});

// Start application
app.listen(PORT, () => {
  console.log(`Epidemiology-in-rice app listening on port ${PORT}`);
});
