import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
     throw new UnauthorizedException("Invalid token")
      //return false;
    }

    try {
      const decoded = this.jwtService.verify(token,{secret:process.env.JWT_SECRET});
      request.user = decoded; 
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException("Invalid Token");
    }
  }
}