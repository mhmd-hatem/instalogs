import prisma, { User } from "../services/prismaProvider";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import InstaLogs from "../services/InstaLogs";
import jwt from "jsonwebtoken";
import { cleanupAddress } from "../utils";

export async function signupUser(req: Request, res: Response) {
  try {
    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        username: req.body.username,
        password: bcrypt.hashSync(
          req.body.password,
          process.env.SALT_ROUNDS ?? 10
        ),
        first_name: req.body.first_name,
        last_name: req.body.last_name,
      },
    });

    await InstaLogs.getInstance().createEvent(
      cleanupAddress(req.ip as string),
      {
        event: "CREATE_USER",
        isSuccessful: true,
        actorId: user.id,
        targetUserId: user.id,
        teamId: null,
        action: {
          name: "user.signup",
          description: `User ${user.username} created successfully at ${user.createdAt} at location: ${req.ip}`,
        },
      }
    );

    return res.status(201).json({
      error: null,
      data: {
        user: { ...user, password: undefined },
      },
    });
  } catch (err) {
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

export async function loginUser(req: Request, res: Response) {
  const user = await prisma.user.findFirst({
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
    const valid = bcrypt.compareSync(req.body.password, user.password);
    if (!valid) {
      return res.status(401).json({
        error: {
          status: 401,
          message: "Wrong Email or Password",
        },
        data: null,
      });
    }

    const token = jwt.sign(
      { username: user.username, email: user.email },
      process.env.TOKEN_KEY ?? "INSTA",
      { expiresIn: "30d" }
    );
    console.log(token, "before save token");

    // should be storing the refresh token in a database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        token: token,
      },
    });

    console.log(updatedUser.token, "token in user");

    InstaLogs.getInstance().createEvent(cleanupAddress(req.ip as string), {
      event: "LOGIN",
      actorId: user.id,
      isSuccessful: true,
      targetUserId: user.id,
      teamId: null,
      action: {
        name: "user.login",
        description: `User ${
          user.username
        } logged in successfully at ${new Date().toDateString()} at location: ${cleanupAddress(
          req.ip as string
        )}`,
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
  } catch (err) {
    console.log(err);
    await InstaLogs.getInstance().createEvent(
      cleanupAddress(req.ip as string),
      {
        event: "CREATE_USER",
        isSuccessful: false,
        actorId: user!.id,
        targetUserId: user!.id,
        teamId: null,
        action: {
          name: "user.signup",
          description: `User ${user!.username ?? "unkown"} login failed at ${
            user!.createdAt
          } at location: ${cleanupAddress(req.ip as string)}`,
        },
      }
    );
    return res.status(500).json({
      error: {
        status: 500,
        message: "INTERNAL SERVER ERROR",
      },
      data: null,
    });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const user = await prisma.user.update({
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
  } catch (err) {
    return res.status(500).json({
      error: {
        status: 500,
        message: "INTERNAL SERVER ERROR",
      },
      data: null,
    });
  }
}
