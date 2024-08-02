var mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

var userSchema = new Schema(
    {
        full_name: {
            type: String
        },
        email: {
            type: String
        },
        phone: {
            type: String
        },
        profile_pic: {
            type: String
        },
        password: {
            type: String
        },
        role: {
            type: String,
            default: 'user',
            enum: ['user', 'admin']
        },
        isLogin: {
            type: Boolean,
            default: false,
            enum: [true, false]
        },
        country_id: {
            type: Schema.Types.ObjectId,
            ref: 'Country'
        },
        gmail: {
            type: String
        },
        job_id: {
           type: String
        },
        upload_cv:{
            type: String
        },
        status: {
            type: Boolean,
            default: true,
            enum: [true, false]
        },
        isDeleted: {
            type: Boolean,
            default: false,
            enum: [true, false]
        },
    },
    { timestamps: true, versionKey: false }
);

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.compareHash = function (password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword, null);
};

module.exports = mongoose.model('User', userSchema);
