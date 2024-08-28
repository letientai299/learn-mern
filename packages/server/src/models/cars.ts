import mongoose from 'mongoose';

interface Car {
  name: string;
  year: number;
  _updateAt: number; // unix millis, _createAt can be derived from _id.
}

const carSchema = new mongoose.Schema<Car>(
  {
    name: { type: String, required: true, unique: true, index: true },
    year: { type: Number, required: false, default: new Date().getFullYear() },
    _updateAt: { type: Number, required: false },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

carSchema.virtual('_createAt').get(function () {
  return this._id.getTimestamp().getTime();
});

carSchema.virtual('createAt').get(function () {
  return this._id.getTimestamp();
});

carSchema.virtual('updateAt').get(function () {
  return new Date(this._updateAt);
});

carSchema.pre('save', function (next) {
  this._updateAt = Date.now();
  return next();
});

export const Cars = mongoose.model('cars', carSchema);
