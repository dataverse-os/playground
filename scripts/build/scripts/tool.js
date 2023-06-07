"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeToOutput = exports.readModels = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function readModels() {
    const res = fs_1.default.readdirSync(`${process.cwd()}/models`);
    const schemas = {};
    res.forEach((fileName) => {
        const filePath = path_1.default.resolve(`${process.cwd()}/models`, fileName);
        if (fs_1.default.statSync(filePath).isFile()) {
            schemas[fileName] = fs_1.default
                .readFileSync(filePath, { encoding: "utf8" })
                //@ts-ignore
                .replaceAll("\n", "");
        }
    });
    return schemas;
}
exports.readModels = readModels;
function writeToOutput(val) {
    const filePath = path_1.default.resolve(`${process.cwd()}/output`, "app.json");
    fs_1.default.writeFileSync(filePath, JSON.stringify(val));
}
exports.writeToOutput = writeToOutput;
