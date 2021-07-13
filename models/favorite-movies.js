import Sequelize from 'sequelize';

import sequelize from '../util/database.js';

const FavoriteMovies = sequelize.define('favorite_movies', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default FavoriteMovies;
