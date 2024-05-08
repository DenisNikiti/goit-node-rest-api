import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://jackxarkness:IcRNPVVuoM17CUXX@cluster0.rhxymkr.mongodb.net/Contacts"
  )
  .then(() => console.log("Database connection successful"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
