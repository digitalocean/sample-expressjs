addIframe();
console.log('🧠');
// move down search box
const nav = document.querySelector('nav[id="ac-globalnav"]');
if (nav) { nav.style = 'top: 124px;'; }
const navBlur = document.querySelector('div[class="ac-gn-blur"]');
if (navBlur) { navBlur.style = 'top: 124px;'; }

// remove button of cart
let cart = document.querySelectorAll('a[class*="ac-gn-link-bag"]');
if (cart && cart.length > 0) {
    console.log('With defer!');
    cart.forEach(element => {
        element.remove();
    })
}
window.addEventListener("load", () => {
    const iframe = document.querySelector('iframe[id="middle-end"]');
    if (!iframe) { addIframe(); }

    // remove button of cart
    cart = document.querySelectorAll('a[class*="ac-gn-link-bag"]');
    if (cart && cart.length > 0) {
        console.log('Required on load too...');
        cart.forEach(element => {
            element.remove();
        })
    }

    console.log('🚀');
    //document.cookie = "sq=3; path=/";


    // // move down search box
    // var searchComponent = document.querySelector('div[class="pre-l-search"]');
    // searchComponent.style = 'top: 124px;';

    // // Remove customization buttons
    // var customizationButton = document.querySelector('div[class="mt10-sm  mb6-sm prl6-sm prl0-lg u-full-width css-ngfa07"]');
    // if (customizationButton) customizationButton.remove();

    // var cardOverlay = document.querySelectorAll('div[class="card-overlay__badge"]');
    // if (cardOverlay.length > 0) {
    //   cardOverlay.forEach(co => {
    //     co.remove();
    //   })
    // }

    // var cardOverlayContent = document.querySelectorAll('div[class="card-overlay__content"]');
    // if (cardOverlayContent.length > 0) {
    //   cardOverlayContent.forEach(coc => {
    //     coc.remove();
    //   })
    // }

    // // Remove favorites and cart icons
    // var headerButtons = document.querySelector('div[class="pre-acct-btn-group pt2-sm pt3-lg d-sm-ib ta-sm-r flx-gro-sm-1 flx-gro-lg-0"]');
    // headerButtons.querySelector('a').remove();
    // headerButtons.querySelector('div').remove();

    // // Remove cart icon from mobile menu
    // document.getElementById('nav-mobileMenuCart').remove();

    // var buyTools = document.getElementById('buyTools');
    // if (buyTools) {
    //   buyTools.querySelector('div[data-browse-component="ATCButton"]').remove();

    //   var container = document.createElement('div');
    //   container.classList = 'mt10-sm mb6-sm prl6-sm prl0-lg u-full-width css-18lb4yz';
    //   container.appendChild(getATCButton());

    //   buyTools.appendChild(container);
    // }

    // // Iframe rewrite
    // var iframe = document.querySelector('iframe');
    // var iframeParent = iframe.parentNode;
    // iframe.remove();
    // var unavaliableText = document.createElement('div');
    // unavaliableText.innerHTML = 'No disponible';
    // unavaliableText.style = 'padding: 30px; font-size: 50px; font-weight: bold;';
    // iframeParent.appendChild(unavaliableText);


});

// function getATCButton() {
//     var ATCButton = document.createElement('button');
//     ATCButton.innerHTML = 'Añadir a lastsmile';
//     ATCButton.classList = 'ncss-btn-primary-dark btn-lg add-to-cart-btn';
//     ATCButton.onclick = (e) => {
//         e.preventDefault();

//         var reducedPrice = document.querySelector('div[data-test="product-price-reduced"]');
//         var name = document.getElementById('pdp_product_title').innerHTML;
//         var description = document.querySelector('h2[data-test="product-sub-title"]').innerHTML;
//         var itemImages = document.querySelectorAll(`img[alt="${name} ${description}"]`);

//         var item = {
//             name: name,
//             description: description,
//             model: document.querySelector('li[class="description-preview__style-color ncss-li"]').innerHTML,
//             color: document.querySelector('li[class="description-preview__color-description ncss-li"]').innerHTML,
//             price: document.querySelector('div[data-test="product-price"]').innerHTML,
//             reducedPrice: reducedPrice ? reducedPrice.innerHTML : null,
//             imageUrl: itemImages && itemImages.length > 0 ? itemImages[0].src : null,
//             url: window.location.href,
//             size: getItemSize(),
//             marketplaceId: 4,
//         };

//         console.log(item);

//         if (item.size) {
//             document.getElementById('middle-end').contentWindow.postMessage(JSON.stringify(item), '*');
//         }
//     }

//     return ATCButton;
// }

// function getItemSize() {
//     var input = document.querySelector('input[aria-describedby="pdp-buytools-low-inventory-messaging"]:checked');

//     if (input) {
//         return document.querySelector(`label[for="${input.id}"]`).innerHTML;
//     }
// }

// function goToCart() {
//     window.location.href = "https://lastsmile-middle-end.essedi.es/cart";
// }

// TODO: Import from utils to make it global
function addIframe() {
    var iframe = document.createElement('iframe');
    iframe.id = "middle-end";
    iframe.src = "https://lastsmile-middle-end.essedi.es/"
    iframe.style = "width: 100%; position: fixed; top: 0; z-index: 99999; height: 124px; background-color: white;";
    document.body.style = "margin-top: 124px;"
    console.log({ iframe: iframe });
    document.body.appendChild(iframe);
}

// window.onmessage = function (e) {
//     if (e.data == "cart") {
//         goToCart();
//     }
// };