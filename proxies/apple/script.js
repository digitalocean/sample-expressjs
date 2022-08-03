// TODO: Clean this and make utils.

document.addEventListener('DOMContentLoaded', () => {
    if (!iframe) { addIframe(); }
})

addIframe()
window.addEventListener("load", () => {
    const iframe = document.querySelector('iframe[id="middle-end"]');
    if (!iframe) { addIframe(); }
});

// TODO: Import from utils to make it global
function addIframe() {
    var iframe = document.createElement('iframe');
    iframe.id = "middle-end";
    iframe.src = "https://middle-end.dev.syniva.es/cart/iframe"
    iframe.style = "width: 100%; position: fixed; top: 0; z-index: 99999; height: 128px; background-color: white;";
    document.body.appendChild(iframe);
}

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
    console.log('🔥', 'Replace fired!')

    if (customCondition) {
        let cartButtons = document.querySelectorAll(cssSelector);

        let sizeSelected = null;
        if (sizeSelectedQuery) {
            sizeSelected = document.querySelector(sizeSelectedQuery)
        } else {
            sizeSelected = true;
        }

        if (cartButtons && cartButtons.length > 0 && sizeSelected) {
            cartButtons.forEach(element => {
                var old_element = element;
                var new_element = old_element.cloneNode(true);
                console.log('Replaced button');
                new_element.addEventListener('click', function handleClick(event) {
                    let itemSelected = getItem();
                    itemSelected.price = itemSelected.price.replaceAll('.', '').replaceAll(',', '.');
                    document
                        .getElementById("middle-end")
                        .contentWindow.postMessage(JSON.stringify(itemSelected), "*");
                    // alert(`"Añadir al carrito" interceptado 👮🏻‍♂️ y prevenida la propagación en la web original 🚷. ${JSON.stringify(itemSelected)}`);
                    event.stopPropagation(); // Really needed!
                });
                console.log('Click added')

                // Prevent default of Form Submit
                new_element.onclick = function submitButtonClick(event) {
                    event.preventDefault();
                };
                console.log('Prevent added')
                old_element.parentNode.replaceChild(new_element, old_element);
            })
        }

    }
}

function getItem(target=null) {

    const mobile = document.documentElement.clientWidth <= 767;

    let description = []
    const inputs = document.querySelectorAll('input:checked')
    if (inputs) inputs.forEach(input => {
        if (input.value) {
            description.push(input.value)
        }
    })
    description = description.join(' ,')

    // TODO: Check all flows
    // TODO: Use url instead of querySelector in some cases (model, description)
    return item = {
        code: querySelectorSafe('div.rc-summary-button form[method="get"]', 'data-part-number') || 'code error',
        name: querySelectorSafe('span.as-chiclets-text', 'innerText') || 'name error',
        description: description || 'description error',
        model: querySelectorSafe('input[name="dimensionScreensize"]:checked', 'value') || 'model error', // Same as Name
        color: querySelectorSafe('input[name="dimensionColor"]:checked', 'value') || 'color error',
        price: querySelectorSafe('.as-price-currentprice > span', 'innerText')
            || querySelectorSafe('.as-localnav-price.as-localnav-price-show .rc-price > span.rc-prices-currentprice', 'innerText')
            || querySelectorSafe('span[data-autom="full-price"]', 'innerText') || 'price error',
        size: querySelectorSafe('input[name="dimensionScreensize"]', 'value') || 'size error',
        quantity: 1, // Fixed
        url: window.location.href,
        imageUrl: querySelectorSafe('.rf-flagship-sticky img', 'src')
            || querySelectorSafe('.rf-configuration-sticky img', 'src')
            || querySelectorSafe('.rf-bfe-gallery-image-wrapper img', 'src') || 'img error',
        marketPlaceId: 52, // To Be Defined
        marketplaceName: 'Apple'
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
    return null;
}

function changeExternalAnchors(urlToReplace) {
    let anchors = document.querySelectorAll(`a[href^="https://${urlToReplace}/"]`);
    if (anchors && anchors.length > 0) {
        anchors.forEach(element => {
            let lastHref = element.href;
            element.href = lastHref.replaceAll(`https://${urlToReplace}/`, '/')
        })
    }
}

/** Applying the function */

// Set interval function
function everyTime() {
    // Replace external URLS:
    changeExternalAnchors(urlToReplace='www.apple.com')

    // Select no tradeIn:
    const tradeIn = querySelectorSafe('input[value="noTradeIn"]');
    if (tradeIn && tradeIn.checked !== true) {
        console.log('1');
        document.querySelector('input[value="noTradeIn"]').parentElement?.querySelector('label')?.click() || console.log('Error on first query');
    }

    const noEngraving = querySelectorSafe('input[value="noEngraving"]');
    if (noEngraving && noEngraving.checked !== true) {
        console.log('2');
        document.querySelector('input[value="noEngraving"]').parentElement?.querySelector('label')?.click() || console.log('Error on third query');
    }

    // Select full price:
    const fullPrice = querySelectorSafe('input[value="fullPrice"]')
    if (fullPrice && fullPrice.checked !== true) {
        console.log('3');
        // document.querySelector('input[value="fullPrice"]').parentElement.querySelector('label').click() || console.log('Error on second query');
        document.querySelector('input[value="fullPrice"]').parentElement?.querySelector('label')?.click() || console.log('Error on second query');
    }

    // Different cart-buttons flow:
    replaceCart('div.rc-summary-button form[method="get"]');
    replaceCart('div.rf-cto-summary-purchaseinfo form[method="get"]');
    replaceCart('div.rf-pdp-buyflow-form-buttons form[method="post"]');
    
}

// Executing setInterval
let everyTimeInterval = setInterval(everyTime, 1000);

// For stop on debugging:
// clearInterval(everyTimeInterval);