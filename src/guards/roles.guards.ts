import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from 'src/decorators/roles.decorators';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserType } from 'src/users/enum/user-type.enum';
import { jwtConstants } from 'src/auth/constants'; 

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true; 
    }
    
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token não fornecido ou malformado');
    }

    const token = authorization.split(' ')[1]; 
    
    let loginPayload: CreateUserDto | undefined;
    try {
      console.log('Verificando token:', token); 
      loginPayload = await this.jwtService.verifyAsync<CreateUserDto>(token, {
        secret: jwtConstants.secret,
      });
      console.log('Payload do token:', loginPayload); 
    } catch (err) {
      console.error('Erro ao verificar token:', err); 
      throw new UnauthorizedException('Token inválido');
    }

    if (!loginPayload || !loginPayload.roles) {
      throw new UnauthorizedException('Token sem roles');
    }

    return requiredRoles.some((role) => loginPayload.roles.includes(role));
  }
}
