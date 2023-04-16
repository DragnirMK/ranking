const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const videoSchema = new mongoose.Schema({
  title: String,
  url: String,
});

const rateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoRates: [
    {
      videoIndex: {
        type: Number,
        required: true
      },
      rate: {
        type: Number,
        default: -1
      }
    }
  ]
});


const roomSchema = new mongoose.Schema({
  videos: [videoSchema],
  currentVideoIndex: { type: Number, default: 0 },
  pinCode: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  connectedUsers: [userSchema],
  players: [userSchema],
  rates: [rateSchema]
});

roomSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Room', roomSchema);
