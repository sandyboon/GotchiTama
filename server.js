const express = require('express');
const db = require('./models');
const apiRouter = require('./routes/api-routes');

// create app
const app = express();

// define middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// serve static resources
app.use(express.static('./public'));

// add the routers
app.use(apiRouter);

// start the server AFTER syncing the database
// IMPORTANT : remove the force option when done with dev.
db.sequelize.sync({ force: true }).then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
