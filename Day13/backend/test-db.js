import mongoose from 'mongoose';

mongoose.connect("mongodb+srv://welcomeahmad5_db_user:569W04eqAsSVcAk7@cluster0.qgddntf.mongodb.net/?appName=Cluster0")
  .then(async () => {
    const db = mongoose.connection.db;
    const users = await db.collection('members').find({ email: 'p@gmail.com' }).toArray();
    console.log("Found user p@gmail.com:", users.length > 0);
    process.exit(0);
  })
  .catch(err => {
    console.log("Error:", err);
    process.exit(1);
  });
