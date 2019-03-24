export class ValidationError extends Error {
  constructor(...message) {
    super(message);
    this.name = "ValidationError";
    this.errorList = message[0];
  }
}

export class MessageError extends Error {
  constructor(...message) {
    super(message);
    this.name = "MessageError";
  }
}

// class RequiredFieldError extends ValidationError {
//   constructor(property) {
//     super(property + "harus diisi");
//     this.name = "RequiredFieldError";
//     this.property = property;
//   }
// }
