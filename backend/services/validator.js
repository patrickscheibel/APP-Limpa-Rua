const { body } = require('express-validator');

const createUserValidationRules = () => [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 3 }),
    body('phone').isLength({ min: 8 }),
    body('cep').isLength({ min: 8 })
];

const updateUserValidationRules = () => [
    body('id').isNumeric(),
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 3 }),
    body('phone').isLength({ min: 8 }),
    body('cep').isLength({ min: 8 })
];

const loginUserValidationRules = () => [
  body('email').isEmail(),
  body('password').isLength({ min: 3 })
];

module.exports = {
  createUserValidationRules,
  updateUserValidationRules,
  loginUserValidationRules
};