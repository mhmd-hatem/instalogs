"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.loginUser = exports.signupUser = void 0;
const prismaProvider_1 = __importDefault(require("../services/prismaProvider"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const InstaLogs_1 = __importDefault(require("../services/InstaLogs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../utils");
async function signupUser(req, res) {
    try {
        const user = await prismaProvider_1.default.user.create({
            data: {
                email: req.body.email,
                username: req.body.username,
                password: bcrypt_1.default.hashSync(req.body.password, process.env.SALT_ROUNDS ?? 10),
                first_name: req.body.first_name,
                last_name: req.body.last_name,
            },
        });
        await InstaLogs_1.default.getInstance().createEvent((0, utils_1.cleanupAddress)(req.ip), {
            event: "CREATE_USER",
            isSuccessful: true,
            actorId: user.id,
            targetUserId: user.id,
            teamId: null,
            action: {
                name: "user.signup",
                description: `User ${user.username} created successfully at ${user.createdAt} at location: ${req.ip}`,
            },
        });
        return res.status(201).json({
            error: null,
            data: {
                user: { ...user, password: undefined },
            },
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            error: {
                status: 500,
                message: "INTERNAL SERVER ERROR",
            },
            data: null,
        });
    }
}
exports.signupUser = signupUser;
async function loginUser(req, res) {
    const user = await prismaProvider_1.default.user.findFirst({
        where: {
            OR: [{ email: req.body.email }, { username: req.body.email }],
        },
    });
    try {
        if (!user) {
            return res.status(404).json({
                error: {
                    status: 404,
                    message: "User Not Found",
                },
                data: null,
            });
        }
        const valid = bcrypt_1.default.compareSync(req.body.password, user.password);
        if (!valid) {
            return res.status(401).json({
                error: {
                    status: 401,
                    message: "Wrong Email or Password",
                },
                data: null,
            });
        }
        const token = jsonwebtoken_1.default.sign({ username: user.username, email: user.email }, process.env.TOKEN_KEY ?? "INSTA", { expiresIn: "30d" });
        console.log(token, "before save token");
        // should be storing the refresh token in a database
        const updatedUser = await prismaProvider_1.default.user.update({
            where: { id: user.id },
            data: {
                token: token,
            },
        });
        console.log(updatedUser.token, "token in user");
        InstaLogs_1.default.getInstance().createEvent(req.ip, {
            event: "LOGIN",
            actorId: user.id,
            isSuccessful: false,
            targetUserId: user.id,
            teamId: null,
            action: {
                name: "user.login",
                description: `User ${user.username} logged in successfully at ${new Date().toDateString()} at location: ${req.ip}`,
            },
        });
        //best practice: should send access token in body and storing refresh in cookies but given the simplicity and requirement, I m sending the refresh as access token
        return res.status(200).json({
            error: null,
            data: {
                user: { ...updatedUser, password: undefined },
                token,
            },
        });
    }
    catch (err) {
        console.log(err);
        await InstaLogs_1.default.getInstance().createEvent((0, utils_1.cleanupAddress)(req.ip), {
            event: "CREATE_USER",
            isSuccessful: true,
            actorId: user.id,
            targetUserId: user.id,
            teamId: null,
            action: {
                name: "user.signup",
                description: `User ${user.username ?? "unkown"} created successfully at ${user.createdAt} at location: ${req.ip}`,
            },
        });
        return res.status(500).json({
            error: {
                status: 500,
                message: "INTERNAL SERVER ERROR",
            },
            data: null,
        });
    }
}
exports.loginUser = loginUser;
async function logout(req, res) {
    try {
        const user = await prismaProvider_1.default.user.update({
            where: { id: req.body.user.id },
            data: {
                token: null,
            },
        });
        return res.status(200).json({
            error: null,
            data: {
                user: { ...user, password: undefined },
            },
        });
    }
    catch (err) {
        return res.status(500).json({
            error: {
                status: 500,
                message: "INTERNAL SERVER ERROR",
            },
            data: null,
        });
    }
}
exports.logout = logout;
