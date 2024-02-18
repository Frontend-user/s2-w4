"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = exports.blogIdValidation = exports.blogWebUrlValidation2 = exports.blogWebUrlValidation = exports.blogDescValidation = exports.blogNameValidation = void 0;
const express_validator_1 = require("express-validator");
const pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
exports.blogNameValidation = (0, express_validator_1.body)('name').trim().isLength({ min: 1, max: 15 }).withMessage({
    message: 'name',
    field: 'name'
});
exports.blogDescValidation = (0, express_validator_1.body)('description').trim().isLength({ min: 4, max: 500 }).withMessage({
    message: 'description is wrong',
    field: 'description'
});
exports.blogWebUrlValidation = (0, express_validator_1.check)('websiteUrl').matches(pattern).withMessage({
    message: 'websiteUrl is wrong',
    field: 'websiteUrl'
});
exports.blogWebUrlValidation2 = (0, express_validator_1.body)('websiteUrl').trim().isLength({ min: 6, max: 100 }).withMessage({
    message: 'websiteUrl is wrong',
    field: 'websiteUrl'
}).matches(pattern).withMessage({
    message: 'websiteUrl is wrong',
    field: 'websiteUrl'
});
exports.blogIdValidation = (0, express_validator_1.body)('id').trim().isLength({ min: 1, max: 300 }).withMessage({
    message: 'id is wrong',
    field: 'id'
});
const inputValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
    if (errors.length) {
        let errorsForClient = [];
        console.log(errors, 'errors');
        for (const error of errors) {
            errorsForClient.push(error.msg);
            if (error.msg.field === 'refreshToken') {
                res.sendStatus(401);
                return;
            }
        }
        res.status(400).json({ errorsMessages: errorsForClient });
        return;
    }
    else {
        next();
    }
};
exports.inputValidationMiddleware = inputValidationMiddleware;
//# sourceMappingURL=blogs-validation.js.map