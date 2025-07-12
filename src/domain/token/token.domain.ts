export class Token {
  constructor(
    public username: string,
    public sessionId: string,
    public refreshToken: string,
    public expiredAt: Date,
  ) {}
}
