const TOKEN_SPEC = [
    [/^\d+/, 'NUMBER'],
    [/^"[^"]*"/, 'STRING']
];

/**
 * Tokenizer class.
 *
 * Lazily pulls a token from a stream.
 */
export default class Tokenizer {
    /**
     * Initializes the string.
     */
    init(string) {
        this._string = string;
        this._cursor = 0;
        this._line = 1;
        this._column = 1;
    }

    /**
     * Whether the tokenizer reached EOF.
     */
    isEOF() {
        return this._cursor === this._string.length;
    }

    /**
     * Whether we still have more tokens.
     */
    hasMoreTokens() {
        return this._cursor < this._string.length;
    }

    /**
     * Obtains next token.
     */
    getNextTokens() {
        if(!this.hasMoreTokens()) return null;

        const string = this._string.slice(this._cursor);
        const start = this._currentLineColumn();

        for (const [regexp, tokenType] of TOKEN_SPEC) {
            const tokenValue = this._match(regexp, string);

            if (tokenValue == null) continue;
            return {
                type: tokenType,
                value: tokenValue,
                span: {
                    start,
                    end: this._currentLineColumn()
                }
            }
        }
        throw new SyntaxError(`Unexpected token: "${string[0]}"`)
    }

    _match(regexp, string) {
        const matched = regexp.exec(string);
        if (matched == null) {
            return null;
        }
        for (let i = 0; i < matched[0].length; i++) {
            this._incrementCursor()
        }
        return matched[0];
    }

    _incrementCursor() {
        this._column++;
        this._cursor++;
        if (this._string[this._cursor] === '\n') {
            this._line++;
            this._column = 0;
        }
        return this._cursor - 1;
    }

    _currentLineColumn() {
        return {
            line: this._line,
            column: this._column - 1
        }
    }
}