var io = require('socket.io')(8092);
io.set('origins', '*:*');
var v = require('vec3');
const mineflayer = require('mineflayer')
const readline = require('readline');
const Webhook = require("webhook-discord")
const express = require('express')
const fs = require("fs");
const app = express()
const port = 8095
const pm2 = require('pm2')
//const Hook = new Webhook("https://discordapp.com/api/webhooks/474143104924909580/ji_TyKsivTSHhvHWVeQQmmlND32PyiiA5PDtvylqhKBOwj8rX2-YzTOG5AdXoFZPV6x6");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var Pig;
var Water;
var Stijn;
var bots = [];
var botigns = [];
var botnames = {};
var botnr = 1
/*

const MongoClient = require('mongodb').MongoClient;
async function mongotest() {
client = await MongoClient.connect("mongodb://localhost:27017/Bots");
const db = client.db("Bots");
const collection = db.collection('Bots');




collection.find({}).toArray(function(err, result) {
//console.log(result[0].bots)

});

};*/
//var joincommand = "/play factions"
//const host = "66.70.181.76"
//const host = "137.74.46.4"
/////////
var accounts = require('./accounts.json');
var config = require('./config.json')

app.get('/api/ip', (req, res) => res.send(config.ip + ":" + config.port))


accounts.forEach(function(account) {
    botnr++
    setTimeout(function() {

        try {
            console.log(account.name);
            /////////
            // Create bot
            /////////
            botnames[account.name] = mineflayer.createBot({
                host: config.ip,
                port: config.port,
                username: account.username,
                version: "1.11.2",
                password: account.password
            })

          //  mongotest()
            /////////

            setTimeout(function() {
botnames[account.name].chat(config.joincommand);
                console.log(`spawned and did ${config.joincommand}`)
            }, 3000);

                
         


            console.log(account.name + " init")
            botigns.push(account.name);
            bots.push(botnames[account.name]);
        } catch (err) {
            console.log(err);
        }


        console.log("--------\n" + bots + "\n----------------")
        botnames["FePig"].on('kicked', (reason) => {
            console.log("Fear got kicked for: " + reason)

            setTimeout(function() {
                console.log("restarting bots cuz fear got kicked");
                pm2.connect(function(err) {
                    pm2.restart("cactus");
                });
            }, 600000);



        });



    }, botnr * 5000);


});



setTimeout(function() {
    botnames["FePig"].on('message', (message) => {
        console.log(message);
        io.emit('chatc', {
            "message": message.toAnsi(),
            "username": "FePig"
        });
    });
}, 12000);




/*
function joinpig() {
    Pig = mineflayer.createBot({
        host: host,
        username: "FearTehPig",
        version: "1.9",
    })
    console.log("1. pig init");

}

function joinwater() {
    Water = mineflayer.createBot({
        host: host,
        username: "w.ereld03@gmail.com",
        version: "1.9",
    })
    console.log("2. water init");
    
    //console.log(bots);
}

function joinstijn() {
    var Stijn = mineflayer.createBot({
        host: host,
        username: "stijn.boeren@hotmail.nl",
        version: "1.9",
    })
    console.log("3. stijn init");
    bots = [Water, Pig, Stijn]
        botnames = {"Waterwerse": Water, "stijn31231": Stijn, "FearTehPig": Pig}
    console.log("x. list init");
            Water.on('message', (message) => {
            console.log(message);
io.emit('chatc', {"message": message.toAnsi(), "username": "Waterwerse"});
});

}*/
//joinpig()
//setTimeout(joinwater, 5000);
//setTimeout(joinstijn, 12000);

//console.log(Stijn)



