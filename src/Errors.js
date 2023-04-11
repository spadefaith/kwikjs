class UndefinedError extends Error(){
    constructor(message, fileName, lineNumber, opts){
        this.message = message;
        this.fileName = fileName;
        this.lineNumber = lineNumber;
        this.name = 'UndefinedError';
    }
}