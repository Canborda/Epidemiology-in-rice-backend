// Build and export app
import App from './app';

// Start application
const PORT = process.env.PORT || 3000;
App.app.listen(PORT, () => {
  console.log(`Epidemiology-in-rice app listening on port ${PORT}`);
});
