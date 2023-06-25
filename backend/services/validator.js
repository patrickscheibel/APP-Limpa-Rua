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

const createOccurrenceValidationRules = () => [
    body('user_id').isNumeric(),
    body('description').isLength({ min: 3 }),
    body('photo_url').isLength({ min: 100 }),
    body('latitude').isLength({ min: 1 }),
    body('longitude').isLength({ min: 1 }),
    body('date').isISO8601()
];

const updateOccurrenceValidationRules = () => [
    body('id').isNumeric(),
    body('user_id').isNumeric(),
    body('description').isLength({ min: 3 }),
    body('latitude').isLength({ min: 1 }),
    body('longitude').isLength({ min: 1 }),
    body('date').isISO8601()
];

module.exports = {
  createUserValidationRules,
  updateUserValidationRules,
  loginUserValidationRules,
  createOccurrenceValidationRules,
  updateOccurrenceValidationRules,
};