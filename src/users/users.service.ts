import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>){}

    async create(createUserDto: CreateUserDto): Promise<boolean>{
        if (await this.findUser(createUserDto.username)) return false;
        const char = new this.userModel(createUserDto);
        await char.save();
        return true;
    }

    async findUser(user: string): Promise<User>{
        try{
            return await this.userModel.findOne({ username: user });
        }catch(e){
            return null;
        }
    }

    async findById(id: string): Promise<User>{
        try{
            return await this.userModel.findById(id).exec();
        }catch(e){
            return null;
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<boolean>{
        try{
            await this.userModel.findByIdAndUpdate(id, updateUserDto, {new: true});
            return true;
        }catch(e){
            return null;
        }
    }

    async delete(id: string){
        try{
            return await this.userModel.findByIdAndDelete(id);
        }catch(e){
            return null;
        }
    }

}
