import Tokenizer from "./Tokenizer.js";

/**
 * Notal parser, recursive descent implementation
 */
export default class Parser {
    /**
     * Initialize the parser.
     */
    constructor() {
        this._string = '';
        this._tokenizer = new Tokenizer();
    }

    /**
     * Parses a string into an AST
     */
    parse(string) {
        this._string = string;
        this._tokenizer.init(string);

        // Parses recursively from main entry point
        return this.Program();
    }

    /**
     * Main entry point
     *
     * Program
     *   : NumericLiteral
     *   ;
     */
    Program() {
        // Prime the tokenizer to obtain the first token
        // which is our lookahead. The lookahead is used
        // for predictive parsing.
        const start = this._tokenizer._currentLineColumn();
        this._lookahead = this._tokenizer.getNextTokens();
        const obj = {
            type: 'Program',
            body: this.Literal(),
            span: {
                start,
                end: this._tokenizer._currentLineColumn()
            }
        }
        return obj;
    }

    /**
     * Literal
     *   : NumericLiteral
     *   | StringLiteral
     *   ;
     */
    Literal() {
        switch (this._lookahead.type) {
            case 'NUMBER':
                return this.NumericLiteral();
            case 'STRING':
                return this.StringLiteral();
        }
    }

    /**
     * StringLiteral
     *   : STRING
     *   ;
     */
    StringLiteral() {
        const token = this._eat('STRING');
        const obj = {
            type: 'StringLiteral',
            value: token.value.slice(1, -1),
            span: token.span
        }
        return obj;
    }

    /**
     * NumericLiteral
     *   : INTEGER
     *   | REAL
     *   ;
     */
    NumericLiteral() {
        const token = this._eat('NUMBER');
        const obj = {
            type: 'NumericLiteral',
            value: Number(token.value),
            span: token.span
        }
        return obj;
    }

    /**
     * Expects a token of given type.
     */
    _eat(tokenType) {
        const token = this._lookahead;
        if (token == null) {
            throw new SyntaxError(`Unexpected end of input, expected "${tokenType}"`);
        }
        if (token.type !== tokenType) {
            throw new SyntaxError(`Unexpected token: "${token.value}", expected: "${tokenType}"`);
        }

        // Advance to next token.
        this._lookahead = this._tokenizer.getNextTokens();
        return token;
    }
}