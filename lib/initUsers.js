/**
 * initUsers.js
 * @returns Two new users into de Data Base Users
 */
const initUsers = async function initUsers() {
  const { deletedCount } = await Users.deleteMany();
  const loadedCount = await Users.insertMany([
    {
      name: "userAnonymous",
      email: "user@example.com",
      typeUser: "anonymous",
      password: Users.hashPassword("1234"),
    },
    {
      name: "userWallaclone",
      email: "user2@example.com",
      typeUser: "userWallaclone",
      password: Users.hashPassword("4321"),
    },
  ]);
  return { deletedCount, loadedCount };
};

module.exports = initUsers;
