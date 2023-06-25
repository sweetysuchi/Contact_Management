const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { stringify } = require('querystring');
const { v4: uuidv4 } = require('uuid');

const contactsFilePath = path.join(__dirname, 'contacts.json');

try {
    fs.accessSync(contactsFilePath, fs.constants.W_OK);
    console.log('File is writable');
  } catch (error) {
    console.error('File is not writable:', error);
  }
router.get('/', (req, res) => {
  try {
    const contacts = JSON.parse(fs.readFileSync(contactsFilePath, 'utf8'));
    // console.log('Hello')
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const contacts = JSON.parse(fs.readFileSync(contactsFilePath, 'utf8'));
    const contact = contacts.find((c) => c.id === req.params.id);
    // console.log("hello")
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/', (req, res) => {
  try {
    const { name, phoneNumber, email } = req.body;
    const newContact = { id: generateUniqueId(), name, phoneNumber, email };
    const contacts = JSON.parse(fs.readFileSync(contactsFilePath, 'utf8'));
    contacts.push(newContact);
    fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2), 'utf8');

    res.status(201).json(newContact);
    console.log('Response Body:', newContact);
  } catch (error) {
    // console.log('Response Body:', newContact);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { name, phoneNumber, email } = req.body;
    const contacts = JSON.parse(fs.readFileSync(contactsFilePath, 'utf8'));
    const index = contacts.findIndex((c) => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    const updatedContact = { id: req.params.id, name, phoneNumber, email };
    contacts[index] = updatedContact;
    fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2), 'utf8');

    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const contacts = JSON.parse(fs.readFileSync(contactsFilePath, 'utf8'));
    const index = contacts.findIndex((c) => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    contacts.splice(index, 1);
    fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2), 'utf8');

    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


function generateUniqueId() {
  const uuid = uuidv4();
  const uuidWithoutDashes = uuid.replace(/-/g, '');
  const uniqueId = parseInt(uuidWithoutDashes, 4);
  return uniqueId.toString();
}

module.exports = router;
