let ParseError = require("./ParseError");

function jsparse(command) {
    let result = [];
    if (command == null || command == "" || typeof (command) == "undefined") {
        throw new ParseError("Wrong command line");
    }
    command = command + " "; //加上一个结束符
    let start = 0;
    for (let i = 0; i < command.length; i++) {
        if (command.charAt(i) == ' ') {
            spaceModule(command, start, i, result);
            start = i + 1;
        }//空格模式。
        else if (command.charAt(i) == "'" || command.charAt(i) == '"') {
            i = quotationMudule(command, i, result);
            start = i;
        }//单双引号模式。
        else if (command.charAt(i) == "{") {
            i = objectMudule(command, i, result);
            start = i;
        }//对象数据模式。
    }
    return result;
}

function spaceModule(command, startPosion, endPosion, result) {
    let value = command.substring(startPosion, endPosion);
    if (value.trim() == "") return;
    result.push(value);
}

function quotationMudule(command, startPosion, result) {
    let code = command.charAt(startPosion);
    let preCode = "";
    let value = [];
    for (let i = startPosion + 1; i < command.length; i++) {
        if (command.charAt(i) == code && preCode != 32) {
            result.push(value.join(""));
            return i + 1;
        } else {
            value.push(command.charAt(i));
        }
        preCode = command.charCodeAt(i);
    }
    throw new ParseError("Single or double quotes do not match:" + command);//到了后面也没有符合的引号模式。
}

function objectMudule(command, startPosion, result) {
    let count = 0;
    for (let i = startPosion + 1; i < command.length; i++) {
        if (command.charAt(i) == "}" && count == 0) {
            result.push(command.substring(startPosion, i + 1));
            return i + 2;
        }
        if (command.charAt(i) == "{") {
            count++;
        }
        if (command.charAt(i) == "}") {
            count--;
        }
        if (command.charAt(i) == "'" || command.charAt(i) == '"') {
            i = quotationMudule(command, i, []);
        }
    }
    throw new ParseError("Object format not match:" + command);//到了后面也没有符合的引号模式。
}



function main() {
    let test = [
        "use test",
        "  use   ?",
        "   ?",
        "User ?",
        "User.sayhello ?",
        `User.sayhello   "zdz ' wsz"`,
        "User.sayhello zdz 1",
        `User.sayhello {name:"zdz{ wsz", old:{year:22}}`,
        "end"
    ]

    let error = [
        "use 'test",
        "use te \" st",
        "User.say {",
        "User.say {{}",
    ]

    let result = [
        ["use", "test"],
        ["use", "?"],
        ["?"],
        ["User", "?"],
        ["User.sayhello", "?"],
        ["User.sayhello", "zdz ' wsz"],
        ["User.sayhello", "zdz", "1"],
        ["User.sayhello", `{name:"zdz{ wsz", old:{year:22}}`],
        ["end"]
    ]
    console.time("test");
    for (let i = 0; i < 9; i++) {
        console.log(equalsArray(jsparse(test[i]), result[i]));
    }
    for (let i = 0; i < error.length; i++) {
        try{
            jsparse(error[i])
            console.log("not ok");
        }catch(e){
            console.log("ok");
        }
    }
    console.timeEnd("test");
}

function equalsArray(a, b) {
    for (let i = 0; i < a.length; i++) {
        if (a[i] != b[i]) {
            return false;
        }
    }
    return true;
}

if (require.main === module) {
    main();
}


module.exports = jsparse;
