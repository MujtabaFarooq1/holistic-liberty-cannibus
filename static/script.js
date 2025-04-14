window.dataLayer = window?.dataLayer || [];
  function gtag(){window.dataLayer?.push(arguments)}
  gtag('js', new Date());

  gtag('config', 'UA-19065596-3');
	var frameWindow;
    var foundIframe = setInterval(function () {
      frameWindow = document.getElementById('jane-menu');
      if (frameWindow) {
        frameWindow = frameWindow.contentWindow;
        gtag('get', 'UA-19065596-3', 'client_id', function (clientId) {
          frameWindow.postMessage(
            {
              messageType: 'initializeGa',
              payload: {
                clientId: clientId,
                referrer: document.referrer
              }
            },
            'https://www.iheartjane.com'
          );
          clearInterval(foundIframe);
        });
      }
    }, 1000);

window.addEventListener("message", receiveMessage, false)

function receiveMessage(event) {
  var payload = event.data && event.data.payload

  if (!payload || event.data.messageType !== "analyticsEvent") return

  if (payload.name === "checkout") {
    var subtotal = payload.properties && payload.properties.estimatedTotal
    var cartId = payload.properties && payload.properties.cartId
    var products = payload.properties && payload.properties.products

    // do something with payload
    // console.log(subtotal, cartId, products, "checkout")

    // Example – if you're using Enhanced Ecommerce in Google Analytics,
    // you can use the following code:
    var items = products.map(
      ({
        product_id,
        name,
        brand,
        category,
        kind,
        unit_price,
        count,
        special_id,
        special_title,
      }) => ({
        id: product_id,
        name: name,
        brand: brand,
        category: kind,
        variant: category,
        quantity: count,
        price: unit_price,
      })
    )

    gtag("event", "purchase", {
      transaction_id: cartId,
      affiliation: "store",
      value: subtotal,
      currency: "USD",
      items: items,
    });
  }

  if (payload.name === "menuLoad") {
    var storeId = payload.properties && payload.properties.storeId

    // do something with the customerEmail if user is authenticated
    // console.log(storeId, "menuload")
  }

  if (payload.name === "productView") {
    var productId = payload.properties && payload.properties.productId
    var productKind = payload.properties && payload.properties.productKind
    var product = payload.properties && payload.properties.product

    // do something with productId, productKind, product
    // console.log(productId, productKind, product, "productView")
    gtag("event", "view_item", {
      items: [
        {
          id: productId,
          name: product.name,
          brand: product.brand,
          category: product.kind,
          variant: product.category
        },
      ],
    })
  }

  if (payload.name === "cartItemAdd") {
    var productId = payload.properties && payload.properties.productId
    var product = payload.properties && payload.properties.product

    // console.log(productId, product, "cartItemAdd") // do something with the productId
    gtag("event", "add_to_cart", {
      items: [
        {
          id: productId,
          name: product.name,
          brand: product.brand,
          category: product.kind,
          variant: product.category,
        },
      ],
    })

  }

  if (payload.name === "cartItemRemoval") {
    console.log(payload)
    var productId = payload.properties && payload.properties.productId

    // console.log(productId, "cartItemRemove")

    gtag("event", "remove_from_cart", {
      items: [
        {
          id: productId,
        },
      ],
    })
  }
}
