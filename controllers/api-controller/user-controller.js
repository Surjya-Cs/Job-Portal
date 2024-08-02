const userModel = require("../../models/user-model");
const User = new userModel();
const variables = require('../../includes/variables');
const jwt = require("jsonwebtoken");

class userController {

    async userLogin(req, res) {
        try {
            const userData = await userModel.find({
                "isDeleted": false,
                "email": req.body.email.toLowerCase().trim()
            });

            if (!_.isEmpty(userData)) {

                if (User.compareHash(req.body.password, userData[0].password)) {
                    const payload = {
                        id: userData[0]._id,
                    };

                    let session_time = '12h';

                    const token = jwt.sign(payload, process.env.JWT_SECRET_TOKEN_KEY, {
                        expiresIn: session_time,
                    });

                    res.status(200).send({
                        "status": 200,
                        "data": userData,
                        "token": token,
                        "message": variables.loginSuccessMsg
                    });
                } else {
                    res.status(201).send({
                        "status": 201,
                        "data": {},
                        "message": variables.loginFailedMsg
                    });
                }
            } else {
                res.status(201).send({
                    "status": 201,
                    "data": {},
                    "message": variables.loginFailedMsg
                });
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getAllUser(req, res) {
        try {
            const userData = await userModel.find({
                "isDeleted": false
            });

            res.status(200).send({
                "status": 200,
                "data": userData,
                "message": variables.dataFetchSuccessMsg
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    };
}

module.exports = new userController();