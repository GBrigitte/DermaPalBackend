const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const AcneTyp = require("../models/acneTyp");
const Treatmnt = require("../models/treatmnt");

// Handle incoming GET requests to /orders
router.get("/", (req, res, next) => {
  AcneTyp.find()
    .select("name description section cause treatmnt")
    .populate('treatmnt','tType name description' )
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        acneTyp: docs.map(doc => {
          return {
            name: doc.name,
            description:doc.description,
            section:doc.section,
            cause:doc.cause,
            treatmnt: doc.treatmnt,
            request: {
              type: "GET",
              url: "http://localhost:3000/acneTyps/" + doc._id
            }
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
  Treatmnt.findById(req.body.treatmntId)
    .then(treatmnt => {
      if (!treatmnt) {
        return res.status(404).json({
          message: "not found"
        });
      }
      const acneTyp = new AcneTyp({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        description:req.body.description,
        section:req.body.section,
        cause:req.body.cause,
        treatmnt: req.body.treatmntId
      });
      return acneTyp.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Stored",
        createdType: {
          _id: result._id,
          name:result.name,
          description:result.description,
          section:result.section,
          treatmnt: result.treatmnt,
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/acneTyps/" + result._id
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

router.get("/:acneTypId", (req, res, next) => {
  AcneTyp.findById(req.params.acneTypId)
    .populate('treatmnt')
    .exec()
    .then(acneTyp => {
      if (!acneTyp) {
        return res.status(404).json({
          message: "not found"
        });
      }
      res.status(200).json({
        acneTyp: acneTyp,
        request: {
          type: "GET",
          url: "http://localhost:3000/acneTyps"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:acneTypId", (req, res, next) => {
  AcneTyp.remove({ _id: req.params.acneTypId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/acneTyps"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;