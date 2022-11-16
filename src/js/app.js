import UTIF from './utif';


class Token {
    constructor(accessToken, type, expireSec, scope, refreshToken, iat, exp) {
        this.accessToken = accessToken;
        this.type = type;
        this.expireSec = expireSec;
        this.scope = scope;
        this.refreshToken = refreshToken;
        this.iat = iat;
        this.exp = exp;
    }
};

class User{
    constructor(ip, username, password, clientID, clientSecret) {
        this.ip = ip;
        this.username = username;
        this.password = password;
        this.clientID = clientID;
        this.clientSecret = clientSecret;
    }
};

let token;

function getToken(ip,cliId,cliSecret,user,password)
{
    let url = `http://${ip}/api/oauth/token?client_id=${cliId}&client_secret=${cliSecret}&grant_type=password&username=${user}&password=${password}`;

    let xmlHttp = new XMLHttpRequest();

    xmlHttp.open('POST', url, false);
    xmlHttp.setRequestHeader('accept', 'application/json');

    xmlHttp.onreadystatechange = function() {
        if(xmlHttp.readyState === 4 && xmlHttp.status === 200) {

            let response = JSON.parse(xmlHttp.responseText);
            token = new Token(response['access_token'],response['token_type'],response['expires_in'],response['scope'],response['refresh_token'],response['iat'],response['exp']);
        }
    }
    xmlHttp.send();
}

////////////////////////////////////////////////////////////////////////////////////

let r,g,b,a;
let c = document.getElementById("canvas");
let ctx = c.getContext("2d");
let hertz = document.getElementById('hz');
let start, end, sumTime = 0, counter = 0;

function imgLoaded(e) {
    let ifds = UTIF.decode(e.target.response);
    UTIF.decodeImages(e.target.response, ifds)
    let rgba  = UTIF.toRGBA8(ifds[0]);  // Uint8Array with RGBA pixels

    //console.log(rgba);

    for(let i = 0; i < (4*ifds[0].width*ifds[0].height); i+=4){ //Notice i+=3

        r = rgba[i + 0];
        g = rgba[i + 1];
        b = rgba[i + 2];
        a = rgba[i + 3];

        ctx.fillStyle = "rgba("+r+","+g+","+b+", "+a+")";
        ctx.fillRect( (i/4)%ifds[0].width, Math.floor((i/4)/ifds[0].width), 1, 1 );
    }


    //console.log(ifds[0].width, ifds[0].height, ifds[0]);

    end = new Date();
    let time = end.getTime()-start.getTime();
    sumTime += time;
    counter++;
    //console.log((sumTime/counter) + ' ms');
    hertz.innerHTML = (1000/(sumTime/counter)).toFixed(3) + ' HZ';


    getTiffData(user);
}

function getTiffData(user){

    start = new Date();

    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open( 'GET', `http://${user.ip}/api/images/live`, true); // false for synchronous request
    xmlHttp.setRequestHeader('accept', 'image/tiff');
    xmlHttp.setRequestHeader('Authorization', `Bearer ${token.accessToken}`);
    xmlHttp.responseType = 'arraybuffer';

    xmlHttp.onload = imgLoaded;

    xmlHttp.send( null );
}

////////////////////////////////////////////////////////////////////////////////////


let ipAddress = '192.168.3.20';       /* '192.168.3.20'  'localhost:8080' */
let clientID = 'irsxApp';
let clientSecret = 'MnrY2L86pEQr53!6';
let username = 'administrator';
let password = 'administrator';


let user = new User(ipAddress, username, password, clientID, clientSecret);
getToken(user.ip, user.clientID, user.clientSecret, user.username, user.password);

getTiffData(user);






