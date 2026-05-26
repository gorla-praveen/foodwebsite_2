(function ($) {
    "use strict";

    $(document).ready(function () {

        $(".testimonial-sliders").owlCarousel({
            items: 1,
            loop: true,
            autoplay: true
        });

        $(".homepage-slider").owlCarousel({
            items: 1,
            loop: true,
            autoplay: true,
            nav: true,
            dots: false
        });

        $(".logo-carousel-inner").owlCarousel({
            items: 4,
            loop: true,
            autoplay: true,
            margin: 30
        });

        $(".product-filters li").on("click", function () {
            $(".product-filters li").removeClass("active");
            $(this).addClass("active");

            var selector = $(this).attr("data-filter");
            $(".product-lists").isotope({ filter: selector });
        });

        $(".product-lists").isotope();

        $("#sticker").sticky({ topSpacing: 0 });

        $('.main-menu').meanmenu({
            meanMenuContainer: '.mobile-menu',
            meanScreenWidth: "992"
        });

        $(".search-bar-icon").on("click", function () {
            $(".search-area").addClass("search-active");
        });

        $(".close-btn").on("click", function () {
            $(".search-area").removeClass("search-active");
        });

    });

    $(window).on("load", function () {
        $(".loader").fadeOut(1000);
    });

})(jQuery);


/* =========================
   🛒 CLEAN CART SYSTEM
========================= */

const CART_KEY = "fruitkha_cart";

// GET CART
function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

// SAVE CART
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
}

/* =========================
   ADD TO CART
========================= */

document.addEventListener("click", function (e) {

    const btn = e.target.closest(".add-to-cart");
    if (!btn) return;

    e.preventDefault();

    const productBox = btn.closest(".single-product-item");

    const product = {
        name: productBox.querySelector("h3").innerText,
        price: parseFloat(productBox.querySelector(".product-price").innerText.replace(/[^0-9.]/g, "")),
        img: productBox.querySelector("img").src,
        qty: 1
    };

    let cart = getCart();

    let existing = cart.find(item => item.name === product.name);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push(product);
    }

    saveCart(cart);

    alert(product.name + " added to cart!");
});


/* =========================
   CART BADGE
========================= */

function updateCartBadge() {
    let cart = getCart();
    let count = cart.reduce((sum, item) => sum + item.qty, 0);

    let icon = document.querySelector(".shopping-cart");

    if (icon) {
        let badge = icon.querySelector(".cart-count");

        if (!badge) {
            badge = document.createElement("span");
            badge.className = "cart-count";
            icon.appendChild(badge);
        }

        badge.innerText = count;

        icon.style.position = "relative";
        badge.style.cssText = `
            position:absolute;
            top:-6px;
            right:-10px;
            background:red;
            color:white;
            font-size:12px;
            border-radius:50%;
            padding:2px 6px;
        `;
    }
}


/* =========================
   CART PAGE
========================= */

function renderCart() {

    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("grand-total");

    if (!container) return;

    let cart = getCart();
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = `<tr><td colspan="6">Cart is empty</td></tr>`;
        totalEl.innerText = "0";
        return;
    }

    container.innerHTML = cart.map((item, index) => {

        let itemTotal = item.price * item.qty;
        total += itemTotal;

        return `
        <tr>
            <td><img src="${item.img}" width="60"></td>
            <td>${item.name}</td>
            <td>$${item.price}</td>
            <td>
                <button onclick="changeQty(${index}, -1)">-</button>
                ${item.qty}
                <button onclick="changeQty(${index}, 1)">+</button>
            </td>
            <td>$${itemTotal.toFixed(2)}</td>
            <td><button onclick="removeItem(${index})">X</button></td>
        </tr>
        `;
    }).join("");

    totalEl.innerText = total.toFixed(2);
}


// QTY CHANGE
function changeQty(index, val) {
    let cart = getCart();

    cart[index].qty += val;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart();
}

// REMOVE
function removeItem(index) {
    let cart = getCart();
    cart.splice(index, 1);

    saveCart(cart);
    renderCart();
}


/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", function () {
    updateCartBadge();
    renderCart();
});