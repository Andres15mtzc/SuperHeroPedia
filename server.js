const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static("public"));

let actualId = 1;



app.get("/",(req,res)=>{
    const chunks = [];
    const url = `https://www.superheroapi.com/api.php/2486739504803747/1`;
    https.get(url, (response)=>{
        response.on("data",(data)=>{
            chunks.push(data);
        });
        response.on("end",()=>{
            actualId = 1;
            let rendered = setVars(chunks);

            res.render(__dirname + "/index.html", rendered);
        });
    });
});

app.post("/",(req, res)=>{
    const chunks = [];
    const url = `https://www.superheroapi.com/api.php/2486739504803747/search/${req.body.heroName.toLowerCase()}`;
    https.get(url, (response)=>{
        response.on("data",(data)=>{
            chunks.push(data);
        });
        response.on("end",()=>{
            try {
                const data = Buffer.concat(chunks);
                const herosData = JSON.parse(data);
                let heroData = null;
                for (var i = 0; i < herosData.results.length; i++) {
                    if(req.body.heroName.toLowerCase() == herosData.results[i].name.toLowerCase()){
                        heroData = herosData.results[i];
                        break;
                    }
                }  
                let name = heroData.name;
                let id = heroData.id;
                actualId = id;
                let fullName = heroData.biography["full-name"];
                let photoURL = heroData.image.url;
                let intelligence = heroData.powerstats.intelligence;
                let strength = heroData.powerstats.strength;
                let speed = heroData.powerstats.speed;
                let durability = heroData.powerstats.durability;
                let power = heroData.powerstats.power;
                let combat = heroData.powerstats.combat;
                let placeBirth = heroData.biography["place-of-birth"];
                let smallBio = "-";
                if (placeBirth != "-") {
                    smallBio = fullName + " was born in " + placeBirth;
                    if (heroData.biography["first-appearance"] != "-") {
                        smallBio += ". The first appearance was on " + heroData.biography["first-appearance"];
                    }if (heroData.biography.publisher != "-") {
                        smallBio += ". Published by " + heroData.biography.publisher;
                    }
                }let aliases = heroData.biography.aliases;
                let gender = heroData.appearance.gender;
                let race = heroData.appearance.race;
                let height = heroData.appearance.height[0];
                let weight = heroData.appearance.weight[0];
                let eyeColor = heroData.appearance["eye-color"];
                let hairColor = heroData.appearance["hair-color"];
                let group = heroData.connections["group-affiliation"];

                res.render(__dirname + "/index.html", { id:id, hero:name, fullName:fullName, photoURL:photoURL, intelligence:intelligence, 
                                                        strength:strength, speed: speed, durability:durability, power:power,  combat:combat,
                                                        placeBirth:placeBirth, smallBio:smallBio, aliases:aliases, gender:gender, race:race,
                                                        height:height, weight:weight, eyeColor:eyeColor, hairColor:hairColor, group:group });
            } catch (error) {
                res.render("failed.html");
            }
        });
    });
});
app.post("/next",(req, res)=>{
    if(actualId==731){
        actualId=1;
    }else{
        actualId++;
    }
    
    const chunks = [];
    const url = `https://www.superheroapi.com/api.php/2486739504803747/${actualId}/`;
    https.get(url, (response)=>{
        response.on("data",(data)=>{
            chunks.push(data);
        });
        response.on("end",()=>{
            let rendered = setVars(chunks);

            res.render(__dirname + "/index.html", rendered);
        });
    });
});
app.post("/prev",(req, res)=>{
    if(actualId==1){
        actualId=731;
    }else{
        actualId--;
    }
    const chunks = [];
    const url = `https://www.superheroapi.com/api.php/2486739504803747/${actualId}/`;
    https.get(url, (response)=>{
        response.on("data",(data)=>{
            chunks.push(data);
        });
        response.on("end",()=>{
            let rendered = setVars(chunks);

            res.render(__dirname + "/index.html", rendered);
        });
    });
});

function setVars(chunks){
    const data = Buffer.concat(chunks);
    const heroData = JSON.parse(data);
    let name = heroData.name;
    let id = heroData.id;
    let fullName = heroData.biography["full-name"];
    let photoURL = heroData.image.url;
    let intelligence = heroData.powerstats.intelligence;
    let strength = heroData.powerstats.strength;
    let speed = heroData.powerstats.speed;
    let durability = heroData.powerstats.durability;
    let power = heroData.powerstats.power;
    let combat = heroData.powerstats.combat;
    let placeBirth = heroData.biography["place-of-birth"];
    let smallBio = "-";
    if (placeBirth != "-") {
        smallBio = fullName + " was born in " + placeBirth;
        if (heroData.biography["first-appearance"] != "-") {
            smallBio += ". The first appearance was on " + heroData.biography["first-appearance"];
        }if (heroData.biography.publisher != "-") {
            smallBio += ". Published by " + heroData.biography.publisher;
        }
    }
    let aliases = heroData.biography.aliases;
    let gender = heroData.appearance.gender;
    let race = heroData.appearance.race;
    let height = heroData.appearance.height[0];
    let weight = heroData.appearance.weight[0];
    let eyeColor = heroData.appearance["eye-color"];
    let hairColor = heroData.appearance["hair-color"];
    let group = heroData.connections["group-affiliation"];

    return { id:id, hero:name, fullName:fullName, photoURL:photoURL, intelligence:intelligence, 
            strength:strength, speed: speed, durability:durability, power:power,  combat:combat,
            placeBirth:placeBirth, smallBio:smallBio, aliases:aliases, gender:gender, race:race,
            height:height, weight:weight, eyeColor:eyeColor, hairColor:hairColor, group:group };
}

app.listen(3000, ()=>{
    console.log("Listening to port 3000");
});