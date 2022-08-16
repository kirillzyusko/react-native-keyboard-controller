"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const pkg = require('react-native-keyboard-controller/package.json');
const withKeyboardController = (config) => config;
exports.default = (0, config_plugins_1.createRunOncePlugin)(withKeyboardController, pkg.name, pkg.version);
