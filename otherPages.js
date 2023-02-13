"use strict";
const statePrices = [
 
  {
    state: "Federal Capital Territory, Abuja",
    deliveryFee: 1000,
  },
 
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartDOM = document.querySelector(".cart");
const addToCartButtonsDOM = document.querySelectorAll(
  '[data-action="ADD_TO_CART"]'
);

if (cart.length > 0) {
  cart.forEach((cartItem) => {
    const product = cartItem;
    insertItemToDOM(product);
    countCartTotal();

    addToCartButtonsDOM.forEach((addToCartButtonDOM) => {
      const productDOM = addToCartButtonDOM.parentNode;

      if (
        productDOM.querySelector(".product__name").innerText === product.name
      ) {
        handleActionButtons(addToCartButtonDOM, product);
      }
    });
  });
}

addToCartButtonsDOM.forEach((addToCartButtonDOM) => {
  addToCartButtonDOM.addEventListener("click", () => {
    const productDOM = addToCartButtonDOM.parentNode;
    const product = {
      image: productDOM.querySelector(".product__image").getAttribute("src"),
      name: productDOM.querySelector(".product__name").innerText,
      price: productDOM.querySelector(".product__price").innerText,
      quantity: 1,
    };

    const isInCart =
      cart.filter((cartItem) => cartItem.name === product.name).length > 0;

    if (!isInCart) {
      insertItemToDOM(product);
      cart.push(product);
      saveCart();
      handleActionButtons(addToCartButtonDOM, product);
    }
  });
});

function insertItemToDOM(product) {
  cartDOM.insertAdjacentHTML(
    "beforeend",
    `
    <div class="cart__item shadow">
      <img class="cart__item__image" src="${product.image}" alt="${product.name}">
      <h3 class="cart__item__name">${product.name}</h3>
      <h3 class="cart__item__price">${product.price}</h3>
      <h3 class="cart__item__quantity">${product.quantity}</h3>
   

      
    </div>
  `
  );

  addCartFooter();
}

function handleActionButtons(addToCartButtonDOM, product) {
  addToCartButtonDOM.innerText = "In Cart";
  addToCartButtonDOM.disabled = true;

  const cartItemsDOM = cartDOM.querySelectorAll(".cart__item");
  cartItemsDOM.forEach((cartItemDOM) => {
    if (
      cartItemDOM.querySelector(".cart__item__name").innerText === product.name
    ) {
      cartItemDOM
        .querySelector('[data-action="INCREASE_ITEM"]')
        .addEventListener("click", () => increaseItem(product, cartItemDOM));
      cartItemDOM
        .querySelector('[data-action="DECREASE_ITEM"]')
        .addEventListener("click", () =>
          decreaseItem(product, cartItemDOM, addToCartButtonDOM)
        );
      cartItemDOM
        .querySelector('[data-action="REMOVE_ITEM"]')
        .addEventListener("click", () =>
          removeItem(product, cartItemDOM, addToCartButtonDOM)
        );
    }
  });
}

function increaseItem(product, cartItemDOM) {
  cart.forEach((cartItem) => {
    if (cartItem.name === product.name) {
      cartItemDOM.querySelector(".cart__item__quantity").innerText =
        ++cartItem.quantity;
      cartItemDOM
        .querySelector('[data-action="DECREASE_ITEM"]')
        .classList.remove("btn--danger");
      saveCart();
    }
  });
}

function decreaseItem(product, cartItemDOM, addToCartButtonDOM) {
  cart.forEach((cartItem) => {
    if (cartItem.name === product.name) {
      if (cartItem.quantity > 1) {
        cartItemDOM.querySelector(".cart__item__quantity").innerText =
          --cartItem.quantity;
        saveCart();
      } else {
        removeItem(product, cartItemDOM, addToCartButtonDOM);
      }

      if (cartItem.quantity === 1) {
        cartItemDOM
          .querySelector('[data-action="DECREASE_ITEM"]')
          .classList.add("btn--danger");
      }
    }
  });
}

function removeItem(product, cartItemDOM, addToCartButtonDOM) {
  cartItemDOM.classList.add("cart__item--removed");
  setTimeout(() => cartItemDOM.remove(), 250);
  cart = cart.filter((cartItem) => cartItem.name !== product.name);
  saveCart();
  addToCartButtonDOM.innerText = "Add To Cart";
  addToCartButtonDOM.disabled = false;

  if (cart.length < 1) {
    document.querySelector(".cart-footer").remove();
  }
}

function addCartFooter() {
  if (document.querySelector(".cart-footer") === null) {
    cartDOM.insertAdjacentHTML(
      "afterend",
      `
      <div class="cart-footer">
        <button class="btn  btn-dark shadow" data-action="CLEAR_CART">Clear Cart</button>
        <button class="btn  btn-dark shadow" data-action="CHECKOUT">Pay</button>
      </div>
    `
    );

    document
      .querySelector('[data-action="CLEAR_CART"]')
      .addEventListener("click", () => clearCart());
    document
      .querySelector('[data-action="CHECKOUT"]')
      .addEventListener("click", () => checkout());
  }
}

function clearCart() {
  cartDOM.querySelectorAll(".cart__item").forEach((cartItemDOM) => {
    cartItemDOM.classList.add("cart__item--removed");
    setTimeout(() => cartItemDOM.remove(), 250);
  });

  cart = [];
  localStorage.removeItem("cart");
  document.querySelector(".cart-footer").remove();

  addToCartButtonsDOM.forEach((addToCartButtonDOM) => {
    addToCartButtonDOM.innerText = "Add To Cart";
    addToCartButtonDOM.disabled = false;
  });
}

let phoneNo = "";
let address = "";
let NAME = "";
let email = "";

function handleChange(e, type) {
  switch (type) {
    case "phoneNo":
      phoneNo = e;
      console.log("PHONE CHNAGED ", phoneNo);
      break;

    case "address":
      address = e;
      console.log("ADDRESS CHNAGED ", address);
      break;

    case "NAME":
      NAME = e;
      console.log("NAME CHNAGED ", NAME);
      break;

    case "email":
      email = e;
      console.log("EMAIL CHNAGED ", email);
      break;
    default:
      e;
  }
}

function countCartTotal(additionalFee = 0, changeDeliveryFee = false) {
  
  if (changeDeliveryFee) {
    let Delivery = additionalFee;
    let cartTotal = 0;
    let subtotal = 0;
    cart.forEach(
      (cartItem) => (cartTotal += cartItem.quantity * cartItem.price)
    );
    for (let i = 0; i < statePrices.length; i++) {
      if (statePrices[i].state === additionalFee) {
        additionalFee = statePrices[i].deliveryFee;
        break;
      }
    }
   

    document.getElementById("sub").innerText = `subtotal: ₦${cartTotal} `
  
    document.getElementById("del").innerText =` Delivery Fee: ₦${additionalFee} `
  
    document.getElementById("tot").innerText = `Total: ₦${cartTotal + additionalFee}`;
    return;
  } else {
    let Delivery = 0;
    let cartTotal = 0;
    let subtotal = 0;

    cart.forEach((cartItem) => (Delivery += cartItem.quantity * subtotal));

    document.getElementById("sub").innerText = `subtotal: ₦${cartTotal} `;
    cart.forEach(
      (cartItem) => (cartTotal += cartItem.quantity * cartItem.price)
    );
    document.querySelector(
      '[data-action="CHECKOUT"]'
    ).innerText = `Place Order`;

    document.getElementById("sub").innerText = `subtotal: ₦${cartTotal} `
    
    document.getElementById("del").innerText = `Delivery Fee: ₦${Delivery} `
    
    document.getElementById("tot").innerText =` Total: ₦${cartTotal + Delivery}`;

    const returnObject = {
      Delivery,
      cartTotal,
      subtotal,
      total: cartTotal + Delivery,
    };

    return returnObject;
  }
}

function checkout() {
  console.log("check out", countCartTotal());

  console.log("GOTTEN: ");

  let selectedState = document.getElementById("stateSelect");
  let additionalDeliveryFee = 0;
  for (let i = 0; i < statePrices.length; i++) {
    if (statePrices[i].state === selectedState.value) {
      console.log("GOTTEN: ", statePrices[i].state, statePrices[i].deliveryFee);
      additionalDeliveryFee = statePrices[i].deliveryFee;
      break;
    }
  }
  const data = countCartTotal(additionalDeliveryFee);
  const delivery = data.Delivery + additionalDeliveryFee;
  console.log(data.Delivery, additionalDeliveryFee, "I DEY CHECK");
  const cartTotal = data.cartTotal;
  const subtotal = data.subtotal;
  const total = data.total + delivery;
  if (phoneNo === "" || address === "" || NAME === "" || email === "") {
    alert("PLEASE FILL THE FORMS");
    return;
  }
  let ykformHTML = `
    <form id="ykform" action="https://formcarry.com/s/ciFdK-rIp01" method="POST">
      <input type="hidden" name="cmd" value="_cart">
      <input type="hidden" name="upload" value="1">
      <input type="hidden" name="business" value="YK Watches">
      <input type="hidden" placeholder="Phone Number" name="Phone-Number"  value="${phoneNo}">
      <input type="hidden" placeholder="Delivery address"  name="Delivery-address"  value="${address}">
      <input type="hidden" placeholder="State"  name="Delivery-address"  value=" ${selectedState.value}">
      <input type="hidden" placeholder="FULL NAME"  name="FULL-NAME"  value="${NAME}">
      <input type="hidden" placeholder="Sub-total"   name="Sub-total" value="${cartTotal}">
      <input type="hidden" placeholder="Delivery fee"   name="Delivery fee" value="${delivery}">
      <input type="hidden" placeholder="total"   name="total" value="${total}">
     
      
  `;

  cart.forEach((cartItem, index) => {
    ++index;
    ykformHTML += `
      <input type="hidden" name="item_name_${index}" value="${cartItem.name}">
      <input type="hidden" name="amount_${index}" value="${cartItem.price}">
      <input type="hidden" name="quantity_${index}" value="${cartItem.quantity}">
    `;
  });

  ykformHTML += `
      <input type="submit" value="Submit">
    </form>
    <div class="overlay"></div>
  `;

  document
    .querySelector("body")
    .insertAdjacentHTML("beforeend", ykformHTML);
  document.getElementById("ykform").submit();

  



  cartDOM.querySelectorAll(".cart__item").forEach((cartItemDOM) => {
    cartItemDOM.classList.add("cart__item--removed");
    setTimeout(() => cartItemDOM.remove(), 250);
  });

  cart = [];
  localStorage.removeItem("cart");
  document.querySelector(".cart-footer").remove();

  addToCartButtonsDOM.forEach((addToCartButtonDOM) => {
    addToCartButtonDOM.innerText = "Add To Cart";
    addToCartButtonDOM.disabled = false;
  });
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  countCartTotal();
}
