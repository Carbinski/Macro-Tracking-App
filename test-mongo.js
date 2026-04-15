const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/macrotracker')
  .then(() => {
    console.log("Connected to Mongo!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Mongo Error:", err);
    process.exit(1);
  });
