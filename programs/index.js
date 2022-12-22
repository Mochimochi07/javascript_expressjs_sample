const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const database = {
  tokens: [],
  adminTokens: [],
  admins: {
    admin: 'password'
  },
  cards: [
    {
      id: 1,
      name: 'Dark Magician',
      type: 'normal monster',
      level: 7,
      attribute: 'dark',
      attack: 2500,
      defense: 2100,
      effect: ''
    },
    {
      id: 2,
      name: 'Red-Eyes Black Dragon',
      type: 'normal monster',
      level: 7,
      attribute: 'dark',
      attack: 2400,
      defense: 2000,
      effect: ''
    },
    {
      id: 3,
      name: 'Blue-Eyes White Dragon',
      type: 'normal monster',
      level: 8,
      attribute: 'light',
      attack: 3000,
      defense: 2500,
      effect: ''
    },
    {
      id: 4,
      name: 'Monster Reborn',
      type: 'spell card',
      level: null,
      attribute: null,
      attack: null,
      defense: null,
      effect: 'Special summons a monster from either player\'s graveyard.'
    },
    {
      id: 5,
      name: 'Dark Hole',
      type: 'spell card',
      level: null,
      attribute: null,
      attack: null,
      defense: null,
      effect: 'Destroys all monsters on the field.'
    },
    {
      id: 6,
      name: 'Mirror Force',
      type: 'trap card',
      level: null,
      attribute: null,
      attack: null,
      defense: null,
      effect: 'Destroys all attacking monsters.'
    }
  ]
};


const checkAuth = (req, res, next) => {
    const token = req.headers.authorization;
    if (token && database.tokens.includes(token)) {
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };







const checkAdminAuth = (req, res, next) => {
    const token = req.headers.authorization;
    if (token && database.adminTokens.includes(token)) {
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };
  

  app.post('/tokens', (req, res) => {
    const token = uuidv4();;
    database.tokens.push(token);
    res.json({ token });
  });
  
 
  app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (database.admins[username] === password) {
      const token = uuidv4();
      database.adminTokens.push(token);
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid login credentials' });
    }
  });
  

  app.get('/cards', checkAuth, (req, res) => {
    res.json(database.cards);
  });
  

  app.post('/cards', checkAdminAuth, (req, res) => {
    const card = {
      id: database.cards.length + 1,
      ...req.body
    };
    database.cards.push(card);
    res.json(card);
  });
  

  app.get('/cards/:id', checkAuth, (req, res) => {
    const id = parseInt(req.params.id);
    const card = database.cards.find(c => c.id === id);
    if (card) {
      res.json(card);
    } else {
      res.status(404).json({ error: 'Card not found' });
    }
  });
  
  

app.put('/cards/:id', checkAdminAuth, (req, res) => {
    const id = parseInt(req.params.id);
    const card = database.cards.find(c => c.id === id);
    if (card) {
 
      card.name = req.body.name || card.name;
      card.type = req.body.type || card.type;
      card.level = req.body.level || card.level;
      card.attribute = req.body.attribute || card.attribute;
      card.attack = req.body.attack || card.attack;
      card.defense = req.body.defense || card.defense;
      card.effect = req.body.effect || card.effect;
      res.json(card);
    } else {
      res.status(404).json({ error: 'Card not found' });
    }
  });


  
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
