const express = require('express');
const userController = require('../controllers/admin-controller/user-controller');
const router = express.Router();
const multer = require('multer');
const verifyToken = require("../middleware/verifytoken");
const nonAuth = require("../middleware/nonauth");

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

router.get('/', userController.redirectLogin);
router.get('/login',nonAuth, userController.getLogin);
router.get('/signup', nonAuth, userController.getSignup);
router.get('/home', verifyToken, userController.getHome);

router.post('/user/login', request_param.any(), userController.userLogin);
router.post('/user/signup', uploadFile.any(), userController.userSignup);
router.post('/user/apply', uploadFile.any(), userController.applySubmit);

router.all('/user/*', verifyToken);

router.get('/user/list', userController.getAllUser);
router.get('/user/create', userController.createUser);
router.get('/user/edit/:id', userController.editUser);
router.get('/user/delete/:id', userController.deleteUser);
router.post('/user/insert', uploadFile.any(), userController.insertUser);
router.post('/user/update', uploadFile.any(), userController.updateUser);
router.get('/user/profile/:id', userController.getUserProfile);
router.post('/user/profile/update', uploadFile.any(), userController.updateUserProfile);
router.get('/user/logout', userController.userLogout);

router.get('/jobs',verifyToken,userController.getJobs);
router.get('/apply', userController.getApply)
router.get('/user/applylist',verifyToken, userController.applyList);
router.get('/sucess',verifyToken,userController.getSucess);

module.exports = {
	routes: router
};