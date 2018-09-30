const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");



const None = require("../models/None");





// Handle incoming GET requests to /cystic

router.get("/", (req, res, next) => {

const None = require("../models/None");
None.find()

    .select("TreatmentType Name Description")

    .exec()

    .then(docs => {

      res.status(200).json({

        AcneType: " YOU HAVE NO ACNE!",

        Description: "",

        Causes: "",    

        Treatments: docs.map(doc => {

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

      const none = new None({

        _id: new mongoose.Types.ObjectId(),

        TreatmentType:req.body.TreatmentType,

        Name: req.body.Name,

        Description:req.body.Description,

      });

      none

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

                    url: "http://localhost:3000/Cyst/" + result._id

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





router.get("/:CysticId", (req, res, next) => {

        const id = req.params.CysticId;

        None.findById(id)

          .select('TreatmentType Name Description')

          .exec()

          .then(doc => {

            console.log("From database", doc);

            if (doc) {

              res.status(200).json({

                  cysticAcne: doc,

                  request: {

                      type: 'GET',

                      url: 'http://localhost:3000/Cyst'

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

      



router.patch("/:CysticId", (req, res, next) => {

        const id = req.params.CysticId;

        const updateOps = {};

        for (const ops of req.body) {

          updateOps[ops.propName] = ops.value;

        }

        None.update({ _id: id }, { $set: updateOps })

          .exec()

          .then(result => {

            res.status(200).json({

                message: 'Updated',

                request: {

                    type: 'GET',

                    url: 'http://localhost:3000/Cyst/' + id

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

      



router.delete("/:CysticId", (req, res, next) => {

        const id = req.params.CysticId;

        None.remove({ _id: id })

          .exec()

          .then(result => {

            res.status(200).json({

                message: 'Deleted',

                request: {

                    type: 'POST',

                    url: 'http://localhost:3000/Cyst'

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
