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

    public addToken = (newToken: string) => {
        this.tokens = [...this.tokens || [], new Token(this.username, newToken)]
    }

    public removeToken = (token: string) => {
        if(!this.tokens){
            return;
        }

        const storedToken = this.tokens.findIndex(f => f.refreshToken == token);
        if(storedToken < 0) {
            return;
        }

        this.tokens = this.tokens.splice(storedToken, 1)
    }
    
}