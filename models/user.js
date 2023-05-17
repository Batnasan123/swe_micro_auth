const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt-node");
const crypto = require("crypto");
const moment = require("moment");
const hashPassword = require("../utils/hashPassword");
("use strict");

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "9",
        validate: {
          isIn: {
            args: [["0", "1", "9"]],
            msg: "Define user status",
          },
        },
      },
      email: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone: DataTypes.STRING,
      image_1: DataTypes.STRING,
      image_2: DataTypes.STRING,
      image_3: DataTypes.STRING,
      type: DataTypes.STRING,
      password: DataTypes.STRING,
      action: DataTypes.STRING,
      ip: DataTypes.STRING,
      resetPasswordToken: DataTypes.STRING,
      resetPasswordExpire: DataTypes.DATE,
      confirmationToken: DataTypes.STRING,
      confirmationTokenExpire: DataTypes.DATE,
      register: DataTypes.STRING,
      salt: DataTypes.STRING,
      // updatedAt: {
      //   type: DataTypes.DATE,
      //   allowNull: false,
      // }
    },
    {
      // timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
      sequelize,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
      scopes: {
        withPassword: {
          attributes: {
            include: ["password"],
          },
        },
      },
    }
  );

  //  ######  ####### ####### ####### ######  #######
  //  #     # #       #       #     # #     # #
  //  #     # #       #       #     # #     # #
  //  ######  #####   #####   #     # ######  #####
  //  #     # #       #       #     # #   #   #
  //  #     # #       #       #     # #    #  #
  //  ######  ####### #       ####### #     # #######

  user.beforeCreate(hashPassword);
  user.beforeUpdate(hashPassword);

  //   #####  ####### ####### ####### ####### #    # ####### #     #
  //  #     # #          #       #    #     # #   #  #       ##    #
  //  #       #          #       #    #     # #  #   #       # #   #
  //  #  #### #####      #       #    #     # ###    #####   #  #  #
  //  #     # #          #       #    #     # #  #   #       #   # #
  //  #     # #          #       #    #     # #   #  #       #    ##
  //   #####  #######    #       #    ####### #    # ####### #     #

  user.prototype.getJsonWebToken = function () {
    const token = jwt.sign(
      { id: this.id, status: this.status },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    // console.log('I AM GENERATED TOKEN: ', token)
    // console.log("WITH: ", this.id)
    // console.log("WITH: ", this.status)
    return token;
  };

  //   #####  #     # #######  #####  #    # ######     #     #####   #####  #     # ####### ######  ######
  //  #     # #     # #       #     # #   #  #     #   # #   #     # #     # #  #  # #     # #     # #     #
  //  #       #     # #       #       #  #   #     #  #   #  #       #       #  #  # #     # #     # #     #
  //  #       ####### #####   #       ###    ######  #     #  #####   #####  #  #  # #     # ######  #     #
  //  #       #     # #       #       #  #   #       #######       #       # #  #  # #     # #   #   #     #
  //  #     # #     # #       #     # #   #  #       #     # #     # #     # #  #  # #     # #    #  #     #
  //   #####  #     # #######  #####  #    # #       #     #  #####   #####   ## ##  ####### #     # ######

  user.prototype.checkPassword = async function (password) {
    // let resp;
    // bcrypt.compare(password, this.password, (err, res) => {
    //     resp = res
    // });
    // console.log("RESP: ", resp);
    // return new Promise(async (resolve, reject) => {
    //   bcrypt.compare(password, this.password, (err, res) => {
    //     if(err) reject(err)
    //       else resolve(res)
    //     })
    //   }).then((res) => {
    //     user.password = hashedPassword
    //   })
    // return resp;

    console.log("THIS SALT: ", this.salt);
    console.log("PASSWORD: ", password);
    console.log("THIS PASSWORD: ", this.password);

    var hash = crypto
      .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
      .toString(`hex`);

    console.log("HASH: ", hash);

    return this.password === hash;
    /*
        var hash = bcrypt.hashSync(password);
        console.log("HI: ", hash);
        console.log("THIS: ", this.password)
        var hashedPassword = await hashPassword({password: password});
        console.log("BCRYPT NODE: ", hashedPassword)
        var comp = await bcrypt.compareSync(password, this.password);
        console.log("COM: ", comp);

        await bcrypt.compare(password, this.password, function(err, res) {
            console.log("ERR: ", err)
            console.log("RES: ", res);
        });

        return comp; // true */
  };

  //   #####  ####### #     #  #####  #     #    #    #     #  #####  ####### ####### ####### #    # ####### #     #
  //  #     # #       ##    # #     # #     #   # #   ##    # #     # #          #    #     # #   #  #       ##    #
  //  #       #       # #   # #       #     #  #   #  # #   # #       #          #    #     # #  #   #       # #   #
  //  #  #### #####   #  #  # #       ####### #     # #  #  # #  #### #####      #    #     # ###    #####   #  #  #
  //  #     # #       #   # # #       #     # ####### #   # # #     # #          #    #     # #  #   #       #   # #
  //  #     # #       #    ## #     # #     # #     # #    ## #     # #          #    #     # #   #  #       #    ##
  //   #####  ####### #     #  #####  #     # #     # #     #  #####  #######    #    ####### #    # ####### #     #

  user.prototype.generatePasswordChangeToken = function () {
    const resetToken = crypto.randomBytes(30).toString("hex");

    console.log("RESET TOKEN: ", resetToken);

    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.resetPasswordExpire = moment().add(2, "h").utc(8).format();
    console.log("RESET TOKEN: ", this.resetPasswordToken);
    console.log("RESET TOKEN: ", this.resetPasswordExpire);

    return resetToken;
  };

  //  ######  #######  #####  ####### ####### ######     #     #####   #####  #     # ####### ######  ######
  //  #     # #       #     # #          #    #     #   # #   #     # #     # #  #  # #     # #     # #     #
  //  #     # #       #       #          #    #     #  #   #  #       #       #  #  # #     # #     # #     #
  //  ######  #####    #####  #####      #    ######  #     #  #####   #####  #  #  # #     # ######  #     #
  //  #   #   #             # #          #    #       #######       #       # #  #  # #     # #   #   #     #
  //  #    #  #       #     # #          #    #       #     # #     # #     # #  #  # #     # #    #  #     #
  //  #     # #######  #####  #######    #    #       #     #  #####   #####   ## ##  ####### #     # ######

  user.prototype.resetPassword = async function (password) {};

  //   #####  ####### #     # #     # #     # #     # ######  ####### ######
  //  #     # #       ##    # ##    # #     # ##   ## #     # #       #     #
  //  #       #       # #   # # #   # #     # # # # # #     # #       #     #
  //  #  #### #####   #  #  # #  #  # #     # #  #  # ######  #####   ######
  //  #     # #       #   # # #   # # #     # #     # #     # #       #   #
  //  #     # #       #    ## #    ## #     # #     # #     # #       #    #
  //   #####  ####### #     # #     #  #####  #     # ######  ####### #     #

  user.prototype.generateConfirmationNumber = function () {
    const confimationNumber = Math.floor(Math.random() * 999999);

    this.confirmationToken = crypto
      .createHash("sha256")
      .update(JSON.stringify(confimationNumber))
      .digest("hex");
    this.confirmationTokenExpire = moment().add(2, "h").utc(8).format();

    return confimationNumber;
  };
  // user.prototype.generateResetPassNumber = function () {
  //   const resetToken = Math.floor(Math.random() * 999999);

  //   this.resetToken = crypto
  //     .createHash("sha256")
  //     .update(JSON.stringify(resetToken))
  //     .digest("hex");

  //   this.resetPasswordExpire = moment().add(2, "h").utc(8).format();
  //   console.log("RESET TOKEN: ", this.resetPasswordToken);
  //   console.log("RESET TOKEN: ", this.resetPasswordExpire);

  //   return resetToken;
  // };

  //   #####  ####### #     #  #####  ####### #     # ####### ####### ####### #    # ####### #     #
  //  #     # #       ##    # #     # #     # ##    # #          #    #     # #   #  #       ##    #
  //  #       #       # #   # #       #     # # #   # #          #    #     # #  #   #       # #   #
  //  #  #### #####   #  #  # #       #     # #  #  # #####      #    #     # ###    #####   #  #  #
  //  #     # #       #   # # #       #     # #   # # #          #    #     # #  #   #       #   # #
  //  #     # #       #    ## #     # #     # #    ## #          #    #     # #   #  #       #    ##
  //   #####  ####### #     #  #####  ####### #     # #          #    ####### #    # ####### #     #

  user.prototype.generateConfirmationToken = function () {
    const confirmationToken = crypto.randomBytes(30).toString("hex");

    this.confirmationToken = crypto
      .createHash("sha256")
      .update(confirmationToken)
      .digest("hex");
    this.confirmationTokenExpire = moment().add(2, "h").utc(8).format();

    return confirmationToken;
  };

  // user.associate = function (models) {
  //   user.hasMany(models.shareholder, {
  //     onDelete: "NO ACTION",
  //     onUpdate: "CASCADE",
  //   });
  //   user.hasMany(models.discussion_vote, {
  //     onDelete: "NO ACTION",
  //     onUpdate: "CASCADE",
  //   });
  //   user.hasMany(models.bod_vote, {
  //     onDelete: "NO ACTION",
  //     onUpdate: "CASCADE",
  //   });
  //   user.hasMany(models.company, {
  //     onDelete: "NO ACTION",
  //     onUpdate: "CASCADE",
  //   });
  //   user.hasMany(models.comment, {
  //     onDelete: "NO ACTION",
  //     onUpdate: "CASCADE",
  //   });
  // };

  return user;
};
