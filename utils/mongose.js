const mongoose = require('mongoose');

module.exports = {
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
            connectTimeoutMS: 10000,
            maxPoolSize: 50,
            family: 4
        };

        mongoose.connect(`mongodb+srv://PhantHive:${process.env.DB}@cluster0.vrloe.mongodb.net/<dbname>?retryWrites=true&w=majority`, dbOptions);
        mongoose.Promise = global.Promise;

        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected!');
        });

        mongoose.connection.on('err', err => {
            console.error(`Mongoose error connection \n ${err.stack}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('Mongoose connection lost');
        });
    }

}