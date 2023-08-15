const {db} = require('./db');
const PORT = process.env.PORT || 42069;
const app = require('./app');
const seed = require('../script/seed');

db.sync().then(() => {
  // seed();
  app.listen(PORT, () => console.log(`Eerie muffled sounds on port ${PORT}`));
})
