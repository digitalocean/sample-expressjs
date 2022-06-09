addIframe();
console.log('Defer fire 🧠');
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

    console.log('Load fire 🚀');

});

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
