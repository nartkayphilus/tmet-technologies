/* =====================================================
   TMET TECHNOLOGIES
   ADVANCED ONLINE STORE JAVASCRIPT
   Version 3.0
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

const products = [];


/* =====================================================
   3. START WEBSITE
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =================================================
       4. GLOBAL ELEMENTS
    ================================================= */

    const menuToggle = document.querySelector("#menu-toggle");
    const navigation = document.querySelector("#main-navigation");

    const searchInput = document.querySelector("#product-search-input");
    const searchButton = document.querySelector("#search-focus-button");
    const sortSelect = document.querySelector("#product-sort");
    const productGrid = document.querySelector("#product-grid");

    const filterButtons = document.querySelectorAll(".filter-button");
    const categoryButtons = document.querySelectorAll("[data-category-link]");

    const cartOverlay = document.querySelector("#cart-overlay");
    const cartPanel = document.querySelector("#cart-panel");
    const openCartButton = document.querySelector("#open-cart");
    const closeCartButton = document.querySelector("#close-cart");
    const cartItemsContainer = document.querySelector("#cart-items");
    const cartCount = document.querySelector("#cart-count");
    const cartTotal = document.querySelector("#cart-total");
    const checkoutButton = document.querySelector("#checkout-button");

    const contactForm = document.querySelector("#contact-form");
    const newsletterForm = document.querySelector("#newsletter-form");

    const backToTop = document.querySelector("#back-to-top");
    const currentYear = document.querySelector("#current-year");

    const header = document.querySelector(".site-header");


    /* =================================================
       5. APPLICATION STATE
    ================================================= */

    let activeCategory = "all";
    let searchTerm = "";
    let sortMethod = "default";

    let cart = loadCart();


    /* =================================================
       6. GENERAL HELPER FUNCTIONS
    ================================================= */

    function formatMoney(amount) {

        return new Intl.NumberFormat("en-GH", {
            style: "currency",
            currency: TMET_CONFIG.currency
        }).format(amount);

    }


    function escapeHTML(value) {

        return String(value).replace(
            /[&<>"']/g,
            function (character) {

                const entities = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;"
                };

                return entities[character];

            }
        );

    }


    function getProduct(productId) {

        return products.find(function (product) {
            return String(product.id) === String(productId);
        });

    }


    function showFeedback(element, message, type) {

        if (!element) return;

        element.textContent = message;

        element.classList.remove("success", "error");

        if (type) {
            element.classList.add(type);
        }

    }


    function isValidWhatsAppNumber() {

        return /^\d{8,15}$/.test(
            TMET_CONFIG.whatsappNumber
        );

    }


    function sendWhatsAppMessage(message) {

        if (!isValidWhatsAppNumber()) {

            alert(
                "The WhatsApp business number has not been configured yet."
            );

            return false;

        }

        const whatsappURL =
            "https://wa.me/" +
            TMET_CONFIG.whatsappNumber +
            "?text=" +
            encodeURIComponent(message);

        window.location.href = whatsappURL;

        return true;

    }


    /* =================================================
       7. COPYRIGHT YEAR
    ================================================= */

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }


    /* =================================================
       8. MOBILE NAVIGATION
    ================================================= */

    if (menuToggle && navigation) {

        function closeNavigation() {

            navigation.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

            document.body.classList.remove("menu-open");

        }


        function toggleNavigation() {

            const isOpen =
                navigation.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );

            document.body.classList.toggle(
                "menu-open",
                isOpen
            );

        }


        menuToggle.addEventListener(
            "click",
            toggleNavigation
        );


        navigation.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", closeNavigation);

        });


        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {
                closeNavigation();
            }

        });

    }


    /* =================================================
       9. HEADER SCROLL EFFECT
    ================================================= */

    function updateHeader() {

        if (!header) return;

        header.classList.toggle(
            "scrolled",
            window.scrollY > 40
        );

    }


    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );


    /* =================================================
       10. BACK TO TOP BUTTON
    ================================================= */

    function updateBackToTop() {

        if (!backToTop) return;

        backToTop.classList.toggle(
            "visible",
            window.scrollY > 450
        );

    }


    window.addEventListener(
        "scroll",
        updateBackToTop,
        { passive: true }
    );


    backToTop?.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    /* =================================================
       11. SEARCH BUTTON
    ================================================= */

    if (searchButton && searchInput) {

        searchButton.addEventListener("click", function () {

            document.querySelector("#products")?.scrollIntoView({
                behavior: "smooth"
            });

            setTimeout(function () {
                searchInput.focus();
            }, 500);

        });

    }


    /* =================================================
       12. SCROLL-REVEAL ANIMATIONS
    ================================================= */

    // These styles are added automatically.
    // You do not need to add them separately to style.css.

    const revealStyles = document.createElement("style");

    revealStyles.textContent = `

        .tmet-reveal {
            opacity: 0;
            transform: translateY(45px);
            transition:
                opacity 0.8s ease,
                transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
            will-change: opacity, transform;
        }

        .tmet-reveal-left {
            opacity: 0;
            transform: translateX(-45px);
            transition:
                opacity 0.8s ease,
                transform 0.8s ease;
        }

        .tmet-reveal-right {
            opacity: 0;
            transform: translateX(45px);
            transition:
                opacity 0.8s ease,
                transform 0.8s ease;
        }

        .tmet-reveal-scale {
            opacity: 0;
            transform: scale(0.94);
            transition:
                opacity 0.8s ease,
                transform 0.8s ease;
        }

        .tmet-reveal.is-visible,
        .tmet-reveal-left.is-visible,
        .tmet-reveal-right.is-visible,
        .tmet-reveal-scale.is-visible {
            opacity: 1;
            transform: translate(0, 0) scale(1);
        }

        .product-card {
            transition:
                transform 0.35s ease,
                box-shadow 0.35s ease;
        }

        .product-card:hover {
            transform: translateY(-7px);
        }

        @media (prefers-reduced-motion: reduce) {
            .tmet-reveal,
            .tmet-reveal-left,
            .tmet-reveal-right,
            .tmet-reveal-scale {
                opacity: 1;
                transform: none;
                transition: none;
            }

            .product-card {
                transition: none;
            }
        }

    `;

    document.head.appendChild(revealStyles);


    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    let revealObserver = null;


    function observeRevealElements(elements) {

        if (!elements || reducedMotion) {

            elements?.forEach(function (element) {
                element.classList.add("is-visible");
            });

            return;

        }

        if (!("IntersectionObserver" in window)) {

            elements.forEach(function (element) {
                element.classList.add("is-visible");
            });

            return;

        }

        if (!revealObserver) {

            revealObserver = new IntersectionObserver(
                function (entries, observer) {

                    entries.forEach(function (entry) {

                        if (entry.isIntersecting) {

                            entry.target.classList.add("is-visible");

                            observer.unobserve(entry.target);

                        }

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -35px 0px"
                }
            );

        }


        elements.forEach(function (element) {

            if (element.dataset.revealReady === "true") {
                return;
            }

            element.dataset.revealReady = "true";

            revealObserver.observe(element);

        });

    }


    function initializeScrollAnimations() {

        const sections = document.querySelectorAll(
            "main section, .about-content, .contact-content, .service-card, .highlight-card, .category-card, .faq-item"
        );

        sections.forEach(function (element, index) {

            if (
                element.classList.contains("tmet-reveal") ||
                element.classList.contains("tmet-reveal-left") ||
                element.classList.contains("tmet-reveal-right")
            ) {
                return;
            }

            if (index % 3 === 1) {
                element.classList.add("tmet-reveal-left");
            }

            else if (index % 3 === 2) {
                element.classList.add("tmet-reveal-right");
            }

            else {
                element.classList.add("tmet-reveal");
            }

        });


        observeRevealElements(
            document.querySelectorAll(
                ".tmet-reveal, .tmet-reveal-left, .tmet-reveal-right, .tmet-reveal-scale"
            )
        );

    }


    initializeScrollAnimations();


    /* =================================================
       13. PRODUCT CATALOGUE
    ================================================= */

    function renderProducts() {

        if (!productGrid) return;

        let filteredProducts = [...products];


        // Category filtering

        if (activeCategory !== "all") {

            filteredProducts = filteredProducts.filter(
                function (product) {
                    return product.category === activeCategory;
                }
            );

        }


        // Product searching

        if (searchTerm) {

            filteredProducts = filteredProducts.filter(
                function (product) {

                    const searchableText = [
                        product.name,
                        product.category,
                        product.description
                    ].join(" ").toLowerCase();

                    return searchableText.includes(searchTerm);

                }
            );

        }


        // Product sorting

        if (sortMethod === "price-low") {

            filteredProducts.sort(
                (a, b) => a.price - b.price
            );

        }

        else if (sortMethod === "price-high") {

            filteredProducts.sort(
                (a, b) => b.price - a.price
            );

        }

        else if (sortMethod === "name") {

            filteredProducts.sort(
                (a, b) => a.name.localeCompare(b.name)
            );

        }


        // Empty search results

        if (filteredProducts.length === 0) {

            const noProducts = products.length === 0;

            productGrid.innerHTML = `

                <div class="empty-products">

                    <span class="empty-products-icon">
                        TMET
                    </span>

                    <h3>
                        ${
                            noProducts
                                ? "Our Product Catalogue Is Growing"
                                : "No Products Found"
                        }
                    </h3>

                    <p>
                        ${
                            noProducts
                                ? "New products will appear here as they become available."
                                : "No products match your search. Try another name or category."
                        }
                    </p>

                    <button
                        type="button"
                        class="button button-primary"
                        id="reset-product-search">

                        View All Products

                    </button>

                </div>

            `;


            document.querySelector("#reset-product-search")
                ?.addEventListener("click", function () {

                    activeCategory = "all";
                    searchTerm = "";
                    sortMethod = "default";

                    if (searchInput) searchInput.value = "";
                    if (sortSelect) sortSelect.value = "default";

                    updateFilterButtons();
                    renderProducts();

                });

            return;

        }


        // Product cards

        productGrid.innerHTML = filteredProducts.map(
            function (product) {

                const safeName = escapeHTML(product.name);
                const safeDescription = escapeHTML(product.description);
                const safeCategory = escapeHTML(product.category);

                const imageMarkup = product.image
                    ? `
                        <img
                            class="product-image"
                            src="${escapeHTML(product.image)}"
                            alt="${safeName}"
                            loading="lazy">
                      `
                    : `
                        <div
                            class="product-image"
                            role="img"
                            aria-label="${safeName}">
                            ${safeName}
                        </div>
                      `;


                return `

                    <article class="product-card tmet-reveal">

                        ${imageMarkup}

                        <div class="product-details">

                            <span class="product-category">
                                ${safeCategory}
                            </span>

                            <h3 class="product-name">
                                ${safeName}
                            </h3>

                            <p class="product-description">
                                ${safeDescription}
                            </p>

                            <div class="product-price">
                                ${formatMoney(product.price)}
                            </div>

                            <button
                                type="button"
                                class="add-to-cart"
                                data-add-to-cart="${escapeHTML(product.id)}">

                                Add to Cart

                            </button>

                        </div>

                    </article>

                `;

            }
        ).join("");


        // Animate new product cards

        observeRevealElements(
            productGrid.querySelectorAll(".product-card")
        );


        // Add-to-cart buttons

        productGrid.querySelectorAll("[data-add-to-cart]")
            .forEach(function (button) {

                button.addEventListener("click", function () {

                    addToCart(button.dataset.addToCart);

                });

            });

    }


    /* =================================================
       14. PRODUCT SEARCH
    ================================================= */

    searchInput?.addEventListener("input", function () {

        searchTerm = searchInput.value.trim().toLowerCase();

        renderProducts();

    });


    /* =================================================
       15. PRODUCT SORTING
    ================================================= */

    sortSelect?.addEventListener("change", function () {

        sortMethod = sortSelect.value;

        renderProducts();

    });


    /* =================================================
       16. CATEGORY FILTERING
    ================================================= */

    function updateFilterButtons() {

        filterButtons.forEach(function (button) {

            button.classList.toggle(
                "active",
                button.dataset.filter === activeCategory
            );

        });

    }


    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            activeCategory = button.dataset.filter;

            updateFilterButtons();

            renderProducts();

        });

    });


    categoryButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            activeCategory = button.dataset.categoryLink;

            updateFilterButtons();

            renderProducts();

            document.querySelector("#products")?.scrollIntoView({
                behavior: "smooth"
            });

        });

    });


    /* =================================================
       17. CART STORAGE
    ================================================= */

    function loadCart() {

        try {

            const savedCart = localStorage.getItem(
                "tmet-shopping-cart"
            );

            const parsedCart = savedCart
                ? JSON.parse(savedCart)
                : [];

            if (!Array.isArray(parsedCart)) {
                return [];
            }

            return parsedCart.filter(function (item) {

                return item &&
                    products.some(function (product) {
                        return String(product.id) === String(item.id);
                    }) &&
                    Number.isInteger(item.quantity) &&
                    item.quantity > 0;

            });

        }

        catch (error) {

            console.warn("Unable to load saved cart.", error);

            return [];

        }

    }


    function saveCart() {

        try {

            localStorage.setItem(
                "tmet-shopping-cart",
                JSON.stringify(cart)
            );

        }

        catch (error) {

            console.warn("Unable to save shopping cart.", error);

        }

    }


    /* =================================================
       18. ADD PRODUCTS TO CART
    ================================================= */

    function addToCart(productId) {

        const product = getProduct(productId);

        if (!product) return;

        const existingItem = cart.find(function (item) {

            return String(item.id) === String(productId);

        });


        if (existingItem) {
            existingItem.quantity += 1;
        }

        else {
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
       19. CHANGE CART QUANTITIES
    ================================================= */

    function changeQuantity(productId, amount) {

        const item = cart.find(function (cartItem) {

            return String(cartItem.id) === String(productId);

        });

        if (!item) return;

        item.quantity += amount;

        if (item.quantity <= 0) {

            cart = cart.filter(function (cartItem) {
                return String(cartItem.id) !== String(productId);
            });

        }

        saveCart();

        renderCart();

    }


    /* =================================================
       20. REMOVE CART PRODUCTS
    ================================================= */

    function removeFromCart(productId) {

        cart = cart.filter(function (item) {

            return String(item.id) !== String(productId);

        });

        saveCart();

        renderCart();

    }


    /* =================================================
       21. RENDER SHOPPING CART
    ================================================= */

    function renderCart() {

        if (!cartItemsContainer) return;

        let totalQuantity = 0;
        let totalPrice = 0;


        cart.forEach(function (item) {

            const product = getProduct(item.id);

            if (!product) return;

            totalQuantity += item.quantity;
            totalPrice += product.price * item.quantity;

        });


        if (cartCount) {
            cartCount.textContent = totalQuantity;
        }

        if (cartTotal) {
            cartTotal.textContent = formatMoney(totalPrice);
        }

        if (checkoutButton) {
            checkoutButton.disabled = cart.length === 0;
        }


        if (cart.length === 0) {

            cartItemsContainer.innerHTML = `
                <p class="cart-empty">
                    Your cart is currently empty.
                </p>
            `;

            return;

        }


        cartItemsContainer.innerHTML = cart.map(function (item) {

            const product = getProduct(item.id);

            if (!product) return "";

            return `

                <div class="cart-item">

                    <div>

                        <h4>
                            ${escapeHTML(product.name)}
                        </h4>

                        <p>
                            ${formatMoney(product.price)}
                        </p>

                        <div class="cart-item-controls">

                            <button
                                type="button"
                                data-quantity-minus="${escapeHTML(product.id)}"
                                aria-label="Decrease quantity">
                                −
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                type="button"
                                data-quantity-plus="${escapeHTML(product.id)}"
                                aria-label="Increase quantity">
                                +
                            </button>

                            <button
                                type="button"
                                data-remove-item="${escapeHTML(product.id)}"
                                aria-label="Remove product">
                                Remove
                            </button>

                        </div>

                    </div>

                    <strong>
                        ${formatMoney(product.price * item.quantity)}
                    </strong>

                </div>

            `;

        }).join("");


        cartItemsContainer.querySelectorAll("[data-quantity-minus]")
            .forEach(function (button) {

                button.addEventListener("click", function () {

                    changeQuantity(
                        button.dataset.quantityMinus,
                        -1
                    );

                });

            });


        cartItemsContainer.querySelectorAll("[data-quantity-plus]")
            .forEach(function (button) {

                button.addEventListener("click", function () {

                    changeQuantity(
                        button.dataset.quantityPlus,
                        1
                    );

                });

            });


        cartItemsContainer.querySelectorAll("[data-remove-item]")
            .forEach(function (button) {

                button.addEventListener("click", function () {

                    removeFromCart(button.dataset.removeItem);

                });

            });

    }


    /* =================================================
       22. OPEN AND CLOSE SHOPPING CART
    ================================================= */

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
       23. WHATSAPP CHECKOUT
    ================================================= */

    function checkout() {

        if (cart.length === 0) {

            alert("Your shopping cart is empty.");

            return;

        }


        if (!isValidWhatsAppNumber()) {

            alert(
                "The store's WhatsApp number has not been configured yet."
            );

            return;

        }


        let orderTotal = 0;

        let message =
            "Hello TMET Technologies! I would like to place an order.\n\n";

        message += "MY ORDER:\n";


        cart.forEach(function (item, index) {

            const product = getProduct(item.id);

            if (!product) return;

            const subtotal = product.price * item.quantity;

            orderTotal += subtotal;

            message +=
                (index + 1) + ". " +
                product.name + "\n";

            message +=
                "Quantity: " + item.quantity + "\n";

            message +=
                "Unit Price: " + formatMoney(product.price) + "\n";

            message +=
                "Subtotal: " + formatMoney(subtotal) + "\n\n";

        });


        message +=
            "ESTIMATED TOTAL: " + formatMoney(orderTotal) + "\n\n";

        message +=
            "Please confirm product availability, final pricing and delivery arrangements.\n\n";

        message +=
            "Thank you. I look forward to your response.";


        sendWhatsAppMessage(message);

    }


    checkoutButton?.addEventListener("click", checkout);


    /* =================================================
       24. CONTACT FORM
    ================================================= */

    if (contactForm) {

        contactForm.addEventListener("submit", function (event) {

            event.preventDefault();

            if (!contactForm.checkValidity()) {

                contactForm.reportValidity();

                return;

            }


            const name = document.querySelector("#customer-name")?.value.trim();
            const email = document.querySelector("#customer-email")?.value.trim();
            const enquiry = document.querySelector("#enquiry-type")?.value;
            const message = document.querySelector("#customer-message")?.value.trim();


            if (!name || !email || !enquiry || !message) {

                alert("Please complete all the required fields.");

                return;

            }


            const whatsappMessage =

                "Hello TMET Technologies!\n\n" +
                "BUSINESS ENQUIRY\n\n" +
                "Name: " + name + "\n" +
                "Email: " + email + "\n" +
                "Enquiry: " + enquiry + "\n\n" +
                "Message:\n" + message;


            if (sendWhatsAppMessage(whatsappMessage)) {

                showFeedback(
                    document.querySelector("#contact-feedback"),
                    "Your enquiry is ready to send through WhatsApp.",
                    "success"
                );

            }

        });

    }


    /* =================================================
       25. NEWSLETTER FORM
    ================================================= */

    if (newsletterForm) {

        newsletterForm.addEventListener("submit", function (event) {

            event.preventDefault();

            if (!newsletterForm.checkValidity()) {

                newsletterForm.reportValidity();

                return;

            }

            showFeedback(
                document.querySelector("#newsletter-feedback"),
                "Newsletter subscriptions are not connected yet. Please check back soon.",
                "error"
            );

        });

    }


    /* =================================================
       26. FAQ INTERACTION
    ================================================= */

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(function (item) {

        item.addEventListener("toggle", function () {

            if (!item.open) return;

            faqItems.forEach(function (otherItem) {

                if (otherItem !== item) {
                    otherItem.open = false;
                }

            });

        });

    });


    /* =================================================
       27. BOTTOM NAVIGATION
    ================================================= */

    const bottomNavigation = document.querySelector(
        ".bottom-navigation"
    );

    if (bottomNavigation) {

        const bottomNavItems = bottomNavigation.querySelectorAll(
            ".bottom-nav-item"
        );


        function setActiveBottomNavigation() {

            const currentPosition = window.scrollY + 160;

            let currentSection = "";

            document.querySelectorAll("main section[id]").forEach(
                function (section) {

                    if (currentPosition >= section.offsetTop) {
                        currentSection = section.id;
                    }

                }
            );


            bottomNavItems.forEach(function (item) {

                const target = item.getAttribute("href");

                const sectionId = target?.startsWith("#")
                    ? target.substring(1)
                    : "";

                const isActive =
                    sectionId === currentSection;

                item.classList.toggle("active", isActive);

                if (isActive) {
                    item.setAttribute("aria-current", "page");
                }

                else {
                    item.removeAttribute("aria-current");
                }

            });

        }


        bottomNavItems.forEach(function (item) {

            item.addEventListener("click", function (event) {

                const target = item.getAttribute("href");

                if (!target || !target.startsWith("#")) {
                    return;
                }

                const destination = document.querySelector(target);

                if (!destination) {
                    return;
                }

                event.preventDefault();

                destination.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            });

        });


        window.addEventListener(
            "scroll",
            setActiveBottomNavigation,
            { passive: true }
        );

        setActiveBottomNavigation();

    }


    /* =================================================
       28. INITIALIZE WEBSITE
    ================================================= */

    updateFilterButtons();

    renderProducts();

    renderCart();

    updateHeader();

    updateBackToTop();

    initializeScrollAnimations();


    console.log(
        "TMET Technologies online store Version 3.0 is ready."
    );

});
