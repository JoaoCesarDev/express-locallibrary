var express = require('express');
var router = express.Router();

// Require controller modules.
var livroController = require('../controllers/livroControler');
var autorController = require('../controllers/autorController');
var generoController = require('../controllers/generoController');
var livroIntaceController = require('../controllers/livroInstanciaController');

/// BOOK ROUTES ///

// GET catalog home page.
router.get('/',livroController.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/livro/create',livroController.book_create_get);

// POST request for creating Book.
router.post('/livro/create',livroController.book_create_post);

// GET request to delete Book.
router.get('/livro/:id/delete',livroController.book_delete_get);

// POST request to delete Book.
router.post('/livro/:id/delete',livroController.book_delete_post);

// GET request to update Book.
router.get('/livro/:id/update',livroController.book_update_get);

// POST request to update Book.
router.post('/livro/:id/update',livroController.book_update_post);

// GET request for one Book.
router.get('/livro/:id',livroController.book_detail);

// GET request for list of all Book items.
router.get('/livros',livroController.book_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get('/autor/create', autorController.autor_create_get);

// POST request for creating Author.
router.post('/autor/create', autorController.autor_create_post);

// GET request to delete Author.
router.get('/autor/:id/delete', autorController.autor_delete_get);

// POST request to delete Author.
router.post('/autor/:id/delete', autorController.autor_delete_post);

// GET request to update Author.
router.get('/autor/:id/update', autorController.autor_update_get);

// POST request to update Author.
router.post('/autor/:id/update', autorController.autor_update_post);

// GET request for one Author.
router.get('/autor/:id', autorController.autor_detalhes);

// GET request for list of all Authors.
router.get('/lista_autores', autorController.autor_List);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genero/create', generoController.genre_create_get);

//POST request for creating Genre.
router.post('/genero/create', generoController.genre_create_post);

// GET request to delete Genre.
router.get('/genero/:id/delete', generoController.genre_delete_get);

// POST request to delete Genre.
router.post('/genero/:id/delete', generoController.genre_delete_post);

// GET request to update Genre.
router.get('/genero/:id/update', generoController.genre_update_get);

// POST request to update Genre.
router.post('/genero/:id/update', generoController.genre_update_post);

// GET request for one Genre.
router.get('/genero/:id', generoController.genre_detail);

// GET request for list of all Genre.
router.get('/lista_generos', generoController.genre_list);

/// BOOKINSTANCE ROUTES ///

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get('/livroinstancia/create', livroIntaceController.bookinstance_create_get);

// POST request for creating BookInstance.
router.post('/livroinstancia/create', livroIntaceController.bookinstance_create_post);

// GET request to delete BookInstance.
router.get('/livroinstancia/:id/delete', livroIntaceController.bookinstance_delete_get);

// POST request to delete BookInstance.
router.post('/livroinstancia/:id/delete', livroIntaceController.bookinstance_delete_post);

// GET request to update BookInstance.
router.get('/livroinstancia/:id/update', livroIntaceController.bookinstance_update_get);

// POST request to update BookInstance.
router.post('/livroinstancia/:id/update', livroIntaceController.bookinstance_update_post);

// GET request for one BookInstance.
router.get('/livroinstancia/:id', livroIntaceController.bookinstance_detail);

// GET request for list of all BookInstance.
router.get('/livroinstances', livroIntaceController.bookinstance_list);

module.exports = router;