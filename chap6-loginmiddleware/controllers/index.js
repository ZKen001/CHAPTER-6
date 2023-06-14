const UserController = require("./user_controller");
const userDb         = require("../mysql/sql");
const userRoute = () => {
  const router = require("express").Router();
  const checkAuthenticationMiddleware = require("../middlewares/check_authentication");
  const controller = new UserController();
  const controllerdb = new userDb();

  router.get("/login", controller.loginPage);
  router.post("/login", controller.doLogin);
  router.get("/user" , controllerdb.user);
  router.get("/register", controller.registerPage);
  router.post("/register", controller.doregister);

  const authenticated = router.use(checkAuthenticationMiddleware);
  authenticated.get("/", controller.userPage);
  authenticated.get("/admin", controller.adminPage);

  router.get("/logout", controller.logout);

  return router;
};

module.exports = (app) => {
  app.use("/", userRoute());
};
