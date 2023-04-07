const Room = require('../models/room');

async function asyncCall() {
    const room = await Room.findOne({'pinCode': 7303}).exec();
    console.log(room);
    console.log(room.players);
}
  
asyncCall();
