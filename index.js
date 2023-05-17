//  #     #    #    ### #     #
//  ##   ##   # #    #  ##    #
//  # # # #  #   #   #  # #   #
//  #  #  # #     #  #  #  #  #
//  #     # #######  #  #   # #
//  #     # #     #  #  #    ##
//  #     # #     # ### #     #

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const fileupload = require("express-fileupload");
// const path = require("path");
const http = require("http");

//  ######  ####### #     # ####### #######  #####
//  #     # #     # #     #    #    #       #     #
//  #     # #     # #     #    #    #       #
//  ######  #     # #     #    #    #####    #####
//  #   #   #     # #     #    #    #             #
//  #    #  #     # #     #    #    #       #     #
//  #     # #######  #####     #    #######  #####

const mainRoutes = require("./routes/main");
const userRoutes = require("./routes/users");
// const shareholderRoutes = require("./routes/shareholder");
// const companyRoutes = require("./routes/company");
// const discussionRoutes = require("./routes/discussion");
// const discussionVoteRoutes = require("./routes/dicussionVote");
// const bodRoutes = require("./routes/bod");
// const bodVoteRoutes = require("./routes/bodVote");
// const uploadRoutes = require("./routes/upload");
// const voteRoutes = require("./routes/vote");
// const zoomRoutes = require("./routes/zoom");
// const emailRoutes = require("./routes/email");
// const phoneRoutes = require("./routes/phone");
// const frcRoutes = require("./routes/frc");
// const commentRoutes = require("./routes/comment");

//  ######  #######  #####  #     # ### ######  #######
//  #     # #       #     # #     #  #  #     # #
//  #     # #       #     # #     #  #  #     # #
//  ######  #####   #     # #     #  #  ######  #####
//  #   #   #       #   # # #     #  #  #   #   #
//  #    #  #       #    #  #     #  #  #    #  #
//  #     # #######  #### #  #####  ### #     # #######

require("dotenv").config();
require("colors");

//  #     # ### ######  ######  #       ####### ### #     # ######  ####### ######  #######  #####
//  ##   ##  #  #     # #     # #       #        #  ##   ## #     # #     # #     #    #    #     #
//  # # # #  #  #     # #     # #       #        #  # # # # #     # #     # #     #    #    #
//  #  #  #  #  #     # #     # #       #####    #  #  #  # ######  #     # ######     #     #####
//  #     #  #  #     # #     # #       #        #  #     # #       #     # #   #      #          #
//  #     #  #  #     # #     # #       #        #  #     # #       #     # #    #     #    #     #
//  #     # ### ######  ######  ####### ####### ### #     # #       ####### #     #    #     #####

// const morgan = require("morgan");
// const { logger, accessLogStream } = require("./middlewares/logger");
const errorHandler = require("./middlewares/error");
const injectDb = require("./middlewares/injectDb");
const corsOptionsDelegate = require("./middlewares/corsOption.js");
//   #####  ####### #     #  #####  #######
//  #     # #     # ##    # #     #    #
//  #       #     # # #   # #          #
//  #       #     # #  #  #  #####     #
//  #       #     # #   # #       #    #
//  #     # #     # #    ## #     #    #
//   #####  ####### #     #  #####     #

const db = require("./models/index.js");
const { protect, authorize } = require("./middlewares/protect");
const app = express();
// morgan.token("body", (req) => {
//   return JSON.stringify(req.body);
// });
//  #     # ### ######  ######  #       ####### #     #    #    ######  #######
//  ##   ##  #  #     # #     # #       #       #  #  #   # #   #     # #
//  # # # #  #  #     # #     # #       #       #  #  #  #   #  #     # #
//  #  #  #  #  #     # #     # #       #####   #  #  # #     # ######  #####
//  #     #  #  #     # #     # #       #       #  #  # ####### #   #   #
//  #     #  #  #     # #     # #       #       #  #  # #     # #    #  #
//  #     # ### ######  ######  ####### #######  ## ##  #     # #     # #######

