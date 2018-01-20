exports.Reaction = class {

    constructor(type, pinID, userID, text, mediaPath) {
        this.type = type;
        this.pinID = pinID; //optional
        this.userID = userID;
        this.text = text; //optional
        this.mediaPath = mediaPath; //optional
        this.time = new Date().getTime();
    }

};

exports.Pin = class {

    constructor(type, matchID, time, scorer) {
        this.type = type;
        /*
        1: Goal
        2: Yellow Card
        3: Red Card
        4: Half Time
        */
        this.matchID = matchID;
        this.time = time;
        this.scorer = scorer;
    }

};

exports.Match = class {

    constructor(date, team1, team2) {
        this.time = time;
        this.team1 = team1;
        this.team2 = team2;
    }

};

exports.Vote = class {

    constructor(type, userID, reactionID) {
        this.time = new Date().getTime();
        this.userID = userID;
        this.type = type
        this.reactionID = reactionID;
    }

};