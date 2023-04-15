const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const videoSchema = new mongoose.Schema({
  name: String,
  link: String,
});

const scoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoScores: [
    {
      videoIndex: {
        type: Number,
        required: true
      },
      score: {
        type: Number,
        default: -1
      }
    }
  ]
});


const roomSchema = new mongoose.Schema({
  videos: [videoSchema],
  pinCode: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  players: [playerSchema],
  scores: [scoreSchema]
});

roomSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Room', roomSchema);