app.use(express.json());
// app.use(fileupload());
// app.use(
//   morgan(
//     `:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :referrer :status :res[content-length] :body`,
//     // ":remote-addr :method :remote-user [:date[clf]] :method :url HTTP/:http-version :referrer :user-agent :url :status :body  ",
//     // ":method :url :body",
//     // "combined",
//     {
//       stream: accessLogStream,
//     }
//   )
// );
// app.use(logger);
app.use(injectDb(db));
app.use(cors(corsOptionsDelegate));
app.use(cookieParser());
// app.set("views", path.join(__dirname, "./views"));
// app.set("view engine", "pug");

//  ######  ####### #     # ####### #######  #####
//  #     # #     # #     #    #    #       #     #
//  #     # #     # #     #    #    #       #
//  ######  #     # #     #    #    #####    #####
//  #   #   #     # #     #    #    #             #
//  #    #  #     # #     #    #    #       #     #
//  #     # #######  #####     #    #######  #####

app.use("/", mainRoutes);
// app.use(`/api/${process.env.VERSION}/zoom`, zoomRoutes);
// app.use(`/api/${process.env.VERSION}/votes`, voteRoutes);
// app.use(`/api/${process.env.VERSION}/comments`, commentRoutes);
app.use(`/api/${process.env.VERSION}/users`, userRoutes);
// app.use(`/api/${process.env.VERSION}/shareholders`, shareholderRoutes);
// app.use(`/api/${process.env.VERSION}/companies`, companyRoutes);
// app.use(`/api/${process.env.VERSION}/discussions`, discussionRoutes);
// app.use(`/api/${process.env.VERSION}/discussion-votes`, discussionVoteRoutes);
// app.use(`/api/${process.env.VERSION}/bods`, bodRoutes);
// app.use(`/api/${process.env.VERSION}/bod-votes`, bodVoteRoutes);
// app.use(`/api/${process.env.VERSION}/email`, emailRoutes);
// app.use(`/api/${process.env.VERSION}/phone`, phoneRoutes);
// app.use(`/api/${process.env.VERSION}/frc`, frcRoutes);
// app.use(`/api/${process.env.VERSION}/upload`, uploadRoutes);

// app.use(
//   `/api/${process.env.VERSION}/pdf`,
//   // protect,
//   // authorize("0", "1", "3"),
//   express.static(path.join(__dirname, "./pdf"))
// );

// app.use(
//   `/api/${process.env.VERSION}`,
//   express.static(path.join(__dirname, "./public"))
// );

//  ####### ######  ######  ####### ######  #     #    #    #     # ######  #       ####### ######
//  #       #     # #     # #     # #     # #     #   # #   ##    # #     # #       #       #     #
//  #       #     # #     # #     # #     # #     #  #   #  # #   # #     # #       #       #     #
//  #####   ######  ######  #     # ######  ####### #     # #  #  # #     # #       #####   ######
//  #       #   #   #   #   #     # #   #   #     # ####### #   # # #     # #       #       #   #
//  #       #    #  #    #  #     # #    #  #     # #     # #    ## #     # #       #       #    #
//  ####### #     # #     # ####### #     # #     # #     # #     # ######  ####### ####### #     #

app.use(errorHandler);

//   #####  #     # #     #  #####
//  #     #  #   #  ##    # #     #
//  #         # #   # #   # #
//   #####     #    #  #  # #
//        #    #    #   # # #
//  #     #    #    #    ## #     #
//   #####     #    #     #  #####

db.sequelize
  .sync({
    // force: true  // модель шинээр угсрах || бааз хоослох !!!
  })
  .then((result) => {
    console.log("Sequelize sync...".cyan);
    // console.log("result", result);
  })
  .catch((err) => {
    console.log(err);
  });

//   #####  ####### ####### #     # ######
//  #     # #          #    #     # #     #
//  #       #          #    #     # #     #
//   #####  #####      #    #     # ######
//        # #          #    #     # #
//  #     # #          #    #     # #
//   #####  #######    #     #####  #

const server = http.createServer(app);

// socketio(server);
server.listen(process.env.PORT, () => {
  console.log(
    "Server is running on: " +
      process.env.PORT +
      " with " +
      process.env.NODE_ENV
  );
});

process.on("unhandledRejection", (err, promise) => {
  console.log("unhandledRejection err: ", err);
  /*
    server.close(() => {
        process.restart()
    }); */
});
