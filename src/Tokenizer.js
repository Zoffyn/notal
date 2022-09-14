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
        // Numbers:
        if (!Number.isNaN(Number(string[0]))) {
            let number = '';
            while (!Number.isNaN(Number(string[this._cursor]))) {
                number += string[this._incrementCursor()];
            }
            return {
                type: 'NUMBER',
                value: number,
                span: {
                    start,
                    end: this._currentLineColumn()
                }
            }
        }

        // String:
        if (string[0] === '"') {
            let s = '';
            do {
                s += string[this._incrementCursor()];
            } while (string[this._cursor] !== '"' && !this.isEOF());
            s += string[this._incrementCursor()];
            return {
                type: 'STRING',
                value: s,
                span: {
                    start,
                    end: this._currentLineColumn()
                }
            }
        }
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