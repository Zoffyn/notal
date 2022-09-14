import Parser from '../src/Parser.js';

const parser = new Parser();

const program = `"Hello
Nama
Saya
Sofyan"`;

const ast = parser.parse(program);

console.log(JSON.stringify(ast, null, 2));