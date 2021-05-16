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
