var express = require('express');
var router = express.Router();
var multer  = require('multer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const MongoClient = require('mongodb').MongoClient;
var convertObjectId = require('mongodb').ObjectID;
const assert = require('assert');
var md5 = require('md5');
var User = require('../model/account.js');
var Sale = require('../model/sale.js');
var Product = require('../model/product.js');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null,Date.now() + '-' + file.originalname )
  }
})
var upload = multer({ storage: storage })

/* GET home page. */
router.get('/', function (req, res, next) {
  Product.find({},function(err, data){
    if(err){
     return res.send(err);
    }
    if(data){
     return res.render('index', {title : 'Home' , data : data, user: req.session.User});
    }
  })
});

router.get('/admin',authenticateMiddleware(), function (req, res, next) {
  Product.find({},function(err, data){
    if(err){
     return res.send(err);
    }
    if(data){
     return res.render('admin', {title : 'Admin' , data : data});
    }
  })
});

router.get('/xoasp/:idcanxoa', function (req, res, next) {
  var idcanxoa = req.params.idcanxoa;
  Product.findByIdAndRemove(idcanxoa).exec();
  res.redirect('/admin');
});

router.get('/editProduct.:id', function (req, res, next) {
  var id = req.params.id;
  Product.findById(id, function(err, data){
    if(err){
      return res.send(err);
    }
    if(data){
      return res.render('editProduct',{title: "Edit Product", data: data})
    }
  })
});
router.post('/editProduct.:id',upload.single('imagePath'), function (req, res, next) {
  var id = req.params.id;
  var imagePath = "./images/"+ req.file.filename;
  Product.findByIdAndUpdate(id,{
      "productCode": req.body.id,
      "name" : req.body.name,
      "description" : req.body.description,
      "productImages": imagePath,
      "productPrice": req.body.productPrice,
      "productInfo": req.body.productInfo,
      "color": req.body.color
  }).exec();
  res.redirect('/admin');
});


