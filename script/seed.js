const {
  db,
  models: { User },
} = require("../server/db");


const seed = async () => {

  const users = await Promise.all([
    User.create({
      firstName: "cody",
      lastName: "johnson",
      email: "codyj@hackme.com",
      password: "123",
    }),
    User.create({
      firstName: "murphy",
      lastName: "law",
      email: "murphyl@hackme.com",
      password: "123",
    }),
    User.create({
      firstName: "es",
      lastName: "ju",
      email: "ej@hackme.com",
      password: "123",
      companyName: "Eston's Eucolyptus",
      companyUrl: "Essieseucos.com",
      openApiKey: "4206969420woof"
    }),
  ]);

}

module.exports = seed;
