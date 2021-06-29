import mongoose from 'mongoose';

const dbConnect = async () => {
  const db = mongoose.connection;
  // check if we have a connection to the database or if it's currently
  // connecting or disconnecting (readyState 1, 2, and 3)
  if (db && db.readyState >= 1) {
    return;
  }

  return mongoose.connect(
    process.env.MONGO_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
    (err) => {
      if (err) {
        console.error(err);
        console.log(`MongoDB wasn't able to connect :(`);
        process.exit();
      }
    }
  );
};

export default dbConnect;
