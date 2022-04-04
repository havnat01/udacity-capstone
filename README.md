# Serverless UDATASK

The application should store TASK items, and each TASK item contains the following fields:

- `taskId` (string) - a unique id for an item
- `createdAt` (string) - date and time when an item was created
- `name` (string) - name of a TASK item (e.g. "Change a light bulb")
- `dueDate` (string) - date and time by which an item should be completed
- `done` (boolean) - true if an item was completed, false otherwise
- `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a TASK item

# Functions to be implemented

- `Auth` - this function should implement a custom authorizer for API Gateway that should be added to all other functions.

- `GetTasks` - should return all TASKs for a current user. A user id can be extracted from a JWT token that is sent by the frontend

It should return data that looks like this:

```json
{
  "items": [
    {
      "taskId": "123",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "name": "Buy Mac Book M1",
      "dueDate": "2019-07-29T20:01:45.424Z",
      "done": false,
      "attachmentUrl": "http://example.com/image.png"
    },
    {
      "taskId": "456",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "name": "Book 2 cinema's tickets at weekend",
      "dueDate": "2019-07-29T20:01:45.424Z",
      "done": true,
      "attachmentUrl": "http://example.com/image.png"
    }
  ]
}
```

- `SearchTasks` - should return TASKs what match with keyword for a current user.

- `CreateTask` - should create a new TASK for a current user. A shape of data send by a client application to this function can be found in the `CreateTaskRequest.ts` file

It receives a new TASK item to be created in JSON format that looks like this:

```json
{
  "createdAt": "2019-07-27T20:01:45.424Z",
  "name": "Buy Mac Book M1",
  "dueDate": "2019-07-29T20:01:45.424Z",
  "done": false,
  "attachmentUrl": "http://example.com/image.png"
}
```

It should return a new TASK item that looks like this:

```json
{
  "item": {
    "taskId": "123",
    "createdAt": "2019-07-27T20:01:45.424Z",
    "name": "Buy Mac Book M1",
    "dueDate": "2019-07-29T20:01:45.424Z",
    "done": false,
    "attachmentUrl": "http://example.com/image.png"
  }
}
```

- `UpdateTask` - should update a TASK item created by a current user. A shape of data send by a client application to this function can be found in the `UpdateTaskRequest.ts` file

It receives an object that contains three fields that can be updated in a TASK item:

```json
{
  "name": "Buy Airpod",
  "dueDate": "2019-07-29T20:01:45.424Z",
  "done": true
}
```

The id of an item that should be updated is passed as a URL parameter.

It should return an empty body.

- `DeleteTask` - should delete a TASK item created by a current user. Expects an id of a TASK item to remove.

It should return an empty body.

- `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a TASK item.

It should return a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TASK application.
