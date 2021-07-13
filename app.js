import express from 'express';
import bcrypt from 'bcryptjs';
import pino from 'express-pino-logger';
import session from 'express-session';

import sequelize from './util/database.js';
import User from './models/user.js';
import FavoriteMovies from './models/favorite-movies.js';

// Routes
import authRoutes from './routes/auth.js';
import moviesRoutes from './routes/movies.js';

const app = express();

app.use(pino({ prettyPrint: { colorize: true } }));

app.use(express.json());

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true },
  }),
);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/auth', authRoutes);
app.use(moviesRoutes);

// Relation
FavoriteMovies.belongsTo(User, {
  constraints: true,
  onDelete: 'CASCADE',
});
User.hasMany(FavoriteMovies);

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      bcrypt.hash('12345', 12).then(async (hashedPw) => {
        const newUser = {
          name: 'User One',
          username: 'userone',
          password: hashedPw,
        };
        await User.create(newUser);
      });
    }
    return user;
  })
  .then(() => {
    console.log('Server is started: "http://localhost:8080"');
    app.listen(8080);
  })
  .catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
