var express         = require("express"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    bodyParser      = require("body-parser"),
    User            = require("./models/user"),
    localStrategy   = require("passport-local"),
    localMongoose   = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/auth_demo_app");
mongoose.promise = global.promise;

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Hewie is the cutest shibe ever",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=====================================================
//ROUTES
//=====================================================

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/secret", isLoggedIn, function(req, res) {
    res.render("secret");
});

//Auth Routes
app.get("/register", function(req, res){
    res.render("register");
});

//User Signups
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        })
    })
});

//Login routes
//middleware
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){
    
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Starting server.........");
});