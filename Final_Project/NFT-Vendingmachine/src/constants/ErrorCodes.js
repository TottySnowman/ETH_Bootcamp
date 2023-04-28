export const errorCodeMapping = {
  CALL_EXCEPTION: "The call threw an exception",
  CALL_EXCEPTION_FROM_REVERT_STRING:
    "The call threw an exception with a revert string",
  CALL_EXCEPTION_FROM_INVALID_OPCODE:
    "The call threw an exception with an invalid opcode",
  CALL_EXCEPTION_FROM_CALL_STACK_LIMIT:
    "The call threw an exception due to a call stack limit",
  INSUFFICIENT_FUNDS:
    "The account has insufficient funds to complete the transaction",
  GAS_PRICE_NULL: "The gas price was not set",
  UNPREDICTABLE_GAS_LIMIT: "The gas limit could not be estimated",
  TRANSACTION_REJECTED_BY_USER: "The transaction was rejected by the user",
  UNPREDICTABLE_GAS_PRICE: "The gas price could not be estimated",
  INVALID_ARGUMENT: "One or more arguments passed to the function are invalid",
  MISSING_ARGUMENT: "One or more required arguments are missing",
  NONCE_EXPIRED: "The transaction nonce has already been used",
  NONCE_TOO_LOW: "The transaction nonce is too low",
  STILL_IN_PROGRESS: "The transaction is still in progress",
};
