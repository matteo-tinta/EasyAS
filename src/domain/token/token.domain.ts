export class Token {
    
    constructor(
        public username: string,
        public refreshToken: string,
        public expiredAt: Date
    ) {
        
    }
}