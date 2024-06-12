import { HttpException, HttpStatus } from "@nestjs/common";

export class EmailAlreadyExistException extends HttpException {
  constructor() {
    super('The email provided is being used by another user', HttpStatus.BAD_REQUEST)
  }
}