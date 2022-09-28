/**
 * This is a trick that removes default hreflang link tag which is unnecesaary for SEO
 */
function remove_x_default() {
  window.addEventListener('DOMNodeInserted', function (event) {
    const elem = window.document.querySelector('link[hreflang=x-default]');
    if (elem) {
      elem.parentNode.removeChild(elem);
    }
  });
}

remove_x_default();
