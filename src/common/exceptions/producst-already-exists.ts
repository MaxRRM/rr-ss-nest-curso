import { HttpException, HttpStatus } from "@nestjs/common";

export class ProductAlreadyExistException extends HttpException {
  constructor() {
    super('The product provided already exists', HttpStatus.BAD_REQUEST)
  }
}