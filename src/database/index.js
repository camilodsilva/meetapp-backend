import Sequelize from 'sequelize';

import Banner from '../app/models/Banner';
import Meetup from '../app/models/Meetup';
import User from '../app/models/User';

import databaseConfig from '../config/database';

const models = [User, Banner, Meetup];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
