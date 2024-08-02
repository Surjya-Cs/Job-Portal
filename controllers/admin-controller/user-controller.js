const userModel = require("../../models/user-model");
const User = new userModel();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const variables = require('../../includes/variables');
const CountryModel = require("../../models/country-model");
const mongoose = require("mongoose");

class userController {

    async redirectLogin(req, res) {
        try {
            res.redirect('/login');
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    async getLogin(req, res) {
        try {
            res.render('user/login', {
                page_title: "Login"
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    };
    async getHome(req, res) {
        try {
            res.render('user/home', {
                page_title: "Home"
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    async userLogin(req, res) {

        const userData = await userModel.find({
            "isDeleted": false,
            "email": req.body.email.toLowerCase().trim()
        });

        if (!_.isEmpty(userData)) {

            if (User.compareHash(req.body.password, userData[0].password)) {
                const payload = {
                    id: userData[0]._id,
                    email: userData[0].email,
                    isLogin: userData[0].isLogin
                };

                let session_time = '12h';

                const token = jwt.sign(payload, process.env.JWT_SECRET_TOKEN_KEY, {
                    expiresIn: session_time,
                });

                req.session.user = userData[0];
                req.session.token = token;

                const userUpdate = await userModel.findByIdAndUpdate({ _id: userData[0]._id }, { isLogin: true });

                req.flash("success", variables.loginSuccessMsg);
                res.redirect('/home');

                // up dassbord changed

                // if (userData[0].role == 'admin') {
                // res.redirect('/dashboard');
                // } else {
                //     res.redirect(`/user/profile/${userData[0]._id}`);
                // }

            } else {
                req.flash("error", variables.loginFailedMsg);
                res.redirect('/login');
            }
        } else {
            req.flash("error", variables.loginFailedMsg);
            res.redirect('/login');
        }
    };

    async getSignup(req, res) {
        try {
            let countryData = await CountryModel.find({ "isDeleted": false });

            res.render('user/signup', {
                page_title: "Register",
                country_data: countryData
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    async getUserProfile(req, res) {
        try {
            const userData = await userModel.findById(req.params.id);

            res.render('user/profile', {
                page_title: "My Profile",
                user_data: userData
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    async userSignup(req, res) {
        if (req.files.length > 0) {
            req.body.profile_pic = req.files[0].filename;
        };
        req.body.country_id = mongoose.Types.ObjectId(req.body.country_id);
        req.body.password = User.generateHash(req.body.password);
        let userData = await new userModel(req.body);
        userData.save();

        req.flash("success", variables.registerSuccessMsg);
        res.redirect('/login');
    };

    async getUserList(req, res) {
        try {
            res.redirect('/user/list');
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    async getAllUser(req, res) {
        try {
            const userData = await userModel.find({
                "isDeleted": false,
                "role": 'user',
                "isLogin": false
            }).populate("country_id");

            res.render('user/list', {
                page_title: "User List",
                user_list: userData
            })
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    async createUser(req, res) {
        try {
            res.render('user/create', {
                page_title: "Create User"
            })
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    async editUser(req, res) {
        try {
            const userData = await userModel.findById(req.params.id);

            res.render('user/edit', {
                page_title: "Edit User",
                user_data: userData
            })
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    async insertUser(req, res) {
        try {
            if (req.files.length > 0) {
                req.body.profile_pic = req.files[0].filename;
            };
            req.body.password = User.generateHash(req.body.password);
            let userData = await new userModel(req.body);
            userData.save();

            req.flash("success", variables.userCreateSuccessMsg);
            res.redirect('/user/list');
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    async updateUser(req, res) {
        try {
            if (req.files.length > 0) {
                req.body.profile_pic = req.files[0].filename;
            };

            req.body.role = 'user'

            let userData = await userModel.findByIdAndUpdate(req.body.user_id, req.body);

            req.flash("success", variables.userUpdateSuccessMsg);
            res.redirect('/user/list');
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    async deleteUser(req, res) {
        try {
            let userData = await userModel.findOne({
                "_id": mongoose.Types.ObjectId(req.params.id),
                "isDeleted": false
            });

            if (!_.isEmpty(userData)) {
                let userDelete = await userModel.findByIdAndUpdate(req.params.id, {
                    "isDeleted": true
                });

                if (userData.profile_pic != null && fs.existsSync(__dirname + '/../../' + 'public/uploads/user/' + userData.profile_pic)) {
                    fs.unlinkSync(__dirname + '/../../' + 'public/uploads/user/' + userData.profile_pic);
                }

                req.flash("success", variables.userDeleteSuccessMsg);

            } else {
                req.flash("error", variables.errorMsg);
            }

            res.redirect('/user/list');
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    async updateUserProfile(req, res) {
        try {
            if (req.files.length > 0) {
                req.body.profile_pic = req.files[0].filename;
            };

            let userData = await userModel.findByIdAndUpdate(req.body.user_id, req.body);

            req.flash("success", variables.profileUpdateSuccessMsg);
            res.redirect(`/user/profile/${req.body.user_id}`);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async userLogout(req, res) {
        try {
            const user = await userModel.findByIdAndUpdate({ _id: req.user.id }, { isLogin: false });

            if (user) {
                req.session.destroy();
                res.redirect('/');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getJobs(req, res) {
        try {
            res.render('user/jobs', {
                page_title: "Jobs"
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async getApply(req, res) {
        try {
            res.render('user/apply', {
                page_title: "Apply"
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    // async userSignup(req, res) {
    //     if (req.files.length > 0) {
    //         req.body.profile_pic = req.files[0].filename;
    //     };
    //     req.body.country_id = mongoose.Types.ObjectId(req.body.country_id);
    //     req.body.password = User.generateHash(req.body.password);
    //     let userData = await new userModel(req.body);
    //     userData.save();

    //     req.flash("success", variables.registerSuccessMsg);
    //     res.redirect('/login');
    // };



    async applySubmit(req, res){
        if(req.files.length> 0){
            req.body.upload_cv = req.files[0].filename;
        };
        let userData = await new userModel(req.body);
        userData.save();
        req.flash("Sucess", variables.submitSucess);
        res.redirect('/sucess');
    }




    async applyList(req, res){
        try{
            res.render('/user/applylist')
        }catch(error){
            throw error;
        }

    }

    async getSucess(req, res){
        try{
            res.render('user/sucess')
        }catch(error){
            throw error;
        }
    }

}

module.exports = new userController();