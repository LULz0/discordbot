const {PubgAPI, PubgAPIErrors, REGION, SEASON, MATCH} = require('pubg-api-redis');
const fs = require('fs');// file read,save,etc
const settings = {version: "Version: 0.4.7-b3", season: "2017-pre5"};
////                        PUBG SETTINGS                                   ////
const api = new PubgAPI({
  apikey: '83bf0fbf-61f8-461a-afd2-f30e4ef49f4b',
});// TODO: pakeisti api nes jau vieni naudoja sita
////
const CurrentSeason = "2017-pre5";
const regions = ["eu", "na", "oc", "sa", "sea", "as"];
const matchs = ["solo", "duo", "squad", "solo-fpp","duo-fpp","squad-fpp"];
/*###########################################################################*/


const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {

    if (message.author.bot) return; // always ignore bots!

////                              LINK account                                    \\\\\
  if (message.content.startsWith("!link") || message.content.startsWith(".link")) { // TODO: su link viska padaryta regis
      // message.reply('Pong!');
  const args = message.content.split(/\s+/g);//args[1]
      if (typeof args[1] !== 'undefined' && args[1] !== null) {
        var path=`./users/pubg/${args[1]}.json`;// TODO: is main json keltis i pubg dir  ir is ten tikrinti ar nera uzimtas toks pubg useris jau ^^
              fs.stat(path, function(err, stat) {
                  if(err === null) {
                      let pubg_data =  JSON.parse(fs.readFileSync(`./users/pubg/${args[1]}.json`, "utf8"));
                      // console.log(pubg_data.user +"==="+ message.author.id);
                        if (pubg_data.user === message.author.id) {
                          const embed = {"title": " :boom: Whoops! ", "description": `You already have ${pubg_data.pubg_name} linked to your Discord account. To refresh your statistics and current rank, use .rank instead.`,  "fields": [],timestamp: new Date(),footer: { text: settings.version  }};
                            message.channel.send({embed});
                        }else{
                          const embed = {"title": " :boom: Whoops! ", "description": " `"+args[1]+"` is already linked to another Discord account. If you feel this is in error, please contact one of the mods in our Discord Server with proof that you own the account.",  "fields": [],timestamp: new Date(),footer: { text: settings.version  }};
                            message.channel.send({embed});
                        }

                  }else{
                      var pathas=`./users/${message.author.id}.json`;
                        fs.stat(pathas, function(err, stat) {
                          if(err === null) {
                              let user_data = JSON.parse(fs.readFileSync(`./users/${message.author.id}.json`, "utf8"));
                                fs.access(`./users/pubg/${user_data.pubg_name}.json`, (err) => {
                                   if (!err) {
                                     console.log('myfile exists');
                                        fs.unlink(`./users/pubg/${user_data.pubg_name}.json`, function(error) {
                                            if (error) {
                                                throw error;
                                            }
                                              console.log(`Deleted ${user_data.pubg_name}.json`);
                                        });
                                          return;
                                      }
                                  console.log('myfile does not exist');
                                });

                            }
                              api.getProfileByNickname(`${args[1]}`).then((profile) => {
                                  var new_user= {};
                                    new_user['user']  = message.author.id;
                                      new_user['pubg_name'] = args[1];
                                        new_user['username'] = message.author.username;
                                            var pubg  = {};
                                              pubg['user']  = message.author.id;
                                                pubg['pubg_name'] = args[1];
                                                // console.log('update main files');
                                          fs.writeFile(`./users/${message.author.id}.json`, JSON.stringify(new_user, null, 2));
                                            fs.writeFile(`./users/pubg/${args[1]}.json`, JSON.stringify(pubg, null, 2));
                                            const embed = {"title": ":white_check_mark: Account linked ", "description": "You have successfully linked "+args[1]+" to your Discord account. Your ranks will update momentarily.",  "fields": [],timestamp: new Date(),footer: { text: settings.version  }};// TODO: prideti is steam avatar i embeded
                                              message.channel.send({embed});
                                }).catch(function(e) {
                                //    console.log(e);
                                      //  fs.writeFileSync(`./errorOut2.json`, JSON.stringify(e, null, 2));
                                         if(e.name === "ProfileNotFound"){
                                           const embed = {"title": ":boom: Whoops! ", "description": "`"+args[1]+"` doesn't seem to be a PUBG account. Check your spelling and try again.",  "fields": [],timestamp: new Date(),footer: { text: settings.version  }};// TODO: prideti is steam avatar i embeded
                                            message.channel.send({embed});
                                         }
                                });
                          });
                  }
              });
      }
}




// if (message.content === 'ping') {
//     message.reply('Pong!');
//   }




if (message.content.startsWith("!rank") || message.content.startsWith(".rank")) {
  const args = message.content.split(/\s+/g);//args[1]

var useris= "";
if(!args[1]){
  fs.access(`./users/${message.author.id}.json`, (err) => {
    if (!err) {
      let user_data = JSON.parse(fs.readFileSync(`./users/${message.author.id}.json`, "utf8"));
      api.getProfileByNickname(user_data.pubg_name).then((profile) => {
        const data = profile.content;
            const obj = profile.getFullStats({
                season: SEASON.EA2017pre4,
            });
            fs.writeFile(`./users/stats/${user_data.pubg_name}.json`, JSON.stringify(obj, null, 2));
      });
    }else{
      const embed = {"title": ":boom: Whoops! ", "description": "`@"+message.author.username+"` has not linked their PUBG account with me. Use their in-game name, or tell them to register their account using !link [in-game name].",  "fields": [],timestamp: new Date(),footer: { text: settings.version  }};// TODO: prideti is steam avatar i embeded
       message.channel.send({embed});
    }
  });




  fs.access(`./users/${message.author.id}.json`, (err) => {
    if (!err) {
    let user = JSON.parse(fs.readFileSync(`./users/${message.author.id}.json`, "utf8"));
    var obj;
      fs.stat(`./users/stats/${user.pubg_name}.json`, function(err, stat) {
          if(err === null) {
            // var obj = JSON.parse(fs.readFileSync(`./users/stats/${user.pubg_name}.json`, "utf8"));
            // fs.readFile(`./users/stats/${user.pubg_name}.json`, {encoding: 'utf8'}, function(err, obj) {
            fs.readFile(`./users/stats/${user.pubg_name}.json`, { encoding: 'utf8' }, function(err, data) {
              if (err) throw err;

                obj = JSON.parse(data);

            var PName="";
              if ('playerName' in obj){PName=obj.playerName;}else{ PName="?????";}
        const embed = {"title": ":bar_chart: Statistics for "+PName+" ",   "fields": [],timestamp: new Date(),footer: { text: settings.version  },timestamp: new Date(),footer: { text: settings.version  }};//
          if(obj["data"].hasOwnProperty(CurrentSeason) === true){
            for (var r = 0; r < regions.length; r++){
             if(obj["data"][""+CurrentSeason+""].hasOwnProperty(regions[r]) === true){
                  for (var k = 0; k < matchs.length; k++) {
                     if(obj["data"][""+CurrentSeason+""][""+regions[r]+""].hasOwnProperty(matchs[k]) === true){
                          var reg = regions[r];
                            var mupp = matchs[k];

                              // temp =reg.toUpperCase()+" - "+ mupp.toUpperCase()+"\nRank #"+obj["data"][""+CurrentSeason+""][""+regions[r]+""][""+matchs[k]+""].rankData.rating+" \n";
                                embed.fields.push({"name": reg.toUpperCase()+" - "+ mupp.toUpperCase(), "value": "Rank #"+obj["data"][""+CurrentSeason+""][""+regions[r]+""][""+matchs[k]+""].rankData.rating+"", "inline": true});
                                  // embed.fields.push({"name": reg.toUpperCase()+" - "+ mupp.toUpperCase(), "value": "✅", "inline": true});
                                    //  console.log(reg.toUpperCase()+" - "+ mupp.toUpperCase()+"\nRank #"+obj["data"][""+CurrentSeason+""][""+regions[r]+""][""+matchs[k]+""].rankData.rating);
                    }
                  }// for loop  regions  end
             }
            }
          }
          message.channel.send({embed});
      });
      // console.log("out of function"+obj);
        }else{console.log("Nera dar statu");}
      });

    }// TODO sukurti kad reikia su embed linkinti acc daunui :D
  });




}else{
 // console.log("vygdo antra su argumentu"+args[1]);
  api.getProfileByNickname(args[1]).then((profile) => {
    const data = profile.content;
        const status = profile.getFullStats({
            season: SEASON.EA2017pre4,
        });

            // fs.writeFile('helloworld.txt', 'helloworld', function () {
            //     res.download('helloworld.txt');
            // });

        fs.writeFile(`./users/stats/${args[1]}.json`, JSON.stringify(status, null, 2), function () {
          var obj;
            fs.stat(`./users/stats/${args[1]}.json`, function(err, stat) {
                if(err === null) {
                  // var obj = JSON.parse(fs.readFileSync(`./users/stats/${user.pubg_name}.json`, "utf8"));
                  // fs.readFile(`./users/stats/${user.pubg_name}.json`, {encoding: 'utf8'}, function(err, obj) {
                  fs.readFile(`./users/stats/${args[1]}.json`, { encoding: 'utf8' }, function(err, data) {
                    if (err) throw err;


                       obj = JSON.parse(data);
                      // var obj = JSON.parse(fs.readFileSync(`./users/stats/${user.pubg_name}.json`, "utf8"));
                  var PName="";
            if ('playerName' in obj){PName=obj.playerName;}else{ PName="?????";}
              const embed = {"title": ":bar_chart: Statistics for "+PName+" ",   "fields": [],timestamp: new Date(),footer: { text: settings.version  },timestamp: new Date(),footer: { text: settings.version  }};//
              // console.log("Vygdo Dar");
                if(obj["data"].hasOwnProperty(CurrentSeason) === true){
                  // console.log('obj["data"].hasOwnProperty(CurrentSeason):'+obj["data"].CurrentSeason);
                  for (var r = 0; r < regions.length; r++){
                   if(obj["data"][""+CurrentSeason+""].hasOwnProperty(regions[r]) === true){
                      //  console.log('obj["data"][""+CurrentSeason+""].hasOwnProperty(regions[r]):'+obj["data"].CurrentSeason);
                        for (var k = 0; k < matchs.length; k++) {
                           if(obj["data"][""+CurrentSeason+""][""+regions[r]+""].hasOwnProperty(matchs[k]) === true){
                                var reg = regions[r];
                                  var mupp = matchs[k];

                                    // temp =reg.toUpperCase()+" - "+ mupp.toUpperCase()+"\nRank #"+obj["data"][""+CurrentSeason+""][""+regions[r]+""][""+matchs[k]+""].rankData.rating+" \n";
                                      embed.fields.push({"name": reg.toUpperCase()+" - "+ mupp.toUpperCase(), "value": "Rank #"+obj["data"][""+CurrentSeason+""][""+regions[r]+""][""+matchs[k]+""].rankData.rating+"", "inline": true});
                                        // embed.fields.push({"name": reg.toUpperCase()+" - "+ mupp.toUpperCase(), "value": "✅", "inline": true});
                                          //  console.log(reg.toUpperCase()+" - "+ mupp.toUpperCase()+"\nRank #"+obj["data"][""+CurrentSeason+""][""+regions[r]+""][""+matchs[k]+""].rankData.rating);
                          }
                        }// for loop  regions  end
                   }
                  }
                }
                message.channel.send({embed});
            });
            // console.log("out of function"+obj);
              }else{console.log("Nera dar statu");}
            });

        });
  }).catch(function(e) {
  //    console.log(e);
        //  fs.writeFileSync(`./errorOut2.json`, JSON.stringify(e, null, 2));
           if(e.name === "ProfileNotFound"){
             const embed = {"title": ":boom: Whoops! ", "description": "`"+args[1]+"` doesn't seem to be a PUBG account. Check your spelling and try again.",  "fields": [],timestamp: new Date(),footer: { text: settings.version  }};// TODO: prideti is steam avatar i embeded
              message.channel.send({embed});
              return;
           }
  });

} //   rank message


}// rank


// TODO: cia dirbu dabar
if (message.content.startsWith("!bot")) {
  if(message.author.id === "331453716718682112"){
       message.reply('Bot is working! ^^');
  }

// TOP 25, TOP 100, TOP 250 , TOP 500 TOP 3K

// message.member.addRole(member.guild.roles.find("name","test"));
  // console.log(Object.keys(message.member));

}// role


if (message.content.startsWith(".help") || message.content.startsWith("!help")) {
  const embed = {"title": ":books: Help", "description": "",  "fields": [      {
        "name": ".link [in-game username]",
        "value": "Associates the specified PUBG player with your Discord account."
      },
      {
        "name": ".rank [in-game username or mention]",
        "value": "Shows the in-game leaderboard ranks of the specified player."
      },
      {
        "name": ".update",
        "value": "Updates your rankings and roles based on the current stats available from PUBG."
      },],timestamp: new Date(),footer: { text: settings.version  }};
   message.channel.send({embed});
}// role


if (message.content.startsWith("!update") || message.content.startsWith(".update")) {
  console.log("TEST");

  const args = message.content.split(/\s+/g);//args[1]
if(!args[1]){
  fs.access(`./users/${message.author.id}.json`, (err) => {
    if (!err) {
      let user_data = JSON.parse(fs.readFileSync(`./users/${message.author.id}.json`, "utf8"));
      api.getProfileByNickname(user_data.pubg_name).then((profile) => {
        const data = profile.content;
            const obj = profile.getFullStats({
                season: SEASON.EA2017pre4,
            });
            fs.writeFile(`./users/stats/${user_data.pubg_name}.json`, JSON.stringify(obj, null, 2),() => {
              const embed = {"title": ":white_check_mark: Refreshed your stats and ranks!", "description": "",  "fields": [],timestamp: new Date(),footer: { text: settings.version  }};
               message.channel.send({embed});
                let user_update = JSON.parse(fs.readFileSync(`./users/stats/${user_data.pubg_name}.json`, "utf8"));
                var role = 9999999;

                if(user_update["data"].hasOwnProperty(CurrentSeason) === true){
                  for (var r = 0; r < regions.length; r++){
                   if(user_update["data"][""+CurrentSeason+""].hasOwnProperty(regions[r]) === true){
                        for (var k = 0; k < matchs.length; k++) {
                           if(user_update["data"][""+CurrentSeason+""][""+regions[r]+""].hasOwnProperty(matchs[k]) === true){
                             if(role>user_update["data"][""+CurrentSeason+""][""+regions[r]+""][""+matchs[k]+""].rankData.rating){
                               role=user_update["data"][""+CurrentSeason+""][""+regions[r]+""][""+matchs[k]+""].rankData.rating;
                             }
                          }
                        }// for loop  regions  end
                   }
                  }


  let Top_5000 = message.guild.roles.find("name", "Top 5000");
  let Top_1000 = message.guild.roles.find("name", "Top 1000");
  let Top_500 = message.guild.roles.find("name", "Top 500");
  let Top_250 = message.guild.roles.find("name", "Top 250");
  let Top_100 = message.guild.roles.find("name", "Top 100");
  let Top_25 = message.guild.roles.find("name", "Top 25");
var newRole=99999999999;

role



if(5000<role){
//   if(message.member.roles.some(r=>["Top 3000"].includes(r.name)) ) {
// message.member.removeRole(message.guild.roles.find("name","Top 3000"));

message.member.removeRole(message.guild.roles.find("name","Top 5000"));
       message.member.removeRole(message.guild.roles.find("name","Top 1000"));
       message.member.removeRole(message.guild.roles.find("name","Top 500"));
       message.member.removeRole(message.guild.roles.find("name","Top 250"));
       message.member.removeRole(message.guild.roles.find("name","Top 100"));
       message.member.removeRole(message.guild.roles.find("name","Top 25"));
}else{

 if(5000>role){
   newRole=5000;
  if(1000>role){
    newRole=1000;
    if(500>role){
      newRole=500;
      if(250>role){
        newRole=250;
        if(100>role){
          newRole=100;
          if(25>role){
            newRole=25;
          }
        }
      }
    }
  }
}

if(newRole===5000){
  if(message.member.roles.has(Top_1000.id)) {message.member.removeRole(Top_1000.id);}
  if(message.member.roles.has(Top_500.id)) {message.member.removeRole(Top_500.id);}
  if(message.member.roles.has(Top_250.id)) {message.member.removeRole(Top_250.id);}
  if(message.member.roles.has(Top_100.id)) {message.member.removeRole(Top_100.id);}
  if(message.member.roles.has(Top_25.id)) {  message.member.removeRole(Top_25.id);}
  if(message.member.roles.has(Top_5000.id)) {
  }else{
    message.member.addRole(Top_5000.id);
  }
}// 500

if(newRole===1000){
  if(message.member.roles.has(Top_5000.id)) {message.member.removeRole(Top_5000.id);}
  if(message.member.roles.has(Top_500.id)) {message.member.removeRole(Top_500.id);}
  if(message.member.roles.has(Top_250.id)) {message.member.removeRole(Top_250.id);}
  if(message.member.roles.has(Top_100.id)) {message.member.removeRole(Top_100.id);}
  if(message.member.roles.has(Top_25.id)) {  message.member.removeRole(Top_25.id);}
  // message.member.removeRole(Top_1000.id);
  // message.member.removeRole(Top_500.id);
  // message.member.removeRole(Top_250.id);
  // message.member.removeRole(Top_25.id);
  if(message.member.roles.has(Top_1000.id)) {
  }else{
    message.member.addRole(Top_1000.id);
  }
}// 500

if(newRole===500){
  if(message.member.roles.has(Top_5000.id)) {message.member.removeRole(Top_5000.id);}
  if(message.member.roles.has(Top_1000.id)) {message.member.removeRole(Top_1000.id);}
  if(message.member.roles.has(Top_250.id)) {message.member.removeRole(Top_250.id);}
  if(message.member.roles.has(Top_100.id)) {message.member.removeRole(Top_100.id);}
  if(message.member.roles.has(Top_25.id)) {  message.member.removeRole(Top_25.id);}
  if(message.member.roles.has(Top_500.id)) {
  }else{
    message.member.addRole(Top_500.id);
  }
}// 500

if(newRole===250){
  if(message.member.roles.has(Top_5000.id)) {message.member.removeRole(Top_5000.id);}
  if(message.member.roles.has(Top_1000.id)) {message.member.removeRole(Top_1000.id);}
  if(message.member.roles.has(Top_500.id)) {message.member.removeRole(Top_500.id);}
  if(message.member.roles.has(Top_100.id)) {message.member.removeRole(Top_100.id);}
  if(message.member.roles.has(Top_25.id)) {  message.member.removeRole(Top_25.id);}
  if(message.member.roles.has(Top_250.id)) {
  }else{
    message.member.addRole(Top_250.id);
  }
}// 250


if(newRole===100){
  if(message.member.roles.has(Top_5000.id)) {message.member.removeRole(Top_5000.id);}
  if(message.member.roles.has(Top_1000.id)) {message.member.removeRole(Top_1000.id);}
  if(message.member.roles.has(Top_500.id)) {message.member.removeRole(Top_500.id);}
  if(message.member.roles.has(Top_250.id)) {message.member.removeRole(Top_250.id);}
  if(message.member.roles.has(Top_25.id)) {  message.member.removeRole(Top_25.id);}
  if(message.member.roles.has(Top_100.id)) {
  }else{
    message.member.addRole(Top_100.id);
  }
}// 100


if(newRole===25){
  if(message.member.roles.has(Top_5000.id)) {message.member.removeRole(Top_5000.id);}
  if(message.member.roles.has(Top_1000.id)) {message.member.removeRole(Top_1000.id);}
  if(message.member.roles.has(Top_500.id)) {message.member.removeRole(Top_500.id);}
  if(message.member.roles.has(Top_250.id)) {message.member.removeRole(Top_250.id);}
  if(message.member.roles.has(Top_100.id)) {  message.member.removeRole(Top_100.id);}
  if(message.member.roles.has(Top_25.id)) {
  }else{
    message.member.addRole(Top_25.id);
  }
}

}


}// if data exist



                       console.log("role gauna:"+ role+ " NEW ROLE:"+newRole + " Nick:"+user_data.pubg_name);


            });/// write to file status
      });// api pubg


    }else{
      const embed = {"title": ":boom: Whoops! ", "description": "`@"+message.author.username+"` has not linked their PUBG account with me. Use their in-game name, or tell them to register their account using !link [in-game name].",  "fields": [],timestamp: new Date(),footer: { text: settings.version  }};// TODO: prideti is steam avatar i embeded
       message.channel.send({embed});
    }
  });

}

}// update
});// message function

client.login("MzU2MTgyNjk3Njc4MjA5MDM1.DJXrUQ.hSMiXPa-kbD0LXNEQTwQchHdPe0");
