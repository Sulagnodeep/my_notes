const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/userdb', { 
    useNewUrlParser: true
}).then(() => {
    console.log("Connected");
}).catch((e) => {
    console.log('Connection Failed.', e);
    process.exit();
});