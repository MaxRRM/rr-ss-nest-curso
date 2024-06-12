import { HttpException, HttpStatus } from "@nestjs/common";

export class SupplierAlreadyExistException extends HttpException {
  constructor() {
    super('The suppplier provided already exists', HttpStatus.BAD_REQUEST)
  }
}