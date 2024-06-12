import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { EmailAlreadyExistException } from 'src/common/exceptions/email-already-exists';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.userModel.findOne({ email: createUserDto.email }).exec();
    if (userExists) throw new EmailAlreadyExistException();
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createUser = new this.userModel({ ...userData, password: hashedPassword });
    await createUser.save();
    return 'usuario creado con éxito';
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userModel.find().select('-password').exec();
    return users;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findOne(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userModel.findById(id).select('-password').exec();
    return user ? user.toObject() : null;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'> | null> {
    const { password, ...userData } = updateUserDto;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const updateUser = await this.userModel.findByIdAndUpdate(
      id,
      {
        ...userData,
        ...(hashedPassword && { password: hashedPassword })
      },
      { new: true }
    ).select('-password').exec();

    return updateUser ? updateUser.toObject() : null;
  }

  async remove(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }
}
