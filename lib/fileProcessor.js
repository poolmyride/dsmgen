var fs = require('fs');
var S = require('string');
var processor =  function(){
    this.scopeStack = []
}

processor.prototype.process = function(fileName){
    console.log(fileName)
    var _this = this
    var currenDir = process.cwd()
    var filePath =  currenDir + "/" + fileName
    fs.readFile(filePath, 'utf8', function (err,data) {

        if(data) {
            var output = _this.generateContents(data)
            var final = _this.interpolateContents(data, output)

            fs.writeFile(filePath, final, function (err) {
                if (err) {
                    return console.log(err);
                }

                console.log("The file " + fileName + " was saved!");
            });
        }
    });
}

processor.prototype.interpolateContents = function(original,generated) {

    var templateData = {
        doMagic : generated
    }
    return S(original).template(templateData).s

}

processor.prototype.isVarDeclaration = function(line) {

    return S(line).contains('var') && (!S(line).contains('static'))  && (!S(line).contains('class'))
}

processor.prototype.extractVariable = function(line) {
    var trimmed = S(line).trim().collapseWhitespace().s
    var splitted = trimmed.split(":")
    if(splitted.length == 2){
        var declarationComponents =splitted[0].split(" ")
        var varName = S(declarationComponents[declarationComponents.length - 1]).trim().s
        var typeName = S(splitted[1]).trim().s
        var isOptional = typeName.charAt(typeName.length - 1) == '?'
        typeName = isOptional ? typeName.slice(0,typeName.length - 1) : typeName
        return {name:varName,type:typeName,optional:isOptional?"?":"!"}
    }
    return undefined
}
processor.prototype.generateContents = function(str){
    var lines = str.split("\n")
    var classStarted = false
    var startRecording = false
    var _this = this
    var variables = []

    lines.forEach(function(line){

        if(S(line).contains("ObjectCoder")){
            classStarted = true
        }
        if(startRecording == false && S(line).contains("{")){
            startRecording = true
        }else if(startRecording == true && S(line).contains("{")){
            startRecording = false
        }
        if(startRecording && _this.isVarDeclaration(line)){
            var obj = _this.extractVariable(line)
            !obj ? console.error("not able to parse",line) : variables.push(obj)
        }

    })
    return this.generateContentsFromVariables(variables)
}
processor.prototype.generateContentsFromVariables = function(variables){

    var fileComponents = [this.initContents(variables),this.toDicContents(variables),this.identifierContents(variables)]
    return fileComponents.join("\n\n")
}

processor.prototype.initContents = function(variables){

    var lines = ["\trequired init(dictionary withDictionary: NSDictionary) {",""]
    var strTemp = "\t\tself.{{name}} = withDictionary[\"{{name}}\"] as{{optional}} {{type}}"
    variables.forEach(function(obj){

        lines.push(S(strTemp).template(obj).s)
    })
    lines.push("")
    lines.push("\t}")

    return lines.join("\n")


}

processor.prototype.toDicContents = function(variables){

    var lines = ["\tfunc toDictionary() -> NSDictionary {","","\tlet dic = NSMutableDictionary()"]
    var strTemp = "\t\tself.{{name}} != nil ? dic[\"{{name}}\"] = self.{{name}}! : ()"
    variables.forEach(function(obj){

        lines.push(S(strTemp).template(obj).s)
    })
    lines.push("\t\treturn dic")
    lines.push("\t}")

    return lines.join("\n")

}

processor.prototype.identifierContents = function(variables){

    var lines = ["\tstatic func identifierKey() -> String {","\t\treturn \"\"","\t}"]
    return lines.join("\n")

}
module.exports = processor