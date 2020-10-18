const express = require("express");
const userRouter = express.Router();
const devices = require("../model/devices.js");
const mongoose = require("mongoose");
var options = {
  native_parser: true,
  poolSize: 5,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const url = "mongodb://localhost:27017/mydb";

userRouter.post("/add-device", async (req, res) => {
  const { name, model, control } = req.body;
  console.log("reg", req.body);
  mongoose.connect(url, options);
  const dev = new devices({ name, model, control });

  await dev
    .save()
    .then((devices) => {
      console.log("vvv", devices);
      res.json(devices);
    })
    .catch((error) =>
      res.status(409).json({
        success: false,
        message: "Given device name already exist",
        error: error.message,
      })
    );
});

userRouter.get("/list-device", async (req, res) => {
  mongoose.connect(url, options);
  console.log("list-device");
  try {
    const devList = await devices.find({}, { __v: 0 });
    console.log("list-device");
    res.status(200).json({
      success: true,
      statusCode: "201",
      message: devList,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "unable to fetch",
      error: error.message,
    });
  }
});

userRouter.put("/operation", async (req, res) => {
  mongoose.connect(url, options);
  var switchs = req.body.control.switch;
  try {
    const devList = await devices.findOneAndUpdate(
      { name: req.body.name },
      { $set: { control: req.body.control } }
    );

    if (switchs == false) {
      res.status(200).json({
        success: true,
        statusCode: "201",
        message: "Light is OFF",
      });
    } else {
      res.status(200).json({
        success: true,
        statusCode: "201",
        message: "Light is ON",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "unable to update",
      error: error.message,
    });
  }
});

userRouter.delete("/remove", async (req, res) => {
  mongoose.connect(url, options);
  console.log("remove", req.body);

  try {
    const devList = await devices.findOneAndDelete({ name: req.body.name });
    console.log("remove-device2");
    res.send(devList);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "unable to delete",
      error: error.message,
    });
  }
});

module.exports = userRouter;
