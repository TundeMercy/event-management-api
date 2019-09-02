A simple RESTful API to keep track of your various events

Install all dependencies before running

This web service `API` Defines endpoints to handle all the `RESTful` `CRUD` operation:
    `CREATE`: Send a `POST` request to this path `/eventapi` add new event.
            The request Header should define the `Content-Type` property has `application/x-www-form-urlencoded` .
            
            The request body is validated with Joi, using the following schema

                ```javascript
                const schema ={
                    name: Joi.string().required(),
                    date: Joi.date().required(),
                    venue: Joi.string().required(),
                    address: Joi.string().min(5),
                    expectedAttendees: Joi.number()
                };
                ```


            All required property must be provided in the body of the request.

            A typical response looks like:

                    ```javascript
                    {
                        "date": "2019/09/28",
                        "name": "Dev Career first get together",
                        "venue": "ICC UI",
                        "id": "Event1",
                        "daysToEvent": 31
                    }
                    ```
    `READ`: Send a GET request to the path `/` to get this README file.
            Send a `GET` request to the path "/eventapi" to get an array of event objects in JSON form
            Send a GET request to this path "/eventapi/:eventID", to get a specific event identified by the :eventID parameter.
            If no event matches the request parameter, an object with a single key "error" is returned.

    UPDATE: Send a PUT request to this path "/eventapi:eventID" to update the event identified by the :eventID parameter.
            The request header and body should be similar to that of the CREATE above, only that the body can have only those properties you wish to change.

    DELETE: Send a DELETE request to this path, "/eventapi/:eventID", to delete a specific event identified by the :eventID parameter.
            This request delete and returns the specified event and if found in the collection.
            If no event matches the request parameter, an object with a single key "error" is returned.
