const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Treatmnt = require("../models/treatmnt");

router.get("/", (req, res, next) => {
  Treatmnt.find()
    .select("_id tType name description recipe")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        Treatmnt: docs.map(doc => {
          return {
            tType: doc.tType,
            name: doc.name,
            description: doc.description,
            recipe:doc.status,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/treatmnts/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", (req, res, next) => {
  const treatmnt = new Treatmnt({
    _id: new mongoose.Types.ObjectId(),
    tType:req.body.tType,
    name: req.body.name,
    description:req.body.description,
    recipe:req.body.recipe
  });
  treatmnt
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created successfully",
        createdTreatment: {
            tType:result.tType,
            name: result.name,
            _id: result._id,
            request: {
                type: 'GET',
                url: "http://localhost:3000/treatmnts/" + result._id
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

router.get("/:treatmntId", (req, res, next) => {
  const id = req.params.treatmntId;
  Treatmnt.findById(id)
    .select('_id tType name description recipe')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            treatmnt: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/treatmnts'
            }
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

router.patch("/:treatmntId", (req, res, next) => {
  const id = req.params.treatmntId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Treatmnt.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Updated',
          request: {
              type: 'GET',
              url: 'http://localhost:3000/treatmnts/' + id
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

router.delete("/:treatmntId", (req, res, next) => {
  const id = req.params.treatmntId;
  Treatmnt.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Deleted',
          request: {
              type: 'POST',
              url: 'http://localhost:3000/treatmnts'
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
