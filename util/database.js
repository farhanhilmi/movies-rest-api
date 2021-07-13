import Sequelize from 'sequelize';

const sequelize = new Sequelize('db-movies', 'root', '1202190194', {
  dialect: 'mysql',
  host: 'localhost',
});

export default sequelize;
