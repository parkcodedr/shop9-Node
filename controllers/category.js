const Category = require('../models/Category');
const { errorHandler } = require('../helpers/dbErrorHandler');


exports.create = (req, res) => {
    const category = new Category(req.body);
    category.save().then(cat => {
        res.status(200).json({ category })

    }).catch(err => {
        res.status(400).json({ error: errorHandler(err) });
    })
}