import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ){}

    @Post('/signup')
    singUp(@Body() authCredentialsDTO: AuthCredentialsDTO):Promise<void>{
        return this.authService.signUp(authCredentialsDTO)
    }

    @Post('/signin')
    singIn(@Body() authCredentialsDTO: AuthCredentialsDTO):Promise<{acessToken: string}>{
        return this.authService.signIn(authCredentialsDTO)
    }

    
}
