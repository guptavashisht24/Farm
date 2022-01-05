var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/farm');
var collection = db.get('inventory');
var passport = require('passport');
const User = require('../models/user');
var orders = db.get('orders')

const PAGE = 1
const LIM = 12


//get the whole collection
router.get('/', async function(req, res, next) {
  const page = (req.query.page)?parseInt(req.query.page):PAGE
  const limit = (req.query.limit)?parseInt(req.query.limit):LIM
  const type = req.query.type?req.query.type:""
  const name = req.query.name?req.query.name:""
  const searchObj = {
    del : false
  }
  if(type)
    searchObj.type = type
  if(name)
    searchObj.name = new RegExp(name, 'i')
  start = (page-1)*limit
  endIndex = page*limit
  const results = {}
  const count = await collection.count(searchObj)
  if(endIndex < count){
    results.next = {
      page : page+1,
      limit
    }
  }
  if(start > 0){
    results.previous = {
      page : page-1,
      limit
    }
  }
  collection.find(searchObj, {limit : limit, skip : start}, function(err, items){
    if(err) throw err;
    sol = {
      ...results,
      items
    }
    res.render('index', {items : sol, name, type, flash: req.flash('error')} );
});

});

//checkout ejs
router.get('/cart', function(req, res, next) {
  res.render('checkout', { title: 'Express' });
})

//add ejs
router.get('/add', function(req, res, next) {
  res.render('add');
});

//about ejs
router.get('/about', function(req, res, next) {
  res.render('about');
});

//contact ejs
router.get('/contact', function(req, res, next) {
  res.render('contact');
});


router.get('/checkout', async function (req, res, next) {
  res.render('checkout')
  
});

//edit ejs
router.get('/api/farm/:id/edit', function(req, res, next){
  collection.findOne({ _id : req.params.id }, function(err, item){
    if(err) throw err;
    res.render('edit', { item : item });
});
})

//deleting an item
router.get('/api/farm/:id/delete', function(req, res, next) {
  collection.update({ _id : req.params.id },
    {
      $set: 
      {
        del: true,
      }
    }, function(err, item){
        if(err) throw err;
        res.redirect('/');
    });
});

//get a single item
router.get('/api/farm/:id', function(req, res, next) {
  collection.findOne({ _id : req.params.id }, function(err, item){
    if(err) throw err;
    res.render('single', { item : item });
  }); 
});

//adding an item
router.post('/add', function(req, res, next) {
  collection.insert({
    name: req.body.name,
    image: req.body.image,
    quantity: req.body.quantity,
    price: req.body.price,
    type: req.body.type,
    del: false
  }, function(err, item){
      if(err) throw err; 
      res.redirect('/');
  });
});


//editing an item
router.post('/api/farm/:id/edit', function(req, res, next) {
  collection.update({ _id : req.params.id },
  {
    $set: 
    {
      name: req.body.name,
      image: req.body.image,
      quantity: req.body.quantity,
      price: req.body.price,
      type: req.body.type,
      del: false,
    }
  }, function(err, item){
      if(err) throw err;
      res.redirect('/');
  });
});

router.get('/orderlist', async function(req, res, next){
  const username = req.cookies.username
  const content  = await orders.findOne({userid : username})
  if(content){
      console.log("hello")
      console.log(content)
      const { orders = [] } = content
      res.render('orders', { data : orders}) 
  }
  else {
    res.render('orders', { data : []}) 
  }
})

//search an item
router.post('/', function(req, res, next){
  if(req.body.name.length == 0 && req.body.type.length == 0)
  collection.find({}, function(err, items){
    if(err) throw err;
    console.log(items);
    res.render('index', {items : items, name : "", type : "", flash: req.flash('error') })
  })
  else if(req.body.name.length > 0 && req.body.type.length > 0)
  collection.find({name : new RegExp(req.body.name, 'i'), type : req.body.type,  flash: req.flash('error')}, function(err, items){
    if(err) throw err;
    console.log(items);
    res.render('index', {items : items, name : req.body.name, type : req.body.type, flash: req.flash('error')})
  })  
  else if(req.body.type.length > 0 && req.body.name.length == 0)
  collection.find({type : req.body.type}, function(err, items){
    console.log(req.body.type);
    if(err) throw err;
    console.log(items);
    res.render('index', {items : items, name : "", type : req.body.type})
  })
  else if(req.body.name.length > 0 && req.body.type.length == 0)
  collection.find({name : new RegExp(req.body.name, 'i')}, function(err, items){
    if(err) throw err;
    console.log(items);
    res.render('index', {items : items, name : req.body.name, type : "", flash: req.flash('error')})
  })
})


//----user.js------


// router.get("/register", function(req, res) {
//   collection.find({del: false}, function(err, items){
//     if(err) throw err;
//     res.render('index', {items : items, name : "", type : ""} );
// });
//   });


// router.get('/login', function(req, res) {
//   collection.find({del: false}, function(err, items){
//     if(err) throw err;
//     res.render('index', {items : items, name : "", type : ""} );
// });
// });


router.post('/login',
passport.authenticate('local', {
  failureRedirect: '/', 
  failureFlash: true
}),
  function(req, res) {
    res.cookie('username', req.user.username);
    res.cookie('isAdmin', req.user.isAdmin);
    res.redirect('/');
  });

router.post('/register', function(req, res) { 
  let isAdminFlag = false;
  let uname = req.body.username;

  if(req.body.isAdmin !== undefined){
    isAdminFlag = true;
  }
    Users=new User({email: req.body.email, username : req.body.username, isAdmin : isAdminFlag});   
        User.register(Users, req.body.password, function(err1, user) { 
            if (err1) { 
              const page = (req.query.page)?parseInt(req.query.page):PAGE
              const limit = (req.query.limit)?parseInt(req.query.limit):LIM
              const type = req.query.type?req.query.type:""
              const name = req.query.name?req.query.name:""
              const searchObj = {
                del : false
              }
              if(type)
                searchObj.type = type
              if(name)
                searchObj.name = new RegExp(name, 'i')
              start = (page-1)*limit
              endIndex = page*limit
              const results = {}
              const count =  collection.count(searchObj)
              if(endIndex < count){
                results.next = {
                  page : page+1,
                  limit
                }
              }
              if(start > 0){
                results.previous = {
                  page : page-1,
                  limit
                }
              }
              collection.find(searchObj, {limit : limit, skip : start}, function(err, items){
                if(err) throw err;
                sol = {
                  ...results,
                  items
                }
                res.render('index', {items : sol, name, type, flash: "User info already exists!" } );
            });
            }
            else{ 
              passport.authenticate("local")(req, res, function() { 
                res.cookie('username', uname);
                res.cookie('isAdmin', isAdminFlag);
                res.redirect('/');
                }); 
            } 
          }); 
});

router.get('/logout', function(req, res) {
    req.logout();
    res.clearCookie('username');
    res.clearCookie('isAdmin');
    res.redirect('/');
});




module.exports = router;
