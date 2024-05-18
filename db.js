import mongoose from "mongoose";

mongoose
  .connect(process.env.DBI_UR)
  .then(() => console.log("Database connection successful"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
