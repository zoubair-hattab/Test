/* eslint-disable no-undef */
const StorgeName = artifacts.require("StorgeName");
module.exports = function (deployer) {
  deployer.deploy(StorgeName);
};