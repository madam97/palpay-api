"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `.env.${process.env.NODE_ENV}` });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 1111;
app.get('/', (req, res) => {
    res.json({ msg: 'Working', envpath: `.env.${process.env.NODE_ENV}`, test: process.env.TEST_AAAAAAA, port: process.env.PORT });
});
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
