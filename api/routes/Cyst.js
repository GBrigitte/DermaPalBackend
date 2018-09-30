const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");



const CysticAcne = require("../models/cysticAcn");





// Handle incoming GET requests to /cystic

router.get("/", (req, res, next) => {

  CysticAcne.find()

    .select("TreatmentType Name Description Product Brand Instructions")

    .exec()

    .then(docs => {

      res.status(200).json({

        AcneType: "Cystic Acne",

        Description: "Cysts can develop when pores are clogged by a combination of bacteria, sebum, and dead skin cells. The clogs occur deep within the skin and are further below the surface than nodules. These large red or white bumps are often painful to the touch. Cysts are the largest form of acne, and their formation usually results from a severe infection. This type of acne is also the most likely to scar. Treatments include over-the-counter creams and cleanser, as well as prescription antibiotics. The prescription medication isotretinoin (Sotret) is commonly used to treat cysts. In severe cases, your dermatologist may surgically remove a cyst.",

        Causes: "The biggest factor causing acne is the hormonal changes in adolescent teenage years. During puberty, levels of circulating androgen hormones increase dramatically, which causes an increase in sebum production; skin cells also begin to grow quicker. Acne is not confined to teenagers, however, and other factors are involved, including: hormonal changes related to the menstrual cycle, pregnancy, birth control, the use of hormone therapy, and stress. Other causes include: greasy cosmetics, cleansers, lotions, clothing, high levels of humidity and sweating, genetics, some drugs and chemicals (corticosteroids, lithium, phenytoin, and isoniazid)",    

        Treatments: docs.map(doc => {

          return {

            TreatmentType: doc.TreatmentType,

            Name:doc.Name,

            Description:doc.Description,
            Product:doc.Product,
            Brand:doc.Brand,
            Instructions:doc.Instructions,
            
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

      const cysticAcne = new CysticAcne({

        _id: new mongoose.Types.ObjectId(),

        TreatmentType:req.body.TreatmentType,

        Name: req.body.Name,

        Description:req.body.Description,
        Product:req.body.Product,
        Brand:req.body.Brand,
        Instructions:req.body.Instructions,

      });

      cysticAcne

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
                Product:result.Product,
                Brand:result.Brand,
                Instructions:result.Instructions,

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

        CysticAcne.findById(id)

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

        CysticAcne.update({ _id: id }, { $set: updateOps })

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

        CysticAcne.remove({ _id: id })

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

      