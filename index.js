//Project 3, 4/12/21, Jessica Kinghorn, Zach Barton, Matthew Watters, Madison Clark, Mason Perry
//This is the main file for the express module that tracks traffic to the website.
const express = require("express"); // This requires the express module.

let app = express(); // This creates our application by calling the express function.

let path = require("path"); // This makes working with ejs files easier.

const port = process.env.PORT || 3000; // This makes code more readable later on
const knex = require(path.join(__dirname + '/knex/knex.js'));

app.set("view engine", "ejs"); // This sets the view engine to be ejs so we can use the embedded javascript.
app.use(express.urlencoded({extended: true}));
// app.use(express.static("public"));
// app.use(express.static(__dirname + "/public"));


// const knex = require("knex")({
//     client: "pg",
//     connection: {
//         host : "localhost",
//         user : "postgres",
//         password : "node3/17",
//         database : "vehicle",
//         port : 5432
//     }
// });
app.get("/", (req, res) => {
    res.render("index", {});
    });


app.get("/displayVehicle", (req, res) => {
    knex.select().from('vehicles').then(vehicles => {
        res.render("displayVehicle", {myvehicles: vehicles});
    });
});

// Deletes a record
app.post("/deleteVehicle:id", (req, res) => {
    knex("vehicles").where("vehicle_id", req.params.id).del().then(vehicles => {
        res.redirect("/displayVehicle");
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});

app.get("/editVehicle:id", (req, res) => {
    knex.select("vehicle_id",
                "description",
                "type",
                "year",
                "mileage",
                "still_using").from("vehicles").where("vehicle_id", parseInt(req.params.id)).then(vehicles => {
                    console.log(vehicles)
                    res.render("editVehicle", {myvehicles: vehicles});
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({err});
                });
            });

app.post("/editVehicle:id", (req, res) => {
    knex("vehicles").where("vehicle_id", parseInt(req.params.id)).update({
        description: req.body.description.toUpperCase(),
        type: req.body.type.toUpperCase(),
        year: req.body.year,
        mileage: req.body.mileage,
        still_using: req.body.still_using ? "Y" : "N"
    }).then(myvehicles => {
        res.redirect ("/displayVehicle")
    }).catch(err => {
        console.log(err.message);
        res.status(500).json({err});
    });
});

app.get("/addVehicle", (req, res) => {
    res.render("addVehicle", {});
})

app.post("/addVehicle", (req, res) => {
    knex("vehicles").insert({description: req.body.description.toUpperCase(),
                             type: req.body.type.toUpperCase(),
                             year: req.body.year,
                             mileage: req.body.mileage,
                             still_using: req.body.still_using ? "Y" : "N"
    }).then(myvehicles => {
        res.redirect("/displayVehicle");
    });
});

app.listen(port, () => console.log("Website started!"))