import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("Authorization header missing");
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2) {
      throw new UnauthorizedException("Authorization header malformed");
    }

    const [bearer, token] = parts;
    if (bearer !== "Bearer") {
      throw new UnauthorizedException(
        "Authorization header must start with Bearer"
      );
    }

    try {
      const secret = this.configService.get<string>("JWT_SECRET");
      const user = this.jwtService.verify(token, { secret });

      req.user = user;

      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}