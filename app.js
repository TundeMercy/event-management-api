'use strict'

// Importing all dependencies
const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('event-manager');
const bodyParser = require('body-parser');
const Joi = require('joi');

//importing eventStore from "./eventStore";
const eventStore = require('./eventStore');

//creating the express object to use in the app
const app = express();

//setting up app to define requests' body Content-Type the app can parse
app.use(bodyParser.json());//parses JSON
app.use(bodyParser.urlencoded({extended: false})); //application/x-www-form-urlencoded Content-Type

eventStore.loadEvents();

//function to validate request body using Joi
let validateEvent = (event) => {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        date: Joi.date().required(),
        venue: Joi.string().required(),
        address: Joi.string().min(5),
        expectedAttendees: Joi.number()
    }).pattern(/./, Joi.any());

    return Joi.validate(event, schema);
} //end of validateEvent


//a request to the root path send the README.md file
app.get('/', (req, res) => {
    res.status(200).sendFile(__dirname + "/README.md");
});

//handle post request to add new event
//Returns a JSON representation of the
//added staff
app.post('/eventapi', (req, res) => {

    //Preparing a new event before adding it to the array of events
    const eventToAdd = {
        id: `Event${eventStore.getEventCount() + 1}` //dynamically assign a unique ID
    };
    for(const key in req.body){             //add each of the user defined property to the prep event object 
        eventToAdd[key] = req.body[key];
    }
    //validating the prepared event before adding it up
    const { error } = validateEvent(eventToAdd); //get the error object returned by the validateEvent func
    if(error == null){      //if no validating error occur
        eventStore.addEvent(eventToAdd);  //add the event
        eventStore.saveEvent();
        res.status(200);
        res.json(eventStore.getEvent(eventToAdd.id)); //get and return the newly added event to be sure it's in eventStore
    }
    else {      //if error occur
        res.status(400).send(error.details[0].message);  //send the error details
    }
});

//handle put request to update an event
//Returns a JSON representation of the
//updated event(if found)
app.put('/eventapi/:eventID', (req, res) => {
    const eventID = req.params.eventID;
    const propToUpdate = req.body;
    const eventToUpdate = eventStore.getEvent(eventID);  //try to get the event to update form event store
    if(eventToUpdate){      //if such event exists
        for(let key in propToUpdate){                   //modify all event property specified to be updated
            eventToUpdate[key] = propToUpdate[key];
        }
        //validating the updated event before sending changes over to event store
        const { error } = validateEvent(eventToUpdate);
        if(error !== null){  //if error occur
            return res.status(400).send(error.details[0].message); //send the error details
        }
        eventStore.saveEvent();
        res.status(200).json(eventStore.update(eventID, eventToUpdate)); //otherwise, effect the change and return the updated event
    }
    else {  //if the event doesn't exist
        res.status(404).json({  //send a 404 error
            "error": "No event matches the given eventID"
        })
    }
});

//handle request to get all events
//Returns an array of events in JSON form
app.get('/eventapi', (req, res) => {
    res.status(200);
    res.json(eventStore.getAllEvents());
}); 


//handle the request to get a single event
//(with the specified :eventID).
//Returns an object - JSON - if found.
//Otherwise, returns JSON with the key "error"
app.get('/eventapi/:eventID', (req, res) => {

    const event = eventStore.getEvent(req.params.eventID); //try to get the event
    if(event){ //check to see if the event exists
        res.status(200).json(event); //return if exists
    }
    else {
        res.status(404).json({"error": "No event matches the given eventID"}); //return a 404 error if not found.
    }
});

//handle request to delete an event
//with the specified eventID.
//Return a JSON representation of the
//deleted event if found.
//Otherwise, returns JSON with the key "error"
app.delete('/eventapi/:eventID', (req, res) => {
    const event = eventStore.deleteEvent(req.params.eventID); //try to delete the event
    if(event){ //check to see if the event exists
        eventStore.saveEvent();
        res.status(200).json(event); //return the deleted event if exists
    }
    else {
        res.status(404).json({"error": "No event matches the given eventID"}); //return error 404
    }
});

//set the port to listening on and listen
const port = process.env.PORT || 8833;
const server = app.listen(port,debug(chalk.yellow.bold(`listening on port: ${chalk.red.bold(port)}`)));

process.on('SIGINT', () => {
    debug(`${chalk.green('Writing to file...')}`);
    eventStore.saveEvent();
    server.close(() => {
        debug(`${chalk.green('Shutting down server')}`);
        process.exit(0);
    });
});