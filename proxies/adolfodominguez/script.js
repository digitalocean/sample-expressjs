// TODO: Clean this and make utils.
const IFRAME_WIDTH = "128px";

document.addEventListener('DOMContentLoaded', () => {
    addIframe()
})

addIframe()

/**
 * Custom Cart Replace Function
 */

/** 
 * Function to replace the cart with our logic own logic 
 * 
 * @param cssSelector - Query to get the original cart button with CSS selectors
 * @param sizeSelected - Query to see if sizeSelected is setted
 * @param customCondition - Custom condition to see if function needs to run
 * @return void
 * 
 * @example
 *      replaceCart('button[class*=".add-to-cart"]', '.selected.product-sizes__option')
 * */

function replaceCart(cssSelector, sizeSelectedQuery=false, customCondition=true) {

    if (customCondition) {
        let cartButtons = document.querySelectorAll(cssSelector);

        let sizeSelected = null;
        if (sizeSelectedQuery) {
            sizeSelected = document.querySelector('.selected.product-sizes__option')
        } else {
            sizeSelected = true;
        }

        if (cartButtons && cartButtons.length > 0 && sizeSelected) {
            cartButtons.forEach(element => {
                var old_element = element;
                var new_element = old_element.cloneNode(true);
                new_element.addEventListener('click', function handleClick(event) {
                    const itemSelected = getItem(event.target);
                    alert(`"Añadir al carrito" interceptado 👮🏻‍♂️ y prevenida la propagación en la web original 🚷. ${JSON.stringify(itemSelected)}`);
                    event.stopPropagation() // Really needed!
                });
                old_element.parentNode.replaceChild(new_element, old_element);
            })
        }

    }
}

/** Applying the function */

// Set interval function
function everyTime() {
    // To work on desktop flow:
    replaceCart('.add-to-cart', '.selected.product-sizes__option', document.documentElement.clientWidth > 767);
    // To work with mobiles flow:
    replaceCart('.product-sizes__option', null, document.documentElement.clientWidth <= 767);
}

// Executing setInterval
let everyTimeInterval = setInterval(everyTime, 1000);

// For stop on debugging:
// clearInterval(everyTimeInterval);

//---------------------------------------------------------------------------

function addIframe() {
    if (!document.getElementById('middle-end')) {
        // Middle iframe
        var iframe = document.createElement('iframe');
        iframe.id = "middle-end";
        iframe.src = "https://lastsmile-middle-end.essedi.es/"
        iframe.style = `width: 100%; position: fixed; top: 0; z-index: 99999; height: 128px; background-color: white; opacity: 100%`;
        document.body.appendChild(iframe);
    }
}



function getItem(target) {

    const mobile = document.documentElement.clientWidth <= 767;

    return item = {
        code: querySelectorSafe('span.product-id', 'innerText'),
        name: querySelectorSafe('h1.product-info__name', 'innerText'),
        description: querySelectorSafe('p.product-description', 'innerText'),
        model: querySelectorSafe('h1.product-info__name', 'innerText'), // Same as Name
        color: querySelectorSafe('#selected-color-name', 'innerText'),
        price: querySelectorSafe('div.price > span > span span.value', 'value'),
        size: mobile ? target.innerText || 'error' : querySelectorSafe('.selected.product-sizes__option', 'innerText'),
        quantity: 1, // Fixed
        url: window.location.href,
        imageUrl: querySelectorSafe('.swiper-wrapper.product-images-slider__wrapper img', 'src'),
        marketPlaceId: 404 // To Be Defined
    }
}

function querySelectorSafe(query, selector=false) {
    const querySelector = document.querySelector(query);
    if (querySelector) {
        if (selector) {
            return querySelector[selector];
        }
        return querySelector;
    }
    return 'error';
}