//Pig.username = "FearTehPig"
//Water.username = "Waterwerse"
/*
function initbotloop() {
    bots.forEach(function(bot) {
       

        bot.once('spawn', () => {
            //bot.chat('/play factions');
            //bot.quit()
            bot.chat("hey");
        });

        bot.on('message', (message) => {
            console.log(message);
            io.emit('chatc', {
                "message": message.toAnsi(),
                "username": bot.username
            });


            try {
                if (message.extra[2] !== undefined) {

                    if (

                        message.extra[2].text.indexOf("+") !== -1

                    ) {
                        console.log("[inttest]" + parseInt(message.extra[2].text) + "[delim]");
                        console.log("[text] " + message.extra[2].text);
                        try {
                            var arr = message.extra[2].text.split(" + ")
                            var i = parseInt(arr[0]) + parseInt(arr[1])
                            console.log("[nr]" + i);
                            io.emit('number', i);
                            //Pig.chat(i);
                        } catch (err) {

                            console.log(err)
                        }
                    }
                }



            } catch (err) {
                //console.log(err);
            }
            if (message.json.hoverEvent !== undefined) {
                console.log(message.json.hoverEvent.value[0].text);
                // Pig.chat(message.json.hoverEvent.value[0].text);
            }
            /* if(message.extra[1].text == 'Solve'){
            //    console.log("%c" + message.extra[2].text, "color:" + Orange);
                console.log('\x1b[33m%s\x1b[0m', message.extra[2].text);  //yellow
            }
            if(message.extra[1].text == 'Hover for the word to type!'){

console.log('\x1b[33m%s\x1b[0m', message.json.hoverEvent.value);
            }


        })


    });

}
*/
//setTimeout(initbotloop, 4000);
//initbotloop()

rl.on('line', (input) => {
    if (input == "block") {
        bots.forEach(function(bot) {
            console.log(bot.blockAt(bot.entity.position.offset(0, -1, 0)).type);
        });



    }




    if (input == "join") {
        bots.forEach(function(bot) {
            bot.chat("/play factions");
        });
    }


});
//if (input == "raided"){
//console.log(bot.blockAt(v(9602, 250, 9602)));
//}else{
//bot.chat(input);
//}

function joinfacs() {
    bots.forEach(function(bot) {
        bot.chat("/server skyblockice");
    });
}


//setInterval(joinfacs, 90000);

function checkraid() {
    try {
        if (Pig.blockAt(v(9902, 11, 9851)).name != "cobblestone") {
            console.log("weawoo");
            Hook.err("Pizza", "I like pizza, do you?")
        }
    } catch (error) {
        console.log("[err] " + error);
    }


}
//setInterval(checkraid, 9000);

function initwebsocket() {
    console.log("initting websockets")
    io.on('connection', function(socket) {
        console.log("connection!")
        socket.on('names', function(msg) {
            io.emit('igns', botigns);
        });
        socket.on('jump', function(msg) {
            botnames["FePig"].setControlState('forward', true)
            setTimeout(function() {
                botnames["FePig"].setControlState('forward', false)
            }, 1000)
        });
        socket.on('joincommand', function(msg) {
            config.joincommand = msg;

            fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(err) {
                if (err) return console.log(err);
                console.log(JSON.stringify(config, null, 2));
            });


        });
        socket.on('chat', function(msg) {
            console.log("un: " + msg.username);
            console.log("botobject: " + botnames[msg.username])
            console.log(msg.message)
            try {
                botnames[msg.username].chat(msg.message);
            } catch (err) {
                if (msg.username == "all") {
                    bots.forEach(function(bot) {
                        bot.chat("/" + msg.message);
                    });
                } else {
                    console.log(err)
                }

            }
            //  console.log(botnames);
        });

        socket.on('setip', function(msg) {
            console.log(msg);
            if (msg.indexOf(":") > -1) {
                var splitted = msg.split(":");
                config.ip = splitted[0];
                config.port = Number(splitted[1]);
            } else {
                config.ip = msg;
                config.port = 25565
            }



            fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(err) {
                if (err) return console.log(err);
                console.log(JSON.stringify(config, null, 2));
            });



        });
        socket.on('restart', function(msg) {

            pm2.connect(function(err) {
                pm2.restart("cactus")
            });
        });
        bots.forEach(function(bot) {
            console.log(bot.username)


            socket.on('join', function(msg) {
                bot.chat("/play factions");
            });
            socket.on('joinsb', function(msg) {
                bot.chat("/play skyblock");
            });

        });
    });
}
initwebsocket()
//setTimeout(initwebsocket, 4000);
app.listen(port, () => console.log(`Api server listening on port ${port}!`))
