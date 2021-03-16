const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');

const pool = require('../database');

router.get('/add',isLoggedIn, (req, res) => {
  res.render('links/add')
});

router.post('/add', async (req, res) => {
  const { title, url, description } = req.body;
  const newLink = {
    title,
    url,
    description,
    user_id: req.user.id
  };
  await pool.query('INSERT INTO links set ?', [newLink]);
  req.flash('success', 'Link saved succesfully!');
  res.redirect('/links')
});

router.get('/', isLoggedIn,  async (req, res) => {
  const links = await pool.query('SELECT * FROM links WHERE user_id =? ', [req.user.id]);
  res.render('links/lists', {links});
});

router.get('/delete/:id',  isLoggedIn,async (req, res) => {
  const {id} = req.params;
  await pool.query('DELETE FROM links WHERE ID = ?', [id]);
  req.flash('success', 'Link deleted succesfully!');
  res.redirect('/links')
});

router.get('/edit/:id',isLoggedIn ,async (req, res) => {
  const {id} = req.params;
  const link =  await pool.query('SELECT * FROM links WHERE id = ?', [id]);
  console.log(link[0]);
  res.render('links/edit', {link: link[0]});

})
router.post('/edit/:id', async (req, res) => {
  const {id} = req.params;
  const {title, description, url } = req.body;
  const newLink = {
    title,
    description,
    url
  };
  await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
  console.log(newLink);
  req.flash('success', 'Link edited succesfully!');
  res.redirect('/links')
})


module.exports = router;
