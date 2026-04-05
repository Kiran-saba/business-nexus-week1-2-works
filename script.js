
function searchProduct() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let products = document.querySelectorAll(".pro");

    products.forEach(product => {
        let name = product.querySelector("h5").innerText.toLowerCase();

        if (name.includes(input)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}
// ================= ADD TO CART =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.querySelectorAll(".cart").forEach((btn, index) => {
    btn.addEventListener("click", () => {
        let product = btn.closest(".pro");

        let name = product.querySelector("h5").innerText;
        let price = product.querySelector("h4") 
            ? product.querySelector("h4").innerText.replace("&", "")
            : "50"; // default price if missing

        let image = product.querySelector("img").src;

        let item = {
            name,
            price: parseFloat(price),
            image,
            quantity: 1
        };

        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));

        alert("Product Added to Cart ✅");
    });
});
let carts = JSON.parse(localStorage.getItem("cart")) || [];

let cartContainer = document.querySelector(".cart-items");
let totalItems = document.getElementById("total-items");
let totalPrice = document.getElementById("total-price");

function displayCart() {
    cartContainer.innerHTML = "<h3>Your Cart</h3>";

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        cartContainer.innerHTML += `
        <div class="cart-item">
            <img src="${item.image}" alt="">
            <div class="item-details">
                <h5>${item.name}</h5>
                <p>Price: $${item.price}</p>
                <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
            </div>
            <button class="remove" onclick="removeItem(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        `;
    });

    totalItems.innerText = cart.length;
    totalPrice.innerText = total;
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function updateQuantity(index, qty) {
    cart[index].quantity = parseInt(qty);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

displayCart();