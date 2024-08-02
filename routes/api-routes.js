const express = require('express');
const router = express.Router();
const userController = require('../controllers/api-controller/user-controller');
const checkAuth = require("../middleware/check-auth");
const multer = require('multer')

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./public/uploads/user");
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage
});

const request_param = multer();

router.post('/user/login', request_param.any(), userController.userLogin)
router.get('/user/list', request_param.any(), userController.getAllUser);
//router.get('/user/applylist',request_param.any(), userController.applyList);

module.exports = {
    routes: router
};