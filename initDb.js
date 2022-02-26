/**
 * initDb.js
 * Inicialisation of the Data Base
 * */
"use strict";

require("dotenv").config();

const { askUser } = require("./lib/utils");
const { mongoose, Ads, Users } = require("./models");
const { connectMongoose } = require("./lib/connectMongoose");

const ADVERTS_JSON = "./adverts.json";
require("./lib/i18nSetup");

main().catch((err) => console.error("Error!", err));

async function main() {
  await connectMongoose;

  const answer = await askUser(
    "Are you sure you want to empty DB and load initial data? (no) "
  );
  if (answer.toLowerCase() !== "yes") {
    console.log("DB init aborted! Nothing has been done");
    return process.exit(0);
  }

  // Init our models. Collections Users and Adverts will delete and loade
  const adsResult = await initAds(ADVERTS_JSON);
  console.log(
    `\nAdverts: Deleted ${adsResult.deletedCount}, loaded ${adsResult.loadedCount} from ${ADVERTS_JSON}`
  );

  const usersResult = await initUsers();
  console.log(
    `\nUsers: Deleted ${usersResult.deletedCount}, loaded ${usersResult.loadedCount.length}`
  );

  // Close  the DB
  await mongoose.connection.close();
  console.log("\nDone.");
  return process.exit(0);
}

async function initAds(fichero) {
  const { deletedCount } = await Ads.deleteMany();
  const loadedCount = await Ads.cargaJson(fichero);
  return { deletedCount, loadedCount };
}

async function initUsers() {
  const { deletedCount } = await Users.deleteMany();
  const loadedCount = await Users.insertMany([
    {
      name: "userAnonymous",
      email: "user@example.com",
      typeUser: "anonymous",
      password: Users.hashPassword("1234"), //TODO
    },
    {
      name: "userWallaclone",
      email: "user2@example.com",
      typeUser: "userWallaclone",
      password: Users.hashPassword("4321"), //TODO
    },
  ]);
  return { deletedCount, loadedCount };
}
