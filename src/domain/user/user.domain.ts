import { Token } from "../token/token.domain";

export class User {
    

    constructor(
        public username: string,
        public password: string,
        public tokens: Token[] = [],
    ) { 

    }

    public revokeAllTokens() {
        this.tokens = []
    }

    public addToken = (newToken: string, expireAt: Date) => {
        this.tokens = [...this.tokens || [], new Token(this.username, newToken, expireAt)]
    }

    public removeToken = (token: string) => {
        if(!this.tokens){
            throw new Error("tokens was empty")
        }

        const storedToken = this.tokens.findIndex(f => f.refreshToken == token);
        if(storedToken < 0) {
            throw new Error("Stored token was not found in the collection of the user tokens")
        }

        this.tokens.splice(storedToken, 1)
    }
    
}