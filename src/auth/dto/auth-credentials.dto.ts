import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDTO{
    
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    username: string;

    @IsNotEmpty()
    @IsString()    
    // @MaxLength(20)
    // @MinLength(8)
    // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    //  { message: 'password is too weak...'})
    password: string;   
}