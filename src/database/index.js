import sequelize from "sequelize";
import databaseConfig from "../config/database";

import User from '../app/models/User';
import Task from "../app/models/Task";

const models = [User, Task];

class Database {
    constructor() {
        this.init();
    }

    init() {
        //Integração do banco com os models
        this.connection = new sequelize(databaseConfig);

        models
            .map(model => model.init(this.connection))
            .map(model => model.associate && model.associate(this.connection.models));
    }
}

export default new Database();