router.get('/logout', function (req, res, next) {
  req.session.User.forEach(function(user){
    email = user.email;
  })
  console.log(email+" đã đăng xuất");
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

router.get('/contact',  function (req, res, next) {
  res.render('contact', { title: 'Contact' , user: req.session.User});
});

router.get('/shop', function (req, res, next) {
    Product.find({},function(err, data){
      if(err){
       return res.send(err);
      }
      if(data){
       return res.render('shop', {title : 'Shop' , data : data, user: req.session.User});
      }
    })
});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login',
    function(req, res, next) {
        passport.authenticate('local', function(err, user) {
            if (err) { return next(err) }
            if (!user) {
                // res.local("username", req.param('username'));
                return res.render('login', { error: true , title:"Login"});
            }

            // make passportjs setup the user object, serialize the user, ...
            req.login(user, {}, function(err) {
                if (err) { return next(err) };
                if(user.admin == 0){
                  console.log(req.user.email+" đã đăng nhập");
                return res.redirect('/sale');
                }else{
                  console.log("Admin đã dăng nhập");
                  return res.redirect('/admin')
                }
            });
        })(req, res, next);
        return;
    }
);
router.get('/sign-up', function (req, res, next) {
  res.render('signUp', { title: 'Sign Up' });
});

router.get('/product-detail.:id', function (req, res, next) {
  Product.find({},function(err, data){
    if(err){
     return res.send(err);
    }
    if(data){
     return res.render('product-detail', { title: 'Product-Detail', id: req.params.id, data: data, user: req.session.User });
    }
  })
});

router.post('/signUp', function (req, res, next) {
  if (req.body.email &&
    req.body.phoneNumber &&
    req.body.password &&
    req.body.passwordConf &&
    req.body.address) {
    var userData = {
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: md5(req.body.password),
      passwordConf: md5(req.body.passwordConf),
      address: req.body.address,
      admin: 0
    }
    //use schema.create to insert data into the db
    User.create(userData, function (err, user) {
      if (err) {
        res.send(err);
        return next(err)
      } else {
        return res.redirect('/login');
      }
    });
  }
});

router.get('/add-product',authenticateMiddleware(), function (req, res, next) {
  res.render('addProduct', { title: 'Add Product' });
});

router.post('/addProduct',upload.single('imagePath'), function (req, res, next) {
  
  var imagePath = "./images/"+ req.file.filename;
  var product = {
    "productCode": req.body.id,
    "name" : req.body.name,
    "description" : req.body.description,
    "productImages": imagePath,
    "productPrice": req.body.productPrice,
    "productInfo": req.body.productInfo,
    "color": req.body.color
  }
 Product.create(product, function(err, product){
  if (err) {
    res.send(err);
    return next(err)
  } else {
    return res.redirect('/admin');
  }
 })
});
 
router.post('/sale', function (req, res, next) {
  var idsp = req.body.productCode;
  var price = req.body.productPrice;
  var quantity = req.body.quantity;
  var image = req.body.productImages;
  var email = req.body.email;
  if (idsp &&price && quantity && image && email) {
    var saleDetail = {
      id: idsp,
      email: email,
      price: price,
      quantity: quantity,
      image: image
    }
    //use schema.create to insert data into the db
    Sale.create(saleDetail, function (err, sale) {
      if (err) {
        res.send(err);
        return next(err)
      } else {
        console.log(email + " vừa thêm sản phẩm có mã "+ idsp+" với số lượng: "+quantity);
        return res.redirect('sale');
      }
    });
  }
});

router.get('/sale', authenticateMiddleware(), function (req, res, next) {
  var email;
  req.session.User.forEach(function(user){
    email = user.email;
  })
    Sale.find({email: email}, function(err, saleDetail){
      if(err){
       return res.send(err);
      }
      if(saleDetail){
        return res.render('sale', { title: 'Sale' , saleDetail: saleDetail, user : req.session.User});
      }
    })
});


router.get('/xoa/:idcanxoa', function (req, res, next) {
  var idcanxoa = req.params.idcanxoa;
  Sale.findByIdAndRemove(idcanxoa).exec();
  var email;
  req.session.User.forEach(function(user){
    email = user.email;
  })
  console.log(email+" vừa xoá sản phẩm có id: "+idcanxoa);
  res.redirect('/sale');
});

router.post('/sua/:idcansua', function (req, res, next) {
  var idcansua = req.params.idcansua;
  var quantity = req.body.quantity;
  Sale.findByIdAndUpdate(idcansua,{quantity: quantity}).exec();
  var email;
  req.session.User.forEach(function(user){
    email = user.email;
  })
  console.log(email+" vừa xoá sửa phẩm có id "+idcanxoa + " số lượng thành: "+quantity);
  res.redirect('/sale');
});


passport.use(new LocalStrategy(
  { usernameField: 'email',
    session: true},
  function(email, password, done) {
    User.findOne({ email: email }, function (err, user) {
    if (err) {
      return done(err);
    }
    if (user){
      if (user.password == md5(password)) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    }else{
      return done(null, false);
    }
  })
   }
));

router.get('/editAccount', authenticateMiddleware(), function(req, res, next) {
  res.render('editAccount', { title: 'Edit Account', user : req.session.User });
});

router.post('/changeAccount.:id', function(req, res, next) {
  var id = convertObjectId(req.params.id);
  User.findByIdAndUpdate(id, {
    email: req.body.email,
    password: md5(req.body.newPassword),
    passwordConf: md5(req.body.passwordConf)
  }).exec();
  Sale.find({}, function(err, saleDetail){
    if(err){
     return res.send(err);
    }
    if(saleDetail){
      return res.render('sale', { title: 'Sale' , saleDetail: saleDetail, user : req.session.User});
    }
  })
});

passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(function(email, done) {
  User.find({email: email}, function (err, user) {
    done(err, user);
  });
});


function authenticateMiddleware(){
  return (req, res, next) => {
    if(req.isAuthenticated()){
      req.session.User = req.user;
      return next();
    }
    res.redirect('/login')
  }
}
module.exports = router;
