const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController')

// Do work here
// router.get('/', (req, res) => {
//   // req has all of the information about your request
//   // res has all of the methods for sending data back
//   // req.query gets all of the query parameters
//   // req.body is used for posted parameters
//   // req.params is used to get all of the things in the URL
//
//   // everytime you console.log in here (in Express), you'll see it in Terminal
//
//   // res.send('Hey! It works!');
//   // sending two or more 'res.send''s will result in 'error: you've already set the header
//   // const paco = { name: 'paco', cool: true, age: 120 }
//   // res.json(paco)
//   // res.send(req.query.name); // this allows data to be set via the URL (localhost:7777/?name=paco&age=100)
//   // res.json(req.query) // this too, same as above.
//   res.render('hello', {
//     name: 'Paco',
//     cat: req.query.cat, // vars like 'req.query.cat' are called local variables or locals.  They allow you to set a variable in your template through the URL (localhost:7777/?cat=paco)
//     title: 'I love food'
//   });
// });

// router.get('/reverse/:name', (req, res) => {
//   // res.send(req.params.name)
//   const reverse = [...req.params.name].reverse().join('');
//   res.send(reverse)
// })

// router.get('/', storeController.myMiddleware, storeController.homePage)

// router.get('/', (req, res) => {
//   res.render('hello', {
//     title: 'I love food'
//   });
//   // 'hello' is a template file = hello.pug
// })

const { catchErrors } = require('../handlers/errorHandlers')

router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);

router.post('/add', 
	storeController.upload, 
	catchErrors(storeController.resize), 
	catchErrors(storeController.createStore)
);

router.post('/add/:id', catchErrors(storeController.updateStore));
router.get('/stores/:id/edit', catchErrors(storeController.editStore));

// even before we get to the routes, App.js 'uses' a whole bunch of middleware functionality

module.exports = router;
