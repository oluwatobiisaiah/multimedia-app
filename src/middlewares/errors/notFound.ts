import { RequestHandler } from "express";

export const notFound: RequestHandler = (req, res) => {
  return res.status(404).json({
    statusCode: 404,
    message: "This path exists somewhere in space time but not here",
    data: null,
  });
};
