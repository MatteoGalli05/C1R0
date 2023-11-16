import "./App.css";
import Product from "./components/product";
import io from "socket.io-client";
import { useEffect } from "react";



//const socket = io.connect("http://" + "192.168.1.5" + ":3001");
const socket = io.connect('http://172.20.10.2:3003');
//const socket = io.connect("http://localhost:3003");


function App() {
  let selectedCategory = 0;
  let isRecived = false;
  let totalAmount = 0;
  const categories = [
    "Primi e Secondi",
    "Bevande",
    "Snack",
    "Alcolici",
    "Dolci",
  ];
  const products = [
    new Product("CocaCola", "Prodotta da CocaCola", 3.0, 1),
    new Product("Fanta", "Prodotta da CocaCola", 3.0, 1),
    new Product("Sprite", "Prodotta da CocaCola", 3.0, 1),
    new Product("Acqua", "Prodotta da San Benedetto", 1.5, 1),
    new Product("Matriciana", "a base di zucchine", 13.0, 0),
    new Product("Pasta al ragù", "presenta lattosio", 3.0, 0),
    new Product("Pasta al pesto", "Non adatta ai celiaci", 3.0, 0),
    new Product("Tiramisù", "Fatto in casa", 1.5, 4),
    new Product("Patatine San Carlo", "Prodotta da CocaCola", 3.0, 2),
    new Product("Coca e Monte ", "Gradazione : 11", 7.0, 3),
    new Product("Spritz", "Gradazione: 11", 5.0, 3),
  ];

  useEffect(() => {
    socket.on("msg_recived", (data) => {
      if (!isRecived) {
        if (data === "true") {
          var orderTextArea = document.getElementById("orderMask");
          orderTextArea.innerHTML = "Il totale è " + totalAmount + "€";
          var modal = document.getElementById("myModal");
          var span = document.getElementsByClassName("close")[0];
          modal.style.display = "block";
          span.onclick = function () {
            modal.style.display = "none";
            resetUI();
          };
        }
      }
    });
  }, [socket]);

  const sendMessage = () => {
    let TableNumber = document.getElementById("inputTable").value;
    if (TableNumber.trim().length > 0) {
      let msg =  "Tavolo: " + TableNumber+ ";";
      let itemOrdered = 0;
      products.forEach((prd) => {
        if (prd.amount > 0) {
          itemOrdered++;
          msg += prd.name + ":" + prd.amount +"&";
        }
      });
      if (itemOrdered > 0) {
        msg += "\n";
        socket.emit("sendData", msg);
        
        
      } else {
        alert("DEVI ORDINARE ALMENO UN PRODOTTO");
      }
    } else {
      alert("DEVI INSERIRE IL NUMERO DEL TAVOLO");
    }
  };

  const productArea = () => {
    return (
      <ul id="prodList">
        {products.map(
          (item, index) => (
            //item.category === selectedCategory ? (
            <li key={index}>
              <div className="product">
                <button
                  className="btnRemove"
                  onClick={() => {
                    const precCount = item.amount;
                    if (item.amount > 0) {
                      item.amount = item.amount - 1;
                    }
                    document.getElementById(index).innerHTML =
                      item.name +
                      " ( " +
                      item.price +
                      "€ ) x " +
                      item.amount +
                      "<br/> <span>" +
                      item.description +
                      "</span>";
                    if (precCount > 0) {
                      totalAmount -= item.price;
                      document.getElementById("totalAmount").innerHTML =
                        totalAmount;
                    }
                  }}
                >
                  -
                </button>
                <div className="lblProduct" id={index}>
                  {item.name} ( {item.price}$ ) x {item.amount} <br />{" "}
                  <span>{item.description}</span>
                </div>
                <button
                  className="btnAdd"
                  onClick={() => {
                    item.amount = item.amount + 1;
                    document.getElementById(index).innerHTML =
                      item.name +
                      " ( " +
                      item.price +
                      "€ ) x " +
                      item.amount +
                      "<br/> <span>" +
                      item.description +
                      "</span>";
                    totalAmount += item.price;
                    document.getElementById("totalAmount").innerHTML =
                      totalAmount;
                  }}
                >
                  +
                </button>
              </div>
            </li>
          )
          //) : (
          //   <> </>
          //)
        )}
      </ul>
    );
  };

  const resetUI = () => {
    totalAmount = 0;
    isRecived = false;
    let i = 0;
    products.forEach((element) => {
      element.amount = 0;
      document.getElementById(i).innerHTML =
        element.name +
        " ( " +
        element.price +
        "€ ) x " +
        element.amount +
        "<br/> <span>" +
        element.description +
        "</span>";
      i++;
    });
    document.getElementById("totalAmount").innerHTML = totalAmount;
  };

  return (
    <div className="App">
      <div className="header">
        <input type="number" id="inputTable" placeholder="Numero Tavolo" />
        <button onClick={sendMessage}>Send message</button>
      </div>
      <div className="main">
        
        <ul id="productArea">{productArea()}</ul>
      </div>
      <div className="footer">
        <span>
          Totale <span id="totalAmount">0.0</span>€
        </span>
      </div>
      <div id="myModal" className="modal">
        <div className="modal-content">
          <span className="close">&times;</span>
          <div className="text-modal">
            <h1>L'ordine è andato a buon fine</h1>
            <h2 id="orderMask">L'ordine è andato a buon fine</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
