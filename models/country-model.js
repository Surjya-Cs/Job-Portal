var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var countrySchema = new Schema(
    {
        country_name: {
            type: String
        },
        country_code: {
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

module.exports = mongoose.model('Country', countrySchema);
