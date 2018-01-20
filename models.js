exports.Reaction = class {

    constructor(name, message, imgpath) {
        this.name = name;
        this.message = message;
        this.imgpath = imgpath;
        this.time = new Date().getTime();
    }

};