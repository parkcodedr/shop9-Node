const Category = require('../models/Category');
const { errorHandler } = require('../helpers/dbErrorHandler');



exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: "Category does not exist"
            });
        }
        req.category = category;
        next();
    });

}
exports.create = (req, res) => {
    const category = new Category(req.body);
    category.save().then(cat => {
        res.status(200).json({ category })

    }).catch(err => {
        res.status(400).json({ error: errorHandler(err) });
    })
}

exports.read = (req, res) => {
    res.json(req.category);
}