const http = require("http");
const fs = require("fs");
const path = require("path");

const host = "127.0.0.1"; 
const port = 4000;

const server = http.createServer((req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept");
  
  if (req.url === "/") {
    sendRes("index.html", "text/html", res);
  } else if (req.url === "/addUser") {
    let userName = '';

    req.on('data', function (data) {
      userName += data;
      console.log('Partial body: ' + userName);
    });

    req.on('end', function () {
      console.log('Body: ' + userName);

      fs.readFile(path.join(__dirname, "static/users", "users.json"), "utf8", (err, data) => {
        if (err) {
          throw err;
        }

        const objectDataFromFile = JSON.parse(data);
        
        const userToAdd = {
          "id": new Date().getTime(),
          "username": userName,
          "score": "0"
        };

        objectDataFromFile.users.push(userToAdd);

        fs.writeFile(path.join(__dirname, "static/users", "users.json"), JSON.stringify(objectDataFromFile), "utf8", (err) => {
          if (err) {
            throw err;
          }
          res.writeHead(200, {
            "Content-Type": "application/json"
          });
          res.end(JSON.stringify(userToAdd));
        });
      });
    });
    
  } else if (req.url === "/saveUserScore") {
    let user = '';
    req.on('data', function (data) {
      user += data;
      console.log('Partial body: ' + user);
    })
    req.on('end', function () {
      console.log('Body: ' + user)

      fs.readFile(path.join(__dirname, "static/users", "users.json"), "utf8", (err, data) => {
        if (err) {
          throw err;
        }

        user = JSON.parse(user);

        const objectDataFromFile = JSON.parse(data);
        let userFromFile = objectDataFromFile.users.find(item => item.id === user.id);
       
        if (!userFromFile) {
          objectDataFromFile.users.push(user);
          userFromFile = objectDataFromFile.users.find(item => item.id === user.id);
          userFromFile.score = `${+user.score}`;
        }

        userFromFile.score = `${Math.max(+userFromFile.score, +user.score)}`;
        objectDataFromFile.users.filter(item => item.id !== userFromFile.id);

        objectDataFromFile.users.sort((a,b) => {
          if (+a.score > +b.score) {
            return -1;
          }
          if (+a.score < +b.score) {
            return +1;
          }
          return 0; 
        });

        if (objectDataFromFile.users.length > 10) {
          objectDataFromFile.users.pop();
        }

        fs.writeFile(path.join(__dirname, "static/users", "users.json"), JSON.stringify(objectDataFromFile), (err) => {
          if (err) {
            throw err;
          }
          res.writeHead(200, {
            "Content-Type": "application/json"
          });
          res.end(JSON.stringify(userFromFile));
        });
      });
    })
  } else if (req.url === "/users") {
      fs.readFile(path.join(__dirname, "static/users", "users.json"), (err, data) => {
        if (err) {
          throw err;
        }
        res.writeHead(200, {
          "Content-Type": "application/json"
        });
        res.end(data);
      });
  } else if (req.url === '/favicon.ico') {
      let fileStream = fs.createReadStream("favicon.ico");
      return fileStream.pipe(res);
  } else {
    sendRes(req.url, getContentType(req.url), res);
  }

});

function sendRes(url, contentType, res) {
    let file = path.join(__dirname, url);
    fs.readFile(file, (err, data) => {
      if (err) {
        throw err;
      }
      res.writeHead(200, {
        "Content-Type": contentType
      });
      res.end(data);
    });
}

function getContentType(url) {
  switch ( path.extname(url) ) {
    case ".html":
      return "text/html";
    case ".css":
      return "text/css";
    case ".js":
      return "text/javascript";
    case ".json":
      return "application/json";
    case ".mp3":
      return "audio/mpeg";
    case ".png":
      return "image/png";
    case ".otf":
      return "font/otf";
    default:
      return "application/octet-stream";
  }
}

server.listen(port, host, () => {
  console.log(`node.js API Server is running on http://${host}:${port}`);
});
