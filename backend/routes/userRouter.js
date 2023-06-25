const express = require('express');
const router = express.Router();
const user = require('../services/userService');
const { validationResult } = require('express-validator');
const { createUserValidationRules, updateUserValidationRules, loginUserValidationRules, findByIdUserValidationRules,findByEmailUserValidationRules } = require('../services/validator');

/* GET users */
router.get("/", async function (req, res, next) {
  try {
    res.json(await user.index(req.query.page));
  } catch (err) {
    console.error(`Error while getting user `, err.message);
    next(err);
  }
});

/* LOGIN user */
router.post("/login", loginUserValidationRules(), async function (req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    res.json(await user.login(req.body, res));
  } catch (err) {
    console.error(`Error while getting user `, err.message);
    next(err);
  }
});

/* CREATE user */
router.post("/create", createUserValidationRules() ,async function (req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    res.json(await user.create(req.body, res));
  } catch (err) {
    console.error(`Error while creating user`, err.message);
    next(err);
  }
});

/* UPDATE user */
router.post("/update", updateUserValidationRules(), async function (req, res, next) {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userData = await user.findUserById(req.body.id);
    if(userData == null) {
      return res.status(400).json({'message': "User id not found" });
    }

    res.json(await user.update(req.body, res));
  } catch (err) {
    console.error(`Error while updating user`, err.message);
    next(err);
  }
});

/* DELETE user */
router.delete("/delete/:id", async function (req, res, next) {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({'mensage': "Parameter id not found" });
    }

    const userData = await user.findUserById(userId);
    if (userData == null) {
      return res.status(400).json({'message': "User id not found" });
    }

    res.json(await user.remove(userId, res));
  } catch (err) {
    console.error(`Error while deleting user`, err.message);
    next(err);
  }
});

/* Find user by id */
router.post("/findById", findByIdUserValidationRules(), async function (req, res, next) {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userData = await user.findUserById(req.body.id);
    if(userData == null) {
      return res.status(400).json({'message': "User id not found" });
    }
    return res.status(200).json({ userData });
  } catch (err) {
    console.error(`Error while updating user`, err.message);
    next(err);
  }
});

/* Find user by email */
router.post("/findByEmail", findByEmailUserValidationRules(), async function (req, res, next) {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userData = await user.findUserByEmail(req.body.email);
    if(userData == null) {
      return res.status(400).json({'message': "User email not found" });
    }
    return res.status(200).json({ userData });
  } catch (err) {
    console.error(`Error while updating user`, err.message);
    next(err);
  }
});

module.exports = router;