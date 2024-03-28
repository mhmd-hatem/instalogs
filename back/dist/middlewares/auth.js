"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaProvider_1 = __importDefault(require("../services/prismaProvider"));
async function authenticateToken(token) {
    if (!token)
        return null;
    try {
        const jwtKey = process.env.TOKEN_KEY ?? "INSTA";
        const decoded = jsonwebtoken_1.default.verify(token.split(" ")[1], jwtKey);
        return decoded.email;
    }
    catch (error) {
        return null;
    }
}
function auth(req, res, next) {
    (async (req, res, next) => {
        try {
            const email = await authenticateToken(req.headers.authorization);
            if (!email) {
                const error = new Error();
                error.details = { reason: "Invalid token" };
                return next(error);
            }
            const user = await prismaProvider_1.default.user.findFirst({
                where: { email },
            });
            if (!user) {
                const error = new Error();
                error.details = { reason: "Invalid token" };
                return res.status(401).json({ error });
            }
            req.body.user = user;
            next();
        }
        catch (error) {
            const customError = new Error();
        }
    })(req, res, next);
}
exports.auth = auth;
