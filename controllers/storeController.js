// exports.myMiddleware = (req, res, next) => {
//   req.name = 'Paco'; // the variable req.name ('Paco') has been passed into req and it stays there.
//   // res.cookie('name', 'paco is cool', { maxAge: 9000000 })
//   if(req.name === 'Paco') {
//     throw Error('That is a stupid name');
//   }
//
//   next(); // next() makes it so the function that contains this function as an argument passes on to the next argument.
// }

const mongoose = require('mongoose')
const Store = mongoose.model('Store') // we only need to reference this once b/c mongoose makes use of the singleton (in start.js) where the model is required only once

exports.homePage = (req, res) => {
  console.log(req.name); // req.name is still 'Paco'
  res.render('index');
}

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
}

// exports.createStore = (req, res) => {
//   const store = new Store(req.body);
  // store.save(function(err, store) {
  //   if(!err) {
  //     console.log('store was saved onto database!');
  //     res.redirect('/');
  //   }
  // });  If you do not put the callback inside store.save(), since javascript waits for no one, it will go ahead and redirect you while 'store.save()' resolves and so regardless of whether it resolves favorably or not.  The callback makes the redirect contingent upon there being no errors in the save.

  // However, what if you want to save several things before you redirect.  You end up with a heavily nested callback code frequently referred to as 'callback hell'.  The first solution is to use Promises:

  // first solution: Promises =>

  // store
  //   .save()
  //   .then(store => {
  //     return Store.find()
  //   })
  //   .then(stores => {
  //     res.render('storeList', {stores: stores})
  //   })
  //   .then(stores => {
  //     res.render('storeList', {stores: stores})
  //   })
  //   .catch(err => {
  //     throw Error(err);
  //   }) // You can chain these many times as long as each returns some sort of Promise

// };

// Second solution: AsyncAwait.  It tells javascript: "cool your guns, wait until save is finished before you console.log"



exports.createStore = async (req, res) => {
  // const store = new Store(req.body);
  // await store.save(); // since we need the slug from the store (store.slug) that is auto-generated only after it saves (b/c we want to redirect user to that specific store), we need a variable that stands in for the already-saved store.  See below:
  const store = await (new Store(req.body)).save();
  req.flash('success', `Successfully created ${store.name}.  Care to leave a review?`);
  // console.log('Save has been promised')
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  // Query the db for a list of all stores
  const stores = await Store.find();
  res.render('stores', { title: 'Stores', stores });
  // same as: res.render('stores', { title: 'Stores', stores: stores });
}

exports.editStore = async (req, res) => {
  // 1. find the store given the ID
  const store = await Store.findOne({ _id: req.params.id });
  // note: findOne is a MongoDB function.
  // res.json(store);  use this to log the json right on the browser
  // 2. confirm they are the owner of the store
  // 3. render out the edit form so user can update store
  res.render('editStore', { title: `Edit ${store.name}`, store })
  // same as: res.render('editStore', { title: `Edit ${store.name}`, store: store })
}
// BTW, no harm if you tag a function as async if you're not really sure it needs it.

exports.updateStore = async (req, res) => {
  // find and update the store
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return the new store instead of the old one
    runValidators: true // the validatorss are those options inside storeSchema in Store.js, such as {trim: true} and {required: 'Please enter a store name!'}.  We still want these options active when editing the store, otherwise one could edit out the name of the store.
  }).exec(); // this runs the query
  req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store --> </a>`);
  res.redirect(`/stores/${store._id}/edit`);
  // findOneAndUpdate() is a MongoDB function that allows us to query a piece of data from the DB and update it in one fell swoop.
  // redirect user to store and tell her it worked
}

// notes:
// req (request) = data that goes into something from us
// res (response) = data that comes out of something to us
