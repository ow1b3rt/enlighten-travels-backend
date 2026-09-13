import { StatusCodes } from "http-status-codes";

import HttpError from "../../common/errors/HttpError.js";
import { env } from "../../config/env.js";
import { loginSchema } from "./auth.schema.js";
import { getCurrentUser, loginUser, refreshSession } from "./auth.service.js";

const baseCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  signed: true,
};

function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie("accessToken", accessToken, {
    ...baseCookieOptions,
    maxAge: 30 * 24 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...baseCookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

function parseBody(schema, body) {
  const result = schema.safeParse(body);

  if (!result.success) {
    const message = result.error.issues[0]?.message || "Invalid request data";
    throw new HttpError(message, StatusCodes.BAD_REQUEST);
  }

  return result.data;
}

export async function login(req, res) {
  const data = parseBody(loginSchema, req.body);
  const result = await loginUser(data);

  setAuthCookies(res, result.accessToken, result.refreshToken);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Login successful",
    user: result.user,
  });
}

export async function refresh(req, res) {
  const refreshToken = req.signedCookies.refreshToken;

  if (!refreshToken) {
    throw new HttpError("Refresh token is required", StatusCodes.UNAUTHORIZED);
  }

  const result = await refreshSession(refreshToken);
  setAuthCookies(res, result.accessToken, result.refreshToken);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Session refreshed",
  });
}

export async function logout(req, res) {
  res.clearCookie("accessToken", baseCookieOptions);
  res.clearCookie("refreshToken", baseCookieOptions);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Logout successful",
  });
}

export async function me(req, res) {
  const user = await getCurrentUser(req.user.id);

  res.status(StatusCodes.OK).json({
    success: true,
    user,
  });
}
