import { Router } from 'express';
import middlewares from '../middlewares/index.js';
import Logger from '../../loaders/logger.js';
import sequelize from '../../models/index.js';
import initModels from "../../models/init-models.js";
import { Container } from 'typedi';
import repoService from '../../services/repo.js';

const route = Router();
const model = initModels(sequelize);

export default (app) => {

    // for this assignment I could use this logger directly
    // but i am using this DI for getting logger
    const logger = Container.get('logger');

    app.use('/repos', route);

    // middleware for logging the basic request info; defining directly into the route for specific logging
    route.use((req, res, next) => {
        Logger.debug(`${req.method}: /repos${req.url}`);
        next();
    });

    route.get('/:org/:repository/:year/:month?/:day?', middlewares.validation.getParams, async (req, res, next) => {
        try {
            const inputData = req.params;
            const model = Container.get('Repository');
            const instance = new repoService(model, logger);
            const data = await instance.getRepos(inputData);
            return res.success(data);
        } catch (e) {
            logger.error('🔥 error: %o', e);
            return next(e);
        }
    });
};