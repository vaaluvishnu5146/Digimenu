// Get all Cart buttons and attach event listeners
document.querySelectorAll("#add-button").forEach((button) => {
  button.addEventListener("click", function () {
    const itemData = button.getAttribute("data-item");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = JSON.parse(itemData);
    if (!checkItemAlreadyInCart(cart, item._id)) {
      addToCart({ ...item, quantity: 1 });
      const total = calculateTotal();
      updateCart(total);
    } else {
      const matchingItem = cart.find((cartItem) => cartItem.id === item._id);
      matchingItem.quantity += 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      const total = calculateTotal();
      updateCart(total);
    }
  });
});

// Get all Cart buttons and attach event listeners
document.querySelectorAll("#remove-button").forEach((button) => {
  button.addEventListener("click", function () {
    const itemData = button.getAttribute("data-item");
    const item = JSON.parse(itemData);
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!checkItemAlreadyInCart(cart, item._id)) {
      return;
    } else {
      const matchingItem = cart.find((cartItem) => cartItem.id === item._id);
      if (matchingItem.quantity <= 1) {
        // Remove from cart
        removeFromCart(item._id);
        const total = calculateTotal();
        updateCart(total);
        return;
      } else {
        matchingItem.quantity -= 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        const total = calculateTotal();
        updateCart(total);
      }
    }
  });
});

// Add event listener to Place Order button
document.getElementById("checkout-button").addEventListener("click", () => {
  if ((JSON.parse(localStorage.getItem("cart")) || []).length === 0) {
    alert("Cart is empty! Please add items to cart before placing an order.");
    return;
  }
  placeOrder();
});

function addToCart(item) {
  // Implementation for adding item to cart
  // Store the cart item in local storage or send to server
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({
    id: item._id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  });
  localStorage.setItem("cart", JSON.stringify(cart));
  console.log("Item added to cart:", item);
}

function removeFromCart(itemId) {
  // Implementation for removing item from cart
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id !== itemId);
  localStorage.setItem("cart", JSON.stringify(cart));
  console.log("Item removed from cart:", itemId);
}

function calculateTotal() {
  // Implementation for calculating total cart value
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
  console.log("Total cart value:", total);
  return total;
}

function updateCart(total) {
  // Implementation for updating cart UI
  const cartTotalElement = document.getElementById("price");
  if (cartTotalElement) {
    cartTotalElement.innerText = `${total}`;
    console.log("Cart UI updated with total:", total);
  } else {
    console.error("Cart total element not found.");
  }
}

function checkItemAlreadyInCart(items = [], itemId = {}) {
  return items?.some((item) => item.id === itemId);
}

function removeFromCart(itemId) {
  // Implementation for removing item from cart
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id !== itemId);
  localStorage.setItem("cart", JSON.stringify(cart));
  console.log("Item removed from cart:", itemId);
}

async function placeOrder() {
  const urlParams = new URLSearchParams(window.location.search);
  const tableNumber = urlParams.get("tableCode");

  const orderData = {
    tableNumber: tableNumber || "1A", // Dynamically fetched from URL
    items: JSON.parse(localStorage.getItem("cart")) || [],
    totalAmount: calculateTotal(),
    status: "pending",
  };

  try {
    const response = await fetch("http://localhost:3000/api/orders/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });
    if (response.ok) {
      const result = await response.json();
      console.log("Order placed successfully:", result);
      // Clear cart after successful order placement
      localStorage.removeItem("cart");
      updateCart(0);
    } else {
      console.error("Failed to place order:", response.statusText);
    }
  } catch (error) {
    console.error("Error placing order:", error);
  }
}
