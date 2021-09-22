import { EntityRepository, Repository } from "typeorm";
import { User } from './user.entity';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User>{

    //
    async createUser(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
        const { username, password } = authCredentialsDTO;

        // hash
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);    

        const user = this.create({ username, password: hashedPassword });

        try {
            await this.save(user);
        } catch (error) {

            if (error.code === '23505')// duplicate username
            {
                throw new ConflictException(`Username ${username} already exists..`)
            } else {
                throw new InternalServerErrorException();
            }
        }
    }
}