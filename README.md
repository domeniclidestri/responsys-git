# Responsys Git

Download content library from Oracle Responsys REST API and mirror with git repo.

See https://github.com/domeniclidestri/responsys-rest-api

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org) - v8.9.1+
* [npm](https://www.npmjs.com/) - v5.5.1+

#### Install dependencies

Install with npm

```
npm install
```

#### Setup environment

Set authentication credentials in environment (see .env.example).

[dotenv](https://www.npmjs.com/package/dotenv) package is used which will support reading environment variables from a .env file

```
cp .env.example .env
```

#### Running

```
npm start
```