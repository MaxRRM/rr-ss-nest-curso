import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidIdException extends HttpException {
  constructor() {
    super('Invalid ID', HttpStatus.BAD_REQUEST)
  }
}