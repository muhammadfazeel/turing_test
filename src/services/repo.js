import sequelize from '../models/index.js';
import initModels from "../models/init-models.js";
import seq from 'sequelize';
import('./generalService.js')
const model = initModels(sequelize);

// this is the service class for Admin Users 
// it takes care of quering the database

export default class UserService {

    // getting the model and other dependencies through arguments
    // not importing and directly defining anything
    constructor(model, logger) {
        this.model = model;
        this.defaultLimit = 20;
        this.logger = logger;
    }

    async getRepos(condition) {
        try {
            let contributorCondition = {};
            let attributes = ['org', 'repository',[sequelize.col('contributors.year'), 'year']]

            if (condition.year) {
                contributorCondition.year = condition.year
            }
            if (condition.month) {
                contributorCondition.month = condition.month
                attributes.push([sequelize.col('contributors.month'), 'month'])
            }
            if (condition.day) {
                contributorCondition.day = condition.day
                attributes.push([sequelize.col('contributors.day'), 'day'])
            }
            delete condition.year
            delete condition.month
            delete condition.day

            // check if email exist
            let repos = await this.model.findAll({
                where: condition,
                attributes,
                include: [
                    {
                        model: model.Contributor,
                        as: 'contributors',
                        attributes: ['name', 'contributions'],
                        where: contributorCondition
                    }
                ]
            });
            return repos;
        } catch (e) {
            throw e;
        }
    }
};