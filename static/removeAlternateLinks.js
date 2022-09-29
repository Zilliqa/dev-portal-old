/**
 * This is a trick that removes default hreflang link tag which is unnecesaary for SEO
 */
function remove_alternate_links() {
  window.addEventListener('DOMNodeInserted', function (event) {
    const items = window.document.querySelectorAll('link[rel=alternate]');
    items.forEach((item) => {
      item.parentNode.removeChild(item);
    });
  });
}

remove_alternate_links();
