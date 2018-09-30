const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Prodct = require("../models/prodct");


// Handle incoming GET requests to /PRODUCTS
router.get("/", (req, res, next) => {
  Prodct.find()
    .select("acnetype name brand Description instructions")
    .exec()
    .then(docs => {
      res.status(200).json({
        Treatments: docs.map(doc => {
          return {
            acnetype:doc.acnetype,
            name: doc.name,
            brand:doc.brand,
            Description:doc.Description,
            instructions:doc.instructions
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", (req, res, next) => {
      const prodct = new Prodct({
        _id: new mongoose.Types.ObjectId(),
        acnetype:req.body.acnetype,
        name:req.body.name,
        brand: req.body.brand,
        Description:req.body.Description,
        instructions:req.body.instructions
      });
      prodct
        .save()
        .then(result => {
          console.log(result);
          res.status(201).json({
            message: "Created successfully",
            Products: {
              acnetype:result.acnetype,
                name:result.name,
                brand: result.brand,
                Description:result.Description,
                instructions:result.instructions,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: "http://localhost:3001/prodct/" + result._id
                }
            }
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
});


router.get("/:prodctID", (req, res, next) => {
        const id = req.params.prodctID;
        Prodct.find({"acnetype":id})
          .select('acnetype name brand Description instructions')
          .exec()
          .then(doc => {
            console.log("From database", doc);
            if (doc) {
              res.status(200).json({
                  products: doc,
              });
            } else {
              res
                .status(404)
                .json({ message: "No valid entry found for provided ID" });
            }
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
          });
});
      

router.patch("/:prodctID", (req, res, next) => {
        const id = req.params.prodctID;
        const updateOps = {};
        for (const ops of req.body) {
          updateOps[ops.propName] = ops.value;
        }
        Prodct.update({ _id: id }, { $set: updateOps })
          .exec()
          .then(result => {
            res.status(200).json({
                message: 'Updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3001/prodct/' + id
                }
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
});
      

router.delete("/:prodctID", (req, res, next) => {
        const id = req.params.prodctID;
        Prodct.remove({ _id: id })
          .exec()
          .then(result => {
            res.status(200).json({
                message: 'Deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3001/prodct'
                }
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
      });
      
      module.exports = router;