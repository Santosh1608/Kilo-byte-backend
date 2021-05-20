const mongoose = require("mongoose");
try {
  mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log("DB connected");
} catch {
  console.log("ERROR IN DB CONNECTION");
  process.exit(0);
}
