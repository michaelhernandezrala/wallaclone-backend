module.exports = {
  mongoose: require("mongoose"),
  connectMongoose: require("../lib/connectMongoose"),
  Ads: require("./Adverts"),
  User: require("./User"),
};
