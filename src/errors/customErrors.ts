/**
 * Represents a custom API error with a specific error code and status.
 */
class CustomAPIError extends Error {
  /**
   * The error code associated with this error.
   */
  public code: number;

  /**
   * The optional status associated with this error.
   */
  public status?: string;

  /**
   * Creates a new instance of the `CustomAPIError` class.
   * @param message - The error message.
   * @param code - The error code.
   * @param status - The optional error status.
   */
  constructor(message: string, code: number, status?: string) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const createCustomError = (message: string, code: number) => {
    return new CustomAPIError(message, code);
};
export {CustomAPIError,createCustomError};