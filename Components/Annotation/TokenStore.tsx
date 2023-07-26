import { observable, action, computed } from 'mobx';
import { Token } from '../../data/api/types/base/entities/_Token';


export class TokenStore {
    @observable tokens: Map<string, Token> = new Map();

    constructor() {
    }

    @action.bound
    addTokens(tokens: Token[]) {
        tokens.forEach(token => this.tokens.set(token.id, new Token(token)));
    }

    @action.bound
    removeToken(id: string) {
        this.tokens.delete(id);
    }

    @action.bound
    updateToken(token: Token) {
        this.tokens.set(token.id, new Token(token));
    }

    getTokensInRange(index: number, end: number) {
        return Array.from(this.tokens.values())
            .filter(token => token.index >= index && token.index <= end)
            .sort((a, b) => a.index - b.index);
    }

    getCharactersByTokenRange(start: number, end: number) {
        const tokens = this.getTokensInRange(start, end);
        return [tokens[0].start_char, tokens[tokens.length - 1].end_char];
    }

    getToken(id: string) {
        return this.tokens.get(id);
    }

    @computed get text() {
        return Array.from(this.tokens.values())
            .map(token => { return token.spacesAfter ? token.text + ' '.repeat(token.spacesAfter) : token.text })
            .join('');
    }

}