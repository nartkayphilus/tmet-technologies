
/* =========================================
   T-MET TECHNOLOGIES
   Main Website JavaScript
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       1. MOBILE NAVIGATION MENU
    ===================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const mainNavigation = document.querySelector(".main-navigation");

    if (menuToggle && mainNavigation) {

        menuToggle.addEventListener("click", function () {

            const isOpen = mainNavigation.classList.toggle("active");

            menuToggle.setAttribute("aria-expanded", String(isOpen));

            document.body.classList.toggle("menu-open", isOpen);

        });

        // Close the menu when a navigation link is selected

        const navigationLinks = mainNavigation.querySelectorAll("a");

        navigationLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                mainNavigation.classList.remove("active");

                menuToggle.setAttribute("aria-expanded", "false");

                document.body.classList.remove("menu-open");

            });

        });

        // Close the menu when the Escape key is pressed

        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {

                mainNavigation.classList.remove("active");

                menuToggle.setAttribute("aria-expanded", "false");

                document.body.classList.remove("menu-open");

            }

        });

    }


    /* =====================================
       2. AUTOMATIC COPYRIGHT YEAR
    ===================================== */

    const currentYear = new Date().getFullYear();

    const yearElement = document.querySelector("#current-year");

    if (yearElement) {
        yearElement.textContent = currentYear;
    }


    /* =====================================
       3. SMOOTH PAGE NAVIGATION
    ===================================== */

    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (targetElement) {

                event.preventDefault();

                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    /* =====================================
       4. HEADER SCROLL EFFECT
    ===================================== */

    const siteHeader = document.querySelector(".site-header");

    if (siteHeader) {

        function updateHeader() {

            if (window.scrollY > 40) {
                siteHeader.classList.add("scrolled");
            } else {
                siteHeader.classList.remove("scrolled");
            }

        }

        window.addEventListener("scroll", updateHeader, {
            passive: true
        });

        updateHeader();

    }


    /* =====================================
       5. ACCESSIBLE FORM VALIDATION
    ===================================== */

    const websiteForms = document.querySelectorAll("form");

    websiteForms.forEach(function (form) {

        form.addEventListener("submit", function (event) {

            if (!form.checkValidity()) {

                event.preventDefault();

                form.reportValidity();

            }

        });

    });


    /* =====================================
       6. WEBSITE INITIALIZATION
    ===================================== */

    console.log("T-MET Technologies website initialized successfully.");

});
