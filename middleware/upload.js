const multer = require("multer");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images/products");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.split(" ").join("-");
    cb(null, new Date().toISOString() + "-" + fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Failed to upload!"), false);
  }
};

const multerConfig = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
}).single("image");

exports.upload = (req, res, next) => {
  multerConfig(req, res, function (err) {
    let file = {
      type: "success",
      message: "Upload file success",
      data: req.file,
    };
    if (err instanceof multer.MulterError) {
      console.log("multer");
      file = {
        type: "error",
        message: "Failed to upload",
        data: null,
      };
      req.fileimg = file;
      next();
    } else if (err) {
      file = {
        type: "error",
        message: "Failed to upload",
        data: null,
      };
      req.fileimg = file;
      next();
    } else {
      if (req.file === undefined) {
        file = {
          type: "error",
          message: "Please upload your file",
          data: null,
        };
      }
      req.fileimg = file;
      next();
    }
  });
};
