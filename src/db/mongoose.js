const mongoose = require("mongoose")

mongoURL = process.env.MONGODB_URL

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
