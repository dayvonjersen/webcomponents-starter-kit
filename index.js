// change these if you want
var input_dir  = './components-src/',
    output_dir = './components/',

    bosonic = require('bosonic-transpiler'),
    fs      = require('fs');

function compile(file) {
    var contents = fs.readFileSync(input_dir + file + '.html','utf-8'),
        output   = bosonic.transpile(contents);
    fs.writeFileSync(output_dir + file + '.js',  output.js);
    fs.writeFileSync(output_dir + file + '.css', output.css);
}

for(var i = 2; i < process.argv.length; i++) {
    var file = process.argv[i].trim();

    if(fs.existsSync(input_dir + file + '.html')) {
        console.log("Compiling " + file + "...");
        compile(process.argv[i])
    } else {
        console.log(input_dir + file + '.html' + ": No such file");
        break;
    }
}
