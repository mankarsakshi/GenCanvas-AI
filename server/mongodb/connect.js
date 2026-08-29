import mongoose from 'mongoose';

const connectDB = (url) => {
  mongoose.set('strictQuery', true);

  return mongoose
    .connect(url)
    .then(() => {
      console.log('MongoDB connected successfully');
    })
    .catch((err) => {
      console.error('Failed to connect with MongoDB:');
      console.error(err.message || err);
      throw err;
    });
};

export default connectDB;
