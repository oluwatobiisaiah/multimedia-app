import { Request, Response } from "express";
import {authController} from "../src/auth/auth.controller"
describe("authController", () => {
  let controller: any;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    controller = authController;
    mockRequest = {};
    mockResponse = {
      send: jest.fn(),
    };
  });

  describe("login", () => {
    it("should send a response", () => {
      controller.login(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.send).toHaveBeenCalledWith(
        "Hello from auth controller!"
      );
    });
  });
});
