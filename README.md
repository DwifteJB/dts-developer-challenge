# DTS Developer Challenge

The live preview is at [dts.rmfosho.me](https://dts.rmfosho.me)

## Backend

The backend is written in **GoLang** and uses the following modules:

|Name|Reasoning|
|--|--|
| Go-chi |lightweight, fast http router  |
| Gorm.io |easy and powerful ORM database library  |
| Gorm.io postgres |postgres driver for gorm|
| godotenv |reading of .env files to inject into os.env|

Go-chi allows routering to be blazingly fast. For example, locally a single postgres request takes around 20-40 **μs**. Gorm allows for a safe and easy way to interface with Postgres, as well as an easy way to switch in the future, if ever required; as well as easy migrations & hooks onto objects.

## APIs

### Get All Tasks
**Method:** GET
**Path:** /task/all
**Returns:** 

    [
	  {
        "ID": number,
        "CreatedAt": "2026-02-17T00:42:07.459722Z",
        "UpdatedAt": "2026-02-17T00:43:22.915308Z",
        "DeletedAt": null,
        "Title": string,
        "Description": string,
        "Status": string,
        "DueDate": "2004-02-01T04:30:00Z"
      },
      ...
    ]



### Create Task
**Method:** POST
**Path:** /task/create
**Body:** 

    {
	    "title": "title",
	    "description": "optional",
	    "status": "status":
	    "duedate": "2006-01-02T15:04:05Z07:00"
    }
**Returns:**

    {
         "ID": number,
         "CreatedAt": "2026-02-17T00:42:07.459722Z",
         "UpdatedAt": "2026-02-17T00:43:22.915308Z",
         "DeletedAt": null,
         "Title": string,
         "Description": string,
         "Status": string,
         "DueDate": "2004-02-01T04:30:00Z"
    },

### Get Task by ID
**Method:** GET
**Path:** /task/{id}/
**Returns:**

    {
         "ID": number,
         "CreatedAt": "2026-02-17T00:42:07.459722Z",
         "UpdatedAt": "2026-02-17T00:43:22.915308Z",
         "DeletedAt": null,
         "Title": string,
         "Description": string,
         "Status": string,
         "DueDate": "2004-02-01T04:30:00Z"
    },
    
### Delete Task
**Method:** POST
**Path:** /task/{id}/delete
**Returns:**

    {"message":"Task deleted successfully"}

### Update Status
**Method:** POST
**Path:** /task/{id}/update
**Body:** 

    {"status": "new status"}

**Returns:**

    {"message":"Task status updated successfully"}




### How to run
#### Docker Method

The easiest way is to run this via docker, there is a docker-compose.yml file in the main directory, and you can get the backend & postgres running instantly by:

    docker compose up --build -d
This will build the buildfile within backend & also setup the postgres server.

### Manually
Setup postgres via whatever service, or use the docker compose file

Edit the .env file with the postgres DSN

Then install [golang](https://go.dev/) and run:

    cd backend
    go mod tidy
    go run .

This will cause the server to run on localhost:3000, which can be port forwarded/tunneled

## Frontend

The frontend is written within vite, react and using typescript. I was originally going to use flutter, but that seems beyond overkill and not part of what the job may entail.

There is no UI libraries, other than tailwind, which I would not class as one.

This is a pretty simple react app, I was going to add more to  it, but I wanted to get through all the specifications first.

### How to build
 

    cd frontend
    npm i -g yarn # if yarn is not installed
    yarn
    yarn build

Then there will be a folder called dist as the built files.
