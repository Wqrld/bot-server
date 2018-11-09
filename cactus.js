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

var accounts = require('./accounts.json');
var config = require('./config.json')

app.get('/api/ip', (req, res) => res.send(config.ip + ":" + config.port))


accounts.forEach(function(account) {
    botnr++
    setTimeout(function() {

        try {
            console.log(account.name);
            botnames[account.name] = mineflayer.createBot({
                host: config.ip,
                port: config.port,
                username: account.username,
                version: "1.11.2",
                password: account.password
            })


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
app.listen(port, () => console.log(`Api server listening on port ${port}!`))