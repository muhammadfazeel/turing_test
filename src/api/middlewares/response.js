export default (req, res, next)=> {
    res.success = (data, info, statusCode = 200) => {
        res.json({
            statusCode: statusCode,
            data: data || {}
        })
    }
    next();
};

// for formatting the success response, adding custom function
// as oppose to sending the response direcly from the route