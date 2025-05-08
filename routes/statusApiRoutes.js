const express = require("express");
const router = express.Router();

const {
  addLoggedInUserSno,
  submitTask,
  approveTask,
  rejectTask,
  withdrawTask,
} = require("../controllers/statusApiController");

const { verifyjwt } = require("../middlewares/verifyJWT");

router.put("/api/status/submit/", verifyjwt, addLoggedInUserSno, submitTask);
router.put("/api/status/withdraw/:id", verifyjwt, withdrawTask);
router.put("/api/status/approve/:id", verifyjwt, approveTask);
router.put("/api/status/reject/:id", verifyjwt, rejectTask);

module.exports = router;
