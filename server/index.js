const PORT = process.env.PORT || 42069
const app = require('./app')
// const seed = require('../script/seed');

const { db } = require('./db')

db.sync({force : true}).then(() => {
    app.listen(PORT, () => console.log(`Eerie muffled sounds on port ${PORT}`));
})

