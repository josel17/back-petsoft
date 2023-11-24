import { Router } from "express";
import { login, verifyToken } from "../controller/auth/auth";
import { check } from "express-validator";
import { validateFields } from "../middleware/validate-fields";

const router = Router();

//login de usuario
router.post(
  "/login",
  [
    check("bodyData", "La informacion suministrada no es valida")
      .not()
      .isEmpty(),
    validateFields,
  ],
  login
);

//verify token
router.get(
  "/verifyToken",
  [
    //check('bodyData','La informacion suministrada no es valida').not().isEmpty(),
    //validateFields
  ],
  verifyToken
);

export default router;
