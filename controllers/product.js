const formidable = require('formidable');
const _ = require('lodash');
const Product = require('../models/Product');
const fs = require('fs');
const { errorHandler } = require('../helpers/dbErrorHandler');


exports.getProductById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: "Product not found"
            });
        }
        req.product = product;
        next();
    });

}

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();

    form.keepExtensions = true;
    form.parse(req, (error, fields, files) => {
        if (error) {
            return res.status(400).json({ error: "Image could not be uploaded" });
        }

        let product = new Product(fields);
        //validate fields
        const { name, category, price, quantity, description, shipping } = fields;
        if (!name || !category || !price || !quantity || !description || !shipping) {
            return res.status(400).json({ error: "All fieds are required" });
        }

        if (files.photo) {
            if (files.photo.size > 2000000) {
                return res.status(400).json({ error: "Image size should not not be more than 2MB" });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        product.save().then(result => {
            return res.status(201).json({ result });
        }).catch(err => {

            return res.status(400).json({ error: errorHandler(err) });
        })

    })

}
exports.read = (req, res) => {
    req.product.photo = undefined;
    res.json(req.product);
}

exports.remove = (req, res) => {
    let product = req.product;
    product.remove().then(result => {
        return res.status(200).json({ message: "Product deleted successful" });
    }).catch(err => {
        return res.status(400).json({ error: errorHandler(err) });
    })

}
exports.update = (req, res) => {
    let form = new formidable.IncomingForm();

    form.keepExtensions = true;
    form.parse(req, (error, fields, files) => {
        if (error) {
            return res.status(400).json({ error: "Image could not be uploaded" });
        }

        let product = req.product;
        product = _.extend(product, fields);
        //validate fields
        const { name, category, price, quantity, description, shipping } = fields;
        if (!name || !category || !price || !quantity || !description || !shipping) {
            return res.status(400).json({ error: "All fieds are required" });
        }

        if (files.photo) {
            if (files.photo.size > 2000000) {
                return res.status(400).json({ error: "Image size should not not be more than 2MB" });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        product.save().then(result => {
            return res.status(201).json({ result });
        }).catch(err => {

            return res.status(400).json({ error: errorHandler(err) });
        })

    })

}

//get products by sells and arrival
// products by sells =  /products/sortBy=sold&order=desc&limit=4
//products by arrival = /products/sortBy=createAt&order=desc&limit=4
// if not params return all products

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? Number(req.query.limit) : 6;
    Product.find().select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .limit(limit)
        .exec().then(products => {
            return res.status(200).json({ products });
        }).catch(err => {
            res.status(400).json({ error: "Products not found" + err });
        })

}
/**
 * return a product base on the request product category
 * other product that has thesame category will be retunred
 */
exports.listRelatedProducts = (req, res) => {
    let limit = req.query.limit ? Number(req.query.limit) : 6;
    Product.find({ _id: { $ne: req.product }, category: req.product.category })
        .limit(limit).populate('category', '_id name').exec()
        .then(products => {
            return res.status(200).json({ products });
        }).catch(err => {
            res.status(400).json({ error: "Products not found" + err });
        })
}
exports.listProductCategories = (req, res) => {
    Product.distinct('Categories', {}).then(categories => {
        return res.status(200).json({ categories });
    }).catch(err => {
        res.status(400).json({ error: "Categories not found" + err });
    })


}
exports.listBySearch = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? Number(req.query.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
    for (let key in req.body.filters) {
        if (req.body.filers[key].length > 0) {
            if (key === 'price') {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            } else {
                findArgs[key] = req.body.filters[key]
            }
        }
    }
    Product.find(findArgs).select("-photo")
        .populate("Categories")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit).exec().then(products => {
            return res.status(200).json({ size: products.length, products });
        }).catch(err => {
            res.status(400).json({ error: "Products not found" + err });
        })
}
