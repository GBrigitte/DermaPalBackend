const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Whitehead = require("../models/whitehead");


// Handle incoming GET requests to /whitehead
router.get("/", (req, res, next) => {
  Whitehead.find()
    .select("TreatmentType Name Description")
    .exec()
    .then(docs => {
      res.status(200).json({
        AcneType: "Whiteheads Acne",
        Description: "Whiteheads are noninflammatory acne that can be formed when pores get clogged by sebum, dead skin cells, and dirt clog yoour pores. Unlikely blackheads, the top of the pore closes up and it looks like a small bump protruding from the skin.",
        Causes: "Some common causes are: Your forehead is one of the most common areas to get spots. The notorious T-zone (forehead, nose, chin) produces more sebum than the rest of your face and hair follicles on your forehead tend to be bigger than others, making the perfect recipe for forehead breakouts. Forehead whiteheads may also be the result of wearing a cap or helmet. If you sweat while wearing them and then leave them to their own devices, they become a breeding ground for bacteria. The cloth that touches your forehead should be sanitized on a regular basis. Other Causes: anxiety, extreme stress, family history of acne, menopause, menstruation, puberty, overly dry skin (usually from using too many acne products), wearing oil-based skin products and makeup.",      
        WhiteheadTreatments: docs.map(doc => {
          return {
            TreatmentType: doc.TreatmentType,
            Name:doc.Name,
            Description:doc.Description
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
      const whitehead = new Whitehead({
        _id: new mongoose.Types.ObjectId(),
        TreatmentType:req.body.TreatmentType,
        Name: req.body.Name,
        Description:req.body.Description,
      });
      whitehead
        .save()
        .then(result => {
          console.log(result);
          res.status(201).json({
            message: "Created successfully",
            createdTreatment: {
                TreatmentType:result.TreatmentType,
                Name: result.Name,
                Description:result.Description,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/Whiteheads/" + result._id
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


router.get("/:whiteheadId", (req, res, next) => {
        const id = req.params.whiteheadId;
        Whitehead.findById(id)
          .select('TreatmentType Name Description')
          .exec()
          .then(doc => {
            console.log("From database", doc);
            if (doc) {
              res.status(200).json({
                  whitehead: doc,
                  request: {
                      type: 'GET',
                      url: 'http://localhost:3000/Whiteheads'
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
      

router.patch("/:whiteheadId", (req, res, next) => {
        const id = req.params.whiteheadId;
        const updateOps = {};
        for (const ops of req.body) {
          updateOps[ops.propName] = ops.value;
        }
        Whitehead.update({ _id: id }, { $set: updateOps })
          .exec()
          .then(result => {
            res.status(200).json({
                message: 'Updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/Whiteheads/' + id
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
      

router.delete("/:whiteheadId", (req, res, next) => {
        const id = req.params.whiteheadId;
        Whitehead.remove({ _id: id })
          .exec()
          .then(result => {
            res.status(200).json({
                message: 'Deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/Whiteheads'
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
      