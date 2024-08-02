const mongoose = require('mongoose');

module.exports = () => {
    try {
        mongoose.connect(process.env.MONGODB_URL,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        console.log('DB connected successfully');
    } catch (error) {
        console.error('DB connection error', error);
    }
}