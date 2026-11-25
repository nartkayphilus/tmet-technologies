/* =====================================================
   TMET TECHNOLOGIES
   MULTI-PAGE ONLINE STORE
   Version 4.0
===================================================== */


/* =====================================================
   1. BUSINESS CONFIGURATION
===================================================== */

const TMET_CONFIG = {
    whatsappNumber: "",
    currency: "GHS",
    country: "GH"
};


/* =====================================================
   2. PRODUCT DATABASE
===================================================== */

// Products will be added here when we prepare the catalogue.

const products = [];


/* =====================================================
   3. START WEBSITE
===================================================== */

document.addEventListener("DOMContentLoaded", function () {


    /* =================================================
       4. GENERAL HELPERS
    ================================================= */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        Array.from(parent.querySelectorAll(selector));


    function formatMoney(amount) {

        return new Intl.NumberFormat("en-GH", {
            style: "currency",
            currency: TMET_CONFIG.currency
        }).format(Number(amount) || 0);

    }


    function escapeHTML(value) {

        return String(value ?? "").replace(
            /[&<>"']/g,
            character => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            })[character]
        );

    }


    function getProduct(productId) {

        return products.find(product =>
            String(product.id) === String(productId)
        );

    }


    function showFeedback(element, message, type = "") {

        if (!element) return;

        element.textContent = message;

        element.classList.remove("success", "error");

        if (type) {
            element.classList.add(type);
        }

    }


    function getCartTotal() {

        return cart.reduce((total, item) => {

            const product = getProduct(item.id);

            return product
                ? total + product.price * item.quantity
                : total;

        }, 0);

    }


    function getCartQuantity() {

        return cart.reduce(
            (total, item) => total + item.quantity,
            0
        );

    }


    /* =================================================
       5. COPYRIGHT YEAR
    ================================================= */

    const currentYear = $("#current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =================================================
       6. MOBILE NAVIGATION
    ================================================= */

    const menuToggle = $("#menu-toggle");
    const navigation = $("#main-navigation");

    if (menuToggle && navigation) {

        function closeNavigation() {

            navigation.classList.remove("active");

            menuToggle.setAttribute("aria-expanded", "false");

            document.body.classList.remove("menu-open");

        }


        menuToggle.addEventListener("click", function () {

            const isOpen = navigation.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            document.body.classList.toggle(
                "menu-open",
                isOpen
            );

        });


        $$("a", navigation).forEach(link => {
            link.addEventListener("click", closeNavigation);
        });


        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {
                closeNavigation();
            }

        });

    }


    /* =================================================
       7. HEADER SCROLL EFFECT
    ================================================= */

    const header = $(".site-header");

    function updateHeader() {

        header?.classList.toggle(
            "scrolled",
            window.scrollY > 40
        );

    }

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });


    /* =================================================
       8. BACK TO TOP
    ================================================= */

    const backToTop = $("#back-to-top");

    function updateBackToTop() {

        backToTop?.classList.toggle(
            "visible",
            window.scrollY > 450
        );

    }

    window.addEventListener("scroll", updateBackToTop, {
        passive: true
    });


    backToTop?.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    /* =================================================
       9. WHATSAPP CONFIGURATION
    ================================================= */

    function isValidWhatsAppNumber() {

        return /^\d{8,15}$/.test(
            TMET_CONFIG.whatsappNumber
        );

    }


    function sendWhatsAppMessage(message) {

        if (!isValidWhatsAppNumber()) {

            alert(
                "The TMET Technologies WhatsApp number has not been configured yet."
            );

            return false;

        }

        const url =
            "https://wa.me/" +
            TMET_CONFIG.whatsappNumber +
            "?text=" +
            encodeURIComponent(message);

        window.location.href = url;

        return true;

    }


    /* =================================================
       10. SEARCH BUTTON
    ================================================= */

    const searchButton = $("#search-focus-button");

    searchButton?.addEventListener("click", function () {

        if (!$("#product-search-input")) {

            window.location.href = "products.html";

            return;

        }

        $("#product-search-input").focus();

    });


    /* =================================================
       11. PRODUCT DATABASE AND CATEGORY FILTERING
    ================================================= */

    const productGrid = $("#product-grid");
    const searchInput = $("#product-search-input");
    const sortSelect = $("#product-sort");
    const resultsCount = $("#product-results-count");

    const filterButtons = $$(".filter-button");

    let activeCategory = "all";
    let searchTerm = "";
    let sortMethod = "default";


    // Read category from the page URL.

    const requestedCategory =
        new URLSearchParams(window.location.search).get("category");

    if (
        requestedCategory &&
        /^[a-z0-9-]+$/i.test(requestedCategory)
    ) {
        activeCategory = requestedCategory.toLowerCase();
    }


    function updateFilterButtons() {

        filterButtons.forEach(button => {

            const category =
                button.dataset.category ||
                button.dataset.filter ||
                "all";

            const active = category === activeCategory;

            button.classList.toggle("active", active);

            button.setAttribute(
                "aria-pressed",
                String(active)
            );

        });

    }


    function renderProducts() {

        if (!productGrid) return;

        let filteredProducts = [...products];


        // Filter by category.

        if (activeCategory !== "all") {

            filteredProducts = filteredProducts.filter(product =>
                product.category === activeCategory
            );

        }


        // Search products.

        if (searchTerm) {

            filteredProducts = filteredProducts.filter(product => {

                const searchableText = [
                    product.name,
                    product.category,
                    product.description
                ].join(" ").toLowerCase();

                return searchableText.includes(searchTerm);

            });

        }


        // Sort products.

        if (sortMethod === "price-low") {

            filteredProducts.sort(
                (a, b) => a.price - b.price
            );

        } else if (sortMethod === "price-high") {

            filteredProducts.sort(
                (a, b) => b.price - a.price
            );

        } else if (sortMethod === "name") {

            filteredProducts.sort(
                (a, b) => a.name.localeCompare(b.name)
            );

        }


        if (resultsCount) {

            resultsCount.textContent =
                filteredProducts.length +
                (filteredProducts.length === 1
                    ? " product found"
                    : " products found");

        }


        // Empty catalogue or no search results.

        if (filteredProducts.length === 0) {

            const noProducts = products.length === 0;

            productGrid.innerHTML = `

                <div class="empty-products">

                    <span class="empty-products-icon">TMET</span>

                    <h3>
                        ${noProducts
                            ? "Our Product Catalogue Is Growing"
                            : "No Products Found"}
                    </h3>

                    <p>
                        ${noProducts
                            ? "New products will appear here as they become available."
                            : "Try another product name or category."}
                    </p>

                    <button
                        type="button"
                        class="button button-primary"
                        id="reset-product-search">

                        View All Products

                    </button>

                </div>

            `;

            $("#reset-product-search")?.addEventListener(
                "click",
                resetProductFilters
            );

            return;

        }


        // Display product cards.

        productGrid.innerHTML = filteredProducts.map(product => {

            const name = escapeHTML(product.name);
            const description = escapeHTML(product.description);
            const category = escapeHTML(product.category);
            const id = escapeHTML(product.id);

            const image = product.image
                ? `
                    <img
                        class="product-image"
                        src="${escapeHTML(product.image)}"
                        alt="${name}"
                        loading="lazy">
                  `
                : `
                    <div class="product-image" role="img" aria-label="${name}">
                        ${name}
                    </div>
                  `;

            return `

                <article class="product-card">

                    ${image}

                    <div class="product-details">

                        <span class="product-category">
                            ${category}
                        </span>

                        <h3 class="product-name">
                            ${name}
                        </h3>

                        <p class="product-description">
                            ${description}
                        </p>

                        <div class="product-price">
                            ${formatMoney(product.price)}
                        </div>

                        <button
                            type="button"
                            class="add-to-cart"
                            data-add-to-cart="${id}">

                            Add to Cart

                        </button>

                    </div>

                </article>

            `;

        }).join("");

    }


    function resetProductFilters() {

        activeCategory = "all";
        searchTerm = "";
        sortMethod = "default";

        if (searchInput) searchInput.value = "";

        if (sortSelect) sortSelect.value = "default";

        updateFilterButtons();

        renderProducts();

    }


    searchInput?.addEventListener("input", function () {

        searchTerm = searchInput.value.trim().toLowerCase();

        renderProducts();

    });


    sortSelect?.addEventListener("change", function () {

        sortMethod = sortSelect.value;

        renderProducts();

    });


    filterButtons.forEach(button => {

        button.addEventListener("click", function () {

            activeCategory =
                button.dataset.category ||
                button.dataset.filter ||
                "all";

            updateFilterButtons();

            renderProducts();

        });

    });


    /* =================================================
       12. CART STORAGE
    ================================================= */

    function loadCart() {

        try {

            const savedCart = localStorage.getItem(
                "tmet-shopping-cart"
            );

            const parsedCart = savedCart
                ? JSON.parse(savedCart)
                : [];

            if (!Array.isArray(parsedCart)) return [];

            return parsedCart.filter(item => {

                return item &&
                    getProduct(item.id) &&
                    Number.isInteger(item.quantity) &&
                    item.quantity > 0;

            });

        } catch (error) {

            console.warn("Could not load saved cart.", error);

            return [];

        }

    }


    let cart = loadCart();


    function saveCart() {

        try {

            localStorage.setItem(
                "tmet-shopping-cart",
                JSON.stringify(cart)
            );

        } catch (error) {

            console.warn("Could not save shopping cart.", error);

        }

    }


    /* =================================================
       13. CART COUNTER
    ================================================= */

    function updateCartCounter() {

        const quantity = getCartQuantity();

        $$("#cart-count").forEach(element => {
            element.textContent = quantity;
        });

    }


    /* =================================================
       14. ADD TO CART
    ================================================= */

    function addToCart(productId) {

        const product = getProduct(productId);

        if (!product) return;

        const existingItem = cart.find(item =>
            String(item.id) === String(productId)
        );

        if (existingItem) {

            existingItem.quantity += 1;

        } else {

            cart.push({
                id: product.id,
                quantity: 1
            });

        }

        saveCart();

        renderCart();

        alert(product.name + " added to your cart.");

    }


    /* =================================================
       15. CHANGE CART QUANTITY
    ================================================= */

    function changeQuantity(productId, amount) {

        const item = cart.find(cartItem =>
            String(cartItem.id) === String(productId)
        );

        if (!item) return;

        item.quantity += amount;

        if (item.quantity <= 0) {

            cart = cart.filter(cartItem =>
                String(cartItem.id) !== String(productId)
            );

        }

        saveCart();

        renderCart();

    }


    /* =================================================
       16. REMOVE FROM CART
    ================================================= */

    function removeFromCart(productId) {

        cart = cart.filter(item =>
            String(item.id) !== String(productId)
        );

        saveCart();

        renderCart();

    }


    /* =================================================
       17. CART ITEM HTML
    ================================================= */

    function createCartItem(item) {

        const product = getProduct(item.id);

        if (!product) return "";

        const id = escapeHTML(product.id);

        return `

            <div class="cart-item">

                <div>

                    <h4>${escapeHTML(product.name)}</h4>

                    <p>${formatMoney(product.price)}</p>

                    <div class="cart-item-controls">

                        <button
                            type="button"
                            data-quantity-minus="${id}"
                            aria-label="Decrease quantity">
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button
                            type="button"
                            data-quantity-plus="${id}"
                            aria-label="Increase quantity">
                            +
                        </button>

                        <button
                            type="button"
                            data-remove-item="${id}">
                            Remove
                        </button>

                    </div>

                </div>

                <strong>
                    ${formatMoney(product.price * item.quantity)}
                </strong>

            </div>

        `;

    }


    /* =================================================
       18. CART BUTTON INTERACTIONS
    ================================================= */

    function connectCartControls(container) {

        if (!container) return;

        $$("[data-quantity-minus]", container).forEach(button => {

            button.addEventListener("click", function () {

                changeQuantity(
                    button.dataset.quantityMinus,
                    -1
                );

            });

        });


        $$("[data-quantity-plus]", container).forEach(button => {

            button.addEventListener("click", function () {

                changeQuantity(
                    button.dataset.quantityPlus,
                    1
                );

            });

        });


        $$("[data-remove-item]", container).forEach(button => {

            button.addEventListener("click", function () {

                removeFromCart(button.dataset.removeItem);

            });

        });

    }


    /* =================================================
       19. SHOPPING CART OVERLAY
    ================================================= */

    const cartOverlay = $("#cart-overlay");
    const cartItemsContainer = $("#cart-items");
    const cartTotal = $("#cart-total");

    const openCartButton = $("#open-cart");
    const closeCartButton = $("#close-cart");
    const checkoutButton = $("#checkout-button");


    function renderOverlayCart() {

        if (cartItemsContainer) {

            cartItemsContainer.innerHTML = cart.length
                ? cart.map(createCartItem).join("")
                : `<p class="cart-empty">Your cart is currently empty.</p>`;

            connectCartControls(cartItemsContainer);

        }

        if (cartTotal) {
            cartTotal.textContent = formatMoney(getCartTotal());
        }

        if (checkoutButton) {
            checkoutButton.disabled = cart.length === 0;
        }

    }


    function openCart() {

        if (!cartOverlay) return;

        cartOverlay.classList.add("active");

        cartOverlay.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

        closeCartButton?.focus();

    }


    function closeCart() {

        if (!cartOverlay) return;

        cartOverlay.classList.remove("active");

        cartOverlay.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";

        openCartButton?.focus();

    }


    openCartButton?.addEventListener("click", openCart);

    closeCartButton?.addEventListener("click", closeCart);


    cartOverlay?.addEventListener("click", function (event) {

        if (event.target === cartOverlay) {
            closeCart();
        }

    });


    document.addEventListener("keydown", function (event) {

        if (
            event.key === "Escape" &&
            cartOverlay?.classList.contains("active")
        ) {
            closeCart();
        }

    });


    /* =================================================
       20. FULL CART PAGE
    ================================================= */

    function renderCartPage() {

        const container = $("#cart-page-items");

        if (!container) return;

        if (cart.length === 0) {

            container.innerHTML = `

                <div class="cart-page-empty">

                    <h3>Your Cart Is Empty</h3>

                    <p>
                        You haven't added any products to your cart yet.
                    </p>

                    <a href="products.html" class="button button-primary">
                        Browse Products
                    </a>

                </div>

            `;

        } else {

            container.innerHTML = cart.map(createCartItem).join("");

            connectCartControls(container);

        }


        const subtotal = getCartTotal();

        const subtotalElement = $("#cart-page-subtotal");
        const deliveryElement = $("#cart-page-delivery");
        const totalElement = $("#cart-page-total");

        if (subtotalElement) {
            subtotalElement.textContent = formatMoney(subtotal);
        }

        if (deliveryElement) {
            deliveryElement.textContent = "To be confirmed";
        }

        if (totalElement) {
            totalElement.textContent = formatMoney(subtotal);
        }

        const pageCheckoutButton = $("#cart-checkout-button");

        if (pageCheckoutButton) {
            pageCheckoutButton.setAttribute(
                "aria-disabled",
                String(cart.length === 0)
            );

            pageCheckoutButton.classList.toggle(
                "disabled",
                cart.length === 0
            );
        }

    }


    /* =================================================
       21. CHECKOUT PAGE SUMMARY
    ================================================= */

    function renderCheckoutSummary() {

        const itemsContainer = $("#checkout-order-items");

        if (!itemsContainer) return;

        if (cart.length === 0) {

            itemsContainer.innerHTML = `
                <p class="cart-empty">
                    Your cart is empty. Please add products before checkout.
                </p>
            `;

        } else {

            itemsContainer.innerHTML = cart.map(item => {

                const product = getProduct(item.id);

                if (!product) return "";

                return `

                    <div class="checkout-summary-row">

                        <span>
                            ${escapeHTML(product.name)}
                            × ${item.quantity}
                        </span>

                        <strong>
                            ${formatMoney(product.price * item.quantity)}
                        </strong>

                    </div>

                `;

            }).join("");

        }


        const subtotal = getCartTotal();

        const subtotalElement = $("#checkout-subtotal");
        const deliveryElement = $("#checkout-delivery-fee");
        const totalElement = $("#checkout-total");

        if (subtotalElement) {
            subtotalElement.textContent = formatMoney(subtotal);
        }

        if (deliveryElement) {
            deliveryElement.textContent = "To be confirmed";
        }

        if (totalElement) {
            totalElement.textContent = formatMoney(subtotal);
        }

    }


    /* =================================================
       22. CHECKOUT FORM
    ================================================= */

    const checkoutForm = $("#checkout-form");

    checkoutForm?.addEventListener("submit", function (event) {

        event.preventDefault();

        alert(
            "Online ordering and payment are not connected yet. Your order has not been placed."
        );

    });


    /* =================================================
       23. CART CHECKOUT BUTTON
    ================================================= */

    checkoutButton?.addEventListener("click", function () {

        if (cart.length === 0) return;

        window.location.href = "checkout.html";

    });


    /* =================================================
       24. CONTACT FORM
    ================================================= */

    const contactForm = $("#contact-form");

    contactForm?.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!contactForm.checkValidity()) {

            contactForm.reportValidity();

            return;

        }

        showFeedback(
            $("#contact-feedback"),
            "Your message form is ready, but message submission has not been connected yet.",
            "error"
        );

    });


    /* =================================================
       25. ACCOUNT FORMS
    ================================================= */

    const loginForm = $("#login-form");
    const registerForm = $("#register-form");


    loginForm?.addEventListener("submit", function (event) {

        event.preventDefault();

        alert(
            "Customer sign-in is not available yet. Secure account services will be connected later."
        );

    });


    registerForm?.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!registerForm.checkValidity()) {

            registerForm.reportValidity();

            return;

        }

        alert(
            "Customer registration is not available yet. Secure account services will be connected later."
        );

    });


    /* =================================================
       26. NEWSLETTER FORM
    ================================================= */

    const newsletterForm = $("#newsletter-form");

    newsletterForm?.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!newsletterForm.checkValidity()) {

            newsletterForm.reportValidity();

            return;

        }

        showFeedback(
            $("#newsletter-feedback"),
            "Newsletter subscriptions are not connected yet.",
            "error"
        );

    });


    /* =================================================
       27. FAQ INTERACTION
    ================================================= */

    const faqItems = $$(".faq-item");

    faqItems.forEach(item => {

        item.addEventListener("toggle", function () {

            if (!item.open) return;

            faqItems.forEach(otherItem => {

                if (otherItem !== item) {
                    otherItem.open = false;
                }

            });

        });

    });


    /* =================================================
       28. SCROLL REVEAL ANIMATIONS
    ================================================= */

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!reducedMotion && "IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("is-visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -30px 0px"
            }
        );


        $$(`
            main section,
            .category-card,
            .product-card,
            .info-card,
            .delivery-card,
            .faq-item
        `).forEach(element => {

            element.classList.add("tmet-reveal");

            revealObserver.observe(element);

        });

    }


    /* =================================================
       29. BOTTOM NAVIGATION
    ================================================= */

    // Each page already marks its active navigation item
    // in its HTML. Do not override that selection here.


    /* =================================================
       30. INITIALIZE WEBSITE
    ================================================= */

    updateFilterButtons();

    renderProducts();

    updateCartCounter();

    renderOverlayCart();

    renderCartPage();

    renderCheckoutSummary();

    updateHeader();

    updateBackToTop();


    // Support category links that use URL query parameters.

    $$(".category-card a, [data-category-link]").forEach(button => {

        button.addEventListener("click", function () {

            const category =
                button.dataset.categoryLink ||
                button.dataset.category;

            if (category) {
                sessionStorage.setItem(
                    "tmet-selected-category",
                    category
                );
            }

        });

    });


    console.log(
        "TMET Technologies Version 4.0 initialized."
    );

});
