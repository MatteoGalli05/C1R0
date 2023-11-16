const fs = require("fs");
const http = require("http");

function appContent() {
  let orders = fs.readFileSync("../order.txt") + "";
  orders = orders.split("\n");
  let innerApp = "";
  orders.forEach((element) => {
    element = element.split(";");
    if (element.length > 1) {
      innerApp += "<div class='order'>";
      innerApp += "<div class='tableNumber'>" + element[0] + "</div>";
      element[1] = element[1].split("&");
      element[1].forEach((product) => {
        if (product != "") {
          innerApp += "<div class='tableOrder'>" + product + "</div>";
        }
      });

      innerApp += "</div>";
    }
  });
  return innerApp;
}

http.createServer((req, res) => {
    if (req.url === "/style.css") {
      res.writeHead(200, { "Content-Type": "text/css" });
      res.write(fs.readFileSync("style.css"));
      res.end();
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(
        "<!DOCTYPE html> <html lang='it'><head><meta charset='UTF-8'><link rel='stylesheet' href='style.css'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>Document</title></head><body><div class='app'>" +
          appContent() +
          "</div>"+ "<script> setTimeout(() => window.location.reload(true), 5000); </script>"+"</body></html>"
      );
      res.end();
    }
  })
  .listen(8080);
