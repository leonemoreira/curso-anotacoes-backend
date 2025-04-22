// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const exampleRoutes = require('./routes/example');
app.use('/api', exampleRoutes);


app.get('/', (req, res) => {
  res.send('Hello Render!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

