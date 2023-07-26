export interface TokenI {
    id: string;
    text: string;
    index: number;
    start_char: number;
    end_char: number;
    lemma?: string;
    spacesAfter: number;
}

export class Token implements TokenI {
    private name = "token";
    public id: string;
    public text: string;
    public index: number;
    public start_char: number;
    public end_char: number;
    public lemma?: string;
    public spacesAfter: number;


    constructor(data: TokenI) {
        this.id = data.id;
        this.text = data.text;
        this.index = data.index;
        this.start_char = data.start_char;
        this.end_char = data.end_char;
        this.lemma = data.lemma;
        this.spacesAfter = data.spacesAfter;
    }
}