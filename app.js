require('dotenv').config();

const createError = require('http-errors');
const flash = require('connect-flash');
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');

// notifications handle
const { messages } = require('./assets');

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const classesRouter = require('./routes/classes');

// mongodb connect
// (async () => {
//   try {
//     const conection = await mongoose.connect(`${process.env.MONGODB_URI}`, { useNewUrlParser: true });
//     console.log(`Connected to Mongo! Database name: "${conection.connections[0].db.s.databaseName}"`);
//   } catch (err) {
//     console.error('Error conecting to Mongo database.', err);
//   }
// })();

mongoose
  .connect('mongodb://localhost/ekilikua', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });


const app = express();

// app title
app.locals.title = 'Ekilikua';
app.locals.copyright = '© 2019 Ekilikua';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');

// middlewares
app.use(expressLayouts);
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 * 1000, // 1 day
  }),
  secret: process.env.SESSION_SECRET || 'starterKit',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
}));
app.use((req, res, next) => {
  // app.locals.currentUser = req.session.currentUser;
  res.locals.currentUser = req.session.currentUser;
  next();
});
app.use(sassMiddleware({
  src: path.join(__dirname, 'sass'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(messages);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/classes', classesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handlers

// app.use((req, res, next) => {
//   res.status(404);
//   res.format({
//     html: () => {
//       res.render('404', { url: req.url });
//     },
//     json: () => {
//       res.json({ error: 'Not found' });
//     },
//     default: () => {
//       res.type('txt').send('Not found');
//     },
//   });
// });

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { error: err });
});

module.exports = app;
