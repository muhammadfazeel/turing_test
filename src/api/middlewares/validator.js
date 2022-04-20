import { celebrate, Joi } from 'celebrate';

// using celebrate which actually uses joi to validate requests
// adding common middlewares here to be used by the routes

export default {
    getParams: celebrate({
        params: {
            org: Joi.string().required(),
            repository: Joi.string().required(),
            year: Joi.string().required(),
            month: Joi.string().optional(),
            day: Joi.string().optional(),
        }
    })
};