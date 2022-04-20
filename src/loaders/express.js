import bodyParser from 'body-parser';
import cors from 'cors';
import routes from '../api/index.js';
import config from '../config/index.js';
import { errors } from "celebrate";
import middlewares from '../api/middlewares/index.js';

// this is the main setup/loader for express

export default async ({ app }) => {

    app.use(cors());
    app.use(bodyParser.json());

    // response format middleware
    // this function is used to send response
    app.use(middlewares.response);

    // api routes    
    // loading the main router file index with includes sub-routes as well
    app.use(config.api.prefix, routes());

    // error handlers for not found
    app.use((req, res, next) => {
        console.log("API NOT FOUND")
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });


    // express error
    app.use((err, req, res, next) => {
        // console.log(err.name)
        if (err.name === 'UnauthorizedError') {
            return res.status(err.status).send({
                statusCode: err.status,
                message: err.message
            }).end();
        }
        if (err.name === 'permission') {
            return res.status(err.status).send({
                statusCode: err.status,
                message: err.message
            }).end();
        }
        if (err.name === 'duplication') {
            return res.status(err.status).send({
                statusCode: err.status,
                message: err.message
            }).end();
        }
        if (err.name === 'notfound') {
            return res.status(err.status).send({
                statusCode: err.status,
                message: err.message
            }).end();
        }
        if (err.name === 'delete') {
            return res.status(409).send({
                statusCode: err.status,
                message: err.message
            }).end();
        }
        return next(err);
    });

    // celebrate validation error handler
    app.use(errors());

    // default error handler 
    app.use(middlewares.errorHandler);

};
