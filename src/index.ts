// Build and export app
import App from './app';

// Connect with database
import mongoose from 'mongoose';
const USER = process.env.DB_USER;
const PASS = process.env.DB_PASS;
const NAME = process.env.DB_NAME;
const URI = `mongodb+srv://${USER}:${PASS}@canborda-cluster.trcoy.mongodb.net/${NAME}?retryWrites=true&w=majority`;
mongoose
  .connect(URI)
  .then(() => console.log(`Database ${NAME} connected!`))
  .catch(e => console.log(e));

// Start application
const PORT = process.env.PORT || 3000;
App.app.listen(PORT, () => {
  console.log(`Epidemiology-in-rice app listening on port ${PORT}`);
});
