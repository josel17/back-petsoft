const { Router } = require("express");
const { registerPerson, activeUser, disableUser } =
  require("../controller/user/user").default.default;
const { check } = require("express-validator");
const { validateFields } = require("../middleware/validate-fields").default;
const { selectors } = require("../controller/selectors/selectors");
const { getAll } = require("../controller/user/get_all");

const router = Router();

// login de usuario
router.post(
  "/register",
  [
    check("bodyData", "La informacion suministrada no es valida")
      .not()
      .isEmpty(),
    validateFields,
  ],
  registerPerson
);

router.post(
  "/active",
  [
    check("bodyData", "La informacion suministrada no es valida")
      .not()
      .isEmpty(),
    validateFields,
  ],
  activeUser
);

router.get("/getall", [], getAll);
router.post("/disable", [], disableUser);

router.get("/dataStart", [], selectors);

module.exports = router;
