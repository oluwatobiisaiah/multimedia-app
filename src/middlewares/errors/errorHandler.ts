import { Request, Response, NextFunction } from "express";
import { CustomAPIError } from "../../errors/customErrors";
export const globalErrorHandler = async (
    err: any,
    _: Request,
    res: Response,
    __: NextFunction
) => {
    console.log(err)
    return res
        .status(500)
        .json(
            {
                message: err instanceof CustomAPIError ? err.message : "Something went wrong,please try again later.",
                statusCode: err instanceof CustomAPIError ? err.code : 500,
                data: null,
            }
        );

};
