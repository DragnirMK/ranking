const bcrypt = require('bcrypt');

myPlaintextPassword = "LuigiCourse"
saltRounds = 10

bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    console.log(hash)
});