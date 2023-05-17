//  #     #    #    ### #     #
//  ##   ##   # #    #  ##    #
//  # # # #  #   #   #  # #   #
//  #  #  # #     #  #  #  #  #
//  #     # #######  #  #   # #
//  #     # #     #  #  #    ##
//  #     # #     # ### #     #

const asyncHandler = require("express-async-handler");
const MyError = require("../utils/myError");
// const paginate = require("../utils/paginate-sequelize");
// const sendEmail = require("../utils/email");
// const sendSMS = require("../utils/sms");
const crypto = require("crypto");
const moment = require("moment");
// const { now } = require("../utils/moment");
const { Op } = require("sequelize");
// const logger = require("../utils/logger");
// const { frcLogStream, frcErrLogStream } = require("../middlewares/logger");

// var cookieOptions =  {
//     expires: moment().add(2, 'h').utc(8).toDate(),
//     httpOnly: process.env.COOKIE_ENV === 'development' ? true : true,
//     secure: process.env.COOKIE_ENV === 'development' ? false : true,
//     sameSite: 'none',
// }

const getCookieOptions = () => {
  return {
    expires: moment().add(2, "h").utc(8).toDate(),
    httpOnly: process.env.COOKIE_ENV === "development" ? true : false,
    secure: process.env.COOKIE_ENV === "development" ? false : true,
    sameSite: process.env.COOKIE_ENV === "development" ? null : "none",
  };
};

exports.createUser = asyncHandler(async (req, res, next) => {
  req.body.action = "create user";
  //    req.body.createdAt = now()
  //    req.body.updatedAt = now()
  const exUser = await req.db.user.findOne({
    where: {
      register: req.body.register,
    },
  });

  if (exUser) {
    throw new MyError("user already created", 400);
  }
  const user = await req.db.user.create(req.body);

  user.password = "";

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // let shareholder;

  // Оролтыг шалгана
  if (!email || !password) {
    throw new MyError("main_error_user_no_email_password", 400);
  }

  //Тухайн хэрэглэгчийг хайна
  const user = await req.db.user
    .scope("withPassword")
    .findOne({ where: { email: email } });

  // if (user?.status === "9" && !req.body.companyId) {
  //   throw new MyError("main_error_company_not_found", 400);
  // }

  if (!user) {
    throw new MyError(`main_error_user_not_found`, 400);
  }
  // console.log("USER: ", password);
  const ok = await user.checkPassword(password);
  // console.log("OK: ", ok);
  if (!ok) {
    throw new MyError("main_error_user_password_not_match", 401);
  }
  const token = user.getJsonWebToken();

  var updateUser = await req.db.user.findByPk(user.id);
  updateUser.action = "login";
  await updateUser.save();
  user.password = "";

  var cookieOptions = getCookieOptions();
  res.status(200).cookie("token", token, cookieOptions).json({
    success: true,
    accessToken: token,
    data: {
      user,
    },
  });
});
exports.getUser = asyncHandler(async (req, res, next) => {
  // // console.log(req.params.id)
  // // console.log(req.db)

  // let user = await req.db.user.findAll(req.params.id);
  let user = await req.db.user.findAll();
  // // console.log(user)
  if (!user) {
    // // console.log('i am here')
    throw new MyError(`main_error_user_not_found`, 400);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});
