import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('이미 사용중인 이메일입니다.');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hashedPassword, name: dto.name },
    });

    return { message: '회원가입 성공', userId: user.id };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user)
      throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다.');

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid)
      throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다.');

    const accessToken = this.jwtService.sign(
      { userId: user.id, role: user.role },
      { secret: process.env.JWT_SECRET, expiresIn: '1h' },
    );
    const refreshToken = this.jwtService.sign(
      { userId: user.id },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async checkEmail(email: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    return { isDuplicate: !!existing };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const accessToken = this.jwtService.sign(
        { userId: payload.userId },
        { secret: process.env.JWT_SECRET, expiresIn: '1h' },
      );
      return { accessToken };
    } catch {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
