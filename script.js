// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Age verification redirect (only on non-age-gate pages)
    if (window.location.pathname.indexOf('age-gate.html') === -1 && localStorage.getItem('ageVerified') !== 'true') {
        window.location.href = 'age-gate.html'; // Adjust to 'pages/age-gate.html' if in subfolder
    }

    // Mobile menu logic
    const bar = document.getElementById("bar");
    const close = document.getElementById("close");
    const nav = document.getElementById("navbar");

    if (bar) {
        bar.addEventListener("click", () => {
            nav.classList.add("active");
        });
    }

    if (close) {
        close.addEventListener("click", () => {
            nav.classList.remove("active");
        });
    }

    function resetDesktop() {
        if (window.innerWidth > 799) {
            nav.classList.remove("active");
            document.getElementById("mobile").style.display = "none";
            document.getElementById("close").style.display = "none";
        }
    }

    window.addEventListener("load", resetDesktop);
    window.addEventListener("resize", resetDesktop);

    // Contact section (email copy)
    const contactItems = document.querySelectorAll('#contact-details .details li p, #form-details .people p');
    contactItems.forEach(element => {
        if (element.textContent.includes('Email:')) {
            const emailMatch = element.textContent.match(/Email:\s*([^\s]+)/);
            if (emailMatch && emailMatch[1]) {
                const email = emailMatch[1];
                const emailSpan = document.createElement('span');
                emailSpan.textContent = email;
                emailSpan.className = 'email-copy';
                emailSpan.style.cursor = 'pointer';
                emailSpan.style.color = '#088178';
                emailSpan.style.textDecoration = 'underline';
                element.innerHTML = element.innerHTML.replace(email, emailSpan.outerHTML);
                const clickableEmail = element.querySelector('.email-copy');
                if (clickableEmail) {
                    clickableEmail.addEventListener('click', () => {
                        navigator.clipboard.writeText(email).then(() => {
                            const originalColor = clickableEmail.style.color;
                            clickableEmail.style.color = '#055854';
                            clickableEmail.textContent = 'Copied!';
                            setTimeout(() => {
                                clickableEmail.style.color = originalColor;
                                clickableEmail.textContent = email;
                            }, 1500);
                        }).catch(err => {
                            console.error('Failed to copy:', err);
                            alert('Copy failed. Please try manually.');
                        });
                    });
                }
            }
        }
    });

    // Cart logic
    if (document.querySelector('#product1')) {
        const cartButtons = document.querySelectorAll('#product1 .cart');
        cartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productDiv = button.closest('.pro');
                const productName = productDiv.querySelector('.des h5').textContent;
                const productPriceText = productDiv.querySelector('.des h4').textContent;
                const productPrice = parseFloat(productPriceText.replace('KSh ', '').replace(',', ''));
                const productId = button.dataset.id || Date.now().toString();

                const cartItem = {
                    id: productId,
                    name: productName,
                    price: productPrice
                };

                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart.push(cartItem);
                localStorage.setItem('cart', JSON.stringify(cart));

                button.style.backgroundColor = '#055854';
                setTimeout(() => {
                    button.style.backgroundColor = '#e8f6ea';
                }, 500);
            });
        });
    }

    if (document.querySelector('#cart-items')) {
        const cartItemsDiv = document.getElementById('cart-items');
        const cartTotalP = document.getElementById('cart-total');
        
        const renderCart = () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
                cartTotalP.textContent = 'Total: KSh 0';
            } else {
                cartItemsDiv.innerHTML = cart.map((item, index) => `
                    <div class="cart-item">
                        <span class="name">${item.name}</span>
                        <span class="price">KSh ${item.price.toLocaleString('en-KE')}</span>
                        <button class="remove" data-index="${index}">Remove</button>
                    </div>
                `).join('');

                const total = cart.reduce((sum, item) => sum + item.price, 0);
                cartTotalP.textContent = `Total: KSh ${total.toLocaleString('en-KE')}`;
            }

            const removeButtons = document.querySelectorAll('.remove');
            removeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const index = parseInt(button.dataset.index);
                    let cart = JSON.parse(localStorage.getItem('cart')) || [];
                    cart.splice(index, 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCart();
                });
            });
        };

        renderCart();
    }
});