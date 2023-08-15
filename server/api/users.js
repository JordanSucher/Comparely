const router = require("express").Router();
const {
  models: { User },
} = require("../db");
module.exports = router;

//get all users
// GET /api/users
router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ["id", "email", "firstName", "lastName"],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET /api/users/:userId
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "email", "firstName", "lastName", "companyName", "companyUrl", "openApiKey" ],
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
});


// Delete User from db: Delete /api/users/:userId
router.delete("/:id", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    await user.destroy();

    //create object to hold updated product info and a update message
    const details = {
      message: "User Deleted 🗑️ ",
      user,
    };
    //send details object as JSON response
    res.json(details);
  } catch (err) {
    next(err);
  }
});
