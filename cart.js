
let openModalBtn = document.querySelector(".shopping");
let closeModalBtn = document.querySelector(".closeShopping");
let productList = document.querySelector(".list");
let cartItemList = document.querySelector(".listCard");
let body = document.querySelector("body");
let totalElement = document.querySelector(".total");
let quantityElement = document.querySelector(".quantity");
let trashIcon = document.querySelector(".trash-icon");
let main = document.querySelector("main");

openModalBtn.addEventListener("click", () => {
  main.classList.toggle("active");
});

closeModalBtn.addEventListener("click", () => {
  main.classList.toggle("active");
});

fetch("https://dummyjson.com/products")
  .then((res) => res.json())
  .then((fetchedData) => {
    data = fetchedData;
    initApp(data);
  });

let cartItems = [];

function initApp(data) {
  data.products.forEach((product, key) => {
    let productDiv = document.createElement("div");
    productDiv.classList.add("item");
    productDiv.innerHTML = `
            <img src="${product.thumbnail}"/>
            <div class="title">${product.title}</div>
            <div class="price">${product.price}&#8380</div>
            <button class="addToCartBtn">
                <i class="cart_btn_icon fa-solid fa-cart-shopping"></i>Add To Cart
            </button>
        `;

    productDiv.querySelector(".addToCartBtn").addEventListener("click", () => {
      addToCart(key);
    });

    productList.appendChild(productDiv);
  });
}

function addToCart(key) {
  if (cartItems[key] == null) {
    cartItems[key] = {
      ...data.products[key],
      quantity: 1,
      originalPrice: data.products[key].price,
    };
  } else {
    cartItems[key].quantity++;
  }
  updateCart();
  setCartItemsToLocalStorage(cartItems);
}

function updateCart() {
  cartItemList.innerHTML = "";
  let count = 0;
  let totalPrice = 0;

  cartItems.forEach((cartItem, key) => {
    if (cartItem != null) {
      totalPrice += data.products[key].price * cartItem.quantity;
      count += cartItem.quantity;

      let cartItemDiv = document.createElement("li");
      cartItemDiv.innerHTML = `
                <div><img src="${cartItem.thumbnail}"/></div>
                <div>${cartItem.title}</div>
                <div>${(
                  data.products[key].price * cartItem.quantity
                ).toLocaleString()}</div>
                <div>
                    <button onclick="changeQuantity(${key},${
        cartItem.quantity - 1
      })">-</button>
                    <div class="count">${cartItem.quantity}</div>
                    <button onclick="changeQuantity(${key},${
        cartItem.quantity + 1
      })" class="plusBTN">+</button>
                    <div class="trash-icon"><i class="fa-solid fa-trash"></i></div>
                </div>
            `;
      cartItemList.appendChild(cartItemDiv);

      cartItemDiv.querySelector(".trash-icon").addEventListener("click", () => {
        deleteCartItem(key);
      });
    }
  });

  totalElement.innerText = totalPrice.toLocaleString();
  quantityElement.innerText = count;
}

function deleteCartItem(key) {
  delete cartItems[key];
  updateCart();
  setCartItemsToLocalStorage(cartItems);
}

function changeQuantity(key, quantity) {
  if (quantity == 0) {
    delete cartItems[key];
  } else {
    cartItems[key].quantity = quantity;
    cartItems[key].price = quantity * cartItems[key].originalPrice;
  }
  updateCart();
  setCartItemsToLocalStorage(cartItems);
}

function getCartItemsFromLocalStorage() {
  const cartItemsJSON = localStorage.getItem("cartItems");
  return cartItemsJSON ? JSON.parse(cartItemsJSON) : [];
}

function setCartItemsToLocalStorage(cartItems) {
  const cartItemsJSON = JSON.stringify(cartItems);
  localStorage.setItem("cartItems", cartItemsJSON);
}