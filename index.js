class JsonRpcQL {
    constructor(json) {
        this.json = json;
        this.services = new Map();
        this.objects = new Map();
        this.parse();
    }

    parse() {
        for (let key in this.json) {
            if (this.json[key].type === "rpc") {
                this.services.set(key, this.json[key].methods);
            }else if(this.json[key].type === "meta"){
                this.objects.set(key, this.json[key]);
            }
        }
    }

    showServices() {
        let services = [];
        for (let key of this.services.keys()) {
            let k = {};
            k[key] = getNote(this.json[key].note);
            services.push(k);
        }
        return services;
    }

    showService(name) {
       let methods = this.services.get(name);
       let methodNotes = [];
       
       if(typeof(methods) !="undefined"){
           for(let i = 0; i < methods.length;i++){
            let k = {};
            k[methods[i].name] = getNote(methods[i].note);
            methodNotes.push(k);
           }
       }
       return methodNotes;
    }

    showObject(name){
        let o = this.objects.get(name);
        let result = {}
        if(typeof(o) !="undefined"){
            result["note"] = o.note;
            result["fields"] = o.fields;
        }
        return result
    }

    showParameter(name,methodName){
       let methods = this.services.get(name);
       if(typeof(methods) =="undefined"){
          return "";
       }
       for(let i = 0; i < methods.length;i++){
           if(methods[i].name == methodName){
              let k = {};
              k["return"] = methods[i].return;
              k["parameters"] = methods[i].parameters;
              return k;
           }
       }
       return null;
    }

}

function getNote(parameter) {
    if (typeof (parameter) == "string") {
        return parameter;
    } else if (Array.isArray(parameter) && parameter.length > 1) {
        return parameter[1];
    }
    return "";
}

if (require.main === module) {
    let json = require("./test/ioc.json")
    let jsonRpcQL = new JsonRpcQL(json);
    console.log(jsonRpcQL.showServices());
    console.log(jsonRpcQL.showService("Hello"));
    console.log(jsonRpcQL.showParameter("Hello","sayUser"));
    console.log(jsonRpcQL.showObject("User"));
}

module.exports = JsonRpcQL;

