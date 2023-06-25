const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const contactsRouter = require('./routes/contacts');

app.use(express.json());
app.use(cors());


app.use('/api/contacts', contactsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
