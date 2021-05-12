const express = require("express");
const User = require("../models/user");
const router = express.Router();
const multer = require("multer");
const { body, validationResult } = require("express-validator");
const path = require("path");
const Article = require('../models/article')

// ------------------------------multer storage setting------------------------------

const storage = multer.diskStorage({
  destination: "./views/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        req.session.user.username +
        path.extname(file.originalname)
    );
  },
});

// **********************************************************************************

// --------------------check if uploaded file is in correct format-------------------

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimeType = filetypes.test(file.mimetype);
  if (mimeType && extname) {
    return cb(null, true);
  } else {
    cb("Error : Images Only !");
  }
}

// **********************************************************************************

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("myImage");

// -----------------------------------------dashboard page-----------------------------------------

router.get("/", function (req, res) {
  Article.find({}).populate({model : 'User', path : 'writer'}).exec(function(err, articles) {
    if (err) return res.status(500).send('Internal Server Error :(');

    return res.render("dashboard", { user: req.session.user , articles});
  })

});

// ************************************************************************************************

// ----------------------------------------edit profile page----------------------------------------

router.get("/profile", function (req, res) {
  let usernameErr, f_nameErr, l_nameErr, uploadErr;
  if (req.session.changeProfileErr) {
    usernameErr = req.session.changeProfileErr.find(
      (el) => el.param === "username"
    );
    f_nameErr = req.session.changeProfileErr.find(
      (el) => el.param === "f_name"
    );
    l_nameErr = req.session.changeProfileErr.find(
      (el) => el.param === "l_name"
    );
    if (usernameErr) {
      usernameErr = "username must include atleast 3 charecters";
    }
    if (f_nameErr) {
      f_nameErr = "first name must include atleast 3 charecters";
    }
    if (l_nameErr) {
      l_nameErr = "last name must include atleast 2 charecters";
    }
  }
  if (req.session.uploadErr) {
    uploadErr = req.session.uploadErr;
  }
  req.session.uploadErr = null;
  req.session.changeProfileErr = null;
  res.render("profile", {
    user: req.session.user,
    usernameErr,
    f_nameErr,
    l_nameErr,
    uploadErr,
  });
});

// ******************************************************************************************

// ---------------------------------------edit profile---------------------------------------

router.post(
  "/changeProfile",
  body("username").isLength({ min: 3 }),
  body("f_name").isLength({ min: 3 }),
  body("l_name").isLength({ min: 2 }),
  function (req, res) {
    // -----------------------------------change profile validation-----------------------------------

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.session.changeProfileErr = errors.errors;
      return res.redirect("/dashboard/profile");
    }

    // ***********************************************************************************************

    User.findOneAndUpdate(
      { username: req.session.user.username },
      {
        username: req.body.username,
        f_name: req.body.f_name,
        l_name: req.body.l_name,
        phonenumber: req.body.phonenumber,
      },
      { new: true },
      function (err, user) {
        if (err) return res.status(500).send("Internal Server Error :(");
        req.session.user = user;
        return res.redirect("/dashboard");
      }
    );
  }
);

// *******************************************************************************************

// -----------------------------------upload profile picture----------------------------------

router.post("/upload", function (req, res) {
  upload(req, res, (err) => {
    if (err) {
      req.session.uploadErr = err;
      res.redirect("/dashboard/profile");
    } else {
      User.findOneAndUpdate({_id : req.session.user._id}, {$set : {avatar : `../uploads/${req.file.filename}`}}, {new : true}, function (err, user) {
        if (err) return res.status(500).send('Internal Server Error :(');
        req.session.user = user;
      })
      res.redirect("/dashboard");
    }
  });
});

// *******************************************************************************************

// --------------------------------------write blog page--------------------------------------

router.get("/write", function (req, res) {
  let titleErr,contentErr;
  if (req.session.writeBlogErr) {
    titleErr = req.session.writeBlogErr.find(el => el.param === 'title');
    contentErr = req.session.writeBlogErr.find(el => el.param === 'content');
    if (titleErr) {
      titleErr = 'title must contain atleast 3 charecters';
    }
    if (contentErr) {
      contentErr = 'write something ! :('
    }
  }
  res.render("writeBlog", { user: req.session.user, titleErr, contentErr});
});

// *******************************************************************************************

// --------------------------------------write new blog---------------------------------------

router.post('/writeBlog',
  body("title").isLength({ min: 3 }),
  body("content").isLength({ min: 12 }),
  function(req, res) {

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.session.writeBlogErr = errors.errors;
      return res.status(400).send();
    } else {
      const article = new Article({
        title : req.body.title,
        text : req.body.content,
        writer : req.session.user._id
      })
      article.save(function(err) {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error :(');
        }
        return res.status(200).send();
      })

    }
})

// *******************************************************************************************

router.get('/article:id', function(req, res) {
  Article.findOne({_id : req.params.id}, function(err, article) {
    if (err) return res.status(500).send("Internal Server Error :(");
    if (!article) return res.status(404).send("article not found");
    return res.render('article', {article, user : req.session.user});
  })
})

// ------------------------------------------logout------------------------------------------

router.get("/logOut", function (req, res) {
  req.session.destroy();
  return res.status(200).send();
});

// ******************************************************************************************

module.exports = router;