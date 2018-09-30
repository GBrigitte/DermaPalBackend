const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Pustule = require("../models/Pustule");


// Handle incoming GET requests to /PUSTULEACNE
router.get("/", (req, res, next) => {
  Pustule.find()
    .select("TreatmentType Name Description Product Brand Instructions")
    .exec()
    .then(docs => {
      res.status(200).json({
        AcneType: "Pustule Acne",
        Description: "Papules or pimples occur when the walls surrounding the pores break down from severe inflammation. This results in hard, clogged pores that are tender to the touch. The skin around these pores is usually pink. Pustules that suddenly erupt all over the face or in patches on various parts of the body may indicate that you have a bacterial infection. Contact your doctor if you have a sudden outbreak of pustules. You should also call your doctor if your pustules are painful or leaking fluid. These may be symptoms of a serious skin infection.",
        Causes: "Pustules may form when your skin becomes inflamed as a result of an allergic reaction to food, environmental allergens, or poisonous insect bites. However, the most common cause of pustules is acne. Acne develops when the pores of your skin become clogged with oil and dead skin cells. This blockage causes patches of skin to bulge, resulting in a pustule. Pustules usually contain pus due to an infection of the pore cavity. Pustules caused by acne can become hard and painful. When this occurs, the pustule becomes a cyst. This condition is known as cystic acne.",
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
      const pustule = new Pustule({
        _id: new mongoose.Types.ObjectId(),
        TreatmentType:req.body.TreatmentType,
        Name: req.body.Name,
        Description:req.body.Description,
        Product:req.body.Product,
        Brand:req.body.Brand,
        Instructions:req.body.Instructions,
      });
      pustule
        .save()
        .then(result => {
          console.log(result);
          res.status(201).json({
            message: "Created successfully",
            PustuleTreatments: {
                TreatmentType:result.TreatmentType,
                Name: result.Name,
                Description:result.Description,
                _id: result._id,
                Product:result.Product,
                Brand:result.Brand,
                Instructions:result.Instructions,
                request: {
                    type: 'GET',
                    url: "http://localhost:3001/Pustule/" + result._id
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


router.get("/:pustuleID", (req, res, next) => {
        const id = req.params.pustuleID;
        Pustule.findById(id)
          .select('TreatmentType Name Description')
          .exec()
          .then(doc => {
            console.log("From database", doc);
            if (doc) {
              res.status(200).json({
                  pustule: doc,
                  request: {
                      type: 'GET',
                      url: 'http://localhost:3001/Pustule'
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
      

router.patch("/:pustuleID", (req, res, next) => {
        const id = req.params.pustuleID;
        const updateOps = {};
        for (const ops of req.body) {
          updateOps[ops.propName] = ops.value;
        }
        Pustule.update({ _id: id }, { $set: updateOps })
          .exec()
          .then(result => {
            res.status(200).json({
                message: 'Updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3001/Pustule/' + id
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
      

router.delete("/:pustuleID", (req, res, next) => {
        const id = req.params.pustuleID;
        Pustule.remove({ _id: id })
          .exec()
          .then(result => {
            res.status(200).json({
                message: 'Deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3001/Pustule'
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
      