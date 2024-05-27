
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const categoryId = urlParams.get('categoryId');
const categoryName = urlParams.get('categoryName');

const resultMessageCategorySpan = document.querySelector(".result-message-orange");
const resultMessageConnectorSpan = document.querySelector(".result-message-connector-text");
const resultMessageFilterSpan = document.querySelector(".result-message-filter-text");
const resultMessageTextSpan = document.querySelector(".result-message-base-text");
const categorySpan = document.querySelector(".category-select-button span");
const categorySelect = document.querySelector(".category-select");
const freeShippingSpan = document.querySelector(".freeShipping-select-button span");
const freeReturnSpan = document.querySelector(".freeReturn-select-button span");
const resultTitle = document.querySelector(".search-result-title-headline");
const resultGrid = document.querySelector(".search-result-grid");

main().catch(console.log);

async function main(){

    resultMessageCategorySpan.innerText = '"' + categoryName + '"';
    categorySpan.innerText = categoryName;
    categorySpan.addEventListener("click", () => createResultGridItems(categoryId, false, false));

    //! create category select start

    let subCategories = await getSubCategories(categoryId);
    
    for (const key in subCategories){

      //! Add categoryselect items
      var div = document.createElement("div");
      div.className = "category-select-button indent";
      categorySelect.appendChild(div);

      var span = document.createElement("span");
      span.className = "category-select-button-text";
      span.innerText = subCategories[key].name;
      span.id = "category-select-button-" + subCategories[key].categoryId;
      div.appendChild(span);    

      span.addEventListener("click", () => createResultGridItems(subCategories[key].categoryId, false, false));
    }

    //! create category select end

    freeShippingSpan.addEventListener("click", function() {
        createResultGridItems(categoryId, true, false)
    });
    freeReturnSpan.addEventListener("click", function() {
        createResultGridItems(categoryId, false, true)
    });

    //! create result grid items start

    createResultGridItems(categoryId, false, false);
    
    //! create result grid items end
}

async function createResultGridItems(categoryId, freeShipping, freeReturn){

    if(freeShipping){
        resultMessageConnectorSpan.innerText = "ve";
        resultMessageFilterSpan.innerText = '"Ücretsiz Kargo"';
    }
    else if(freeReturn){
        resultMessageConnectorSpan.innerText = "ve";
        resultMessageFilterSpan.innerText = '"Ücretsiz İade"';
    }
    else
    {
        resultMessageConnectorSpan.innerText = "";
        resultMessageFilterSpan.innerText = "";
    }
    
    resultGrid.innerHTML = "";

    let products = await getProductsByFilter(categoryId, freeShipping, freeReturn); 

    if(products.length > 0)
    {
        resultTitle.innerText = "Ürünler";
    }
    else
    {
        resultTitle.innerText = "Ürün bulunamadı.";
    }

    resultMessageTextSpan.innerText = "için " + products.length + " sonuç";

    for (const key in products){
      
        var div = document.createElement("div");
        div.className = "grid-item-container";
        resultGrid.appendChild(div);       

        //! create image start

        var a = document.createElement("a");
        a.href = "offer.html?productId=" + products[key].productId + "&productName=" + encodeURIComponent(products[key].name) + "&freeShipping=" + freeShipping + "&freeReturn=" + freeReturn;
        div.appendChild(a);
    
        var div2 = document.createElement("div");
        div2.className = "product-image-container";
        a.appendChild(div2);  


        let minPriceItem = await getMinPriceItem(products[key].productId, freeShipping, freeReturn);   

        let productImage = products[key].image;
        let productColor = await getProductDetailAttributesKeyValue(minPriceItem.productDetailId, "Color");

        if(productImage != "" && productColor != ""){

            productImage = productImage.split(".")[0] + "_" + productColor + "." + productImage.split(".")[1];
        }
        
        var img = document.createElement("img");
        img.className = "product-image-image";
        img.src = "images/" + productImage;
        div2.appendChild(img);

        var div3 = document.createElement("div");
        div3.className = "product-image-overlay";
        div2.appendChild(div3);

        //! create image end

        var div4 = document.createElement("div");
        div4.className = "grid-item-details-container";
        div.appendChild(div4);

        //! create product variants start

        var divVariant = document.createElement("div");
        divVariant.className = "variant-display";
        div4.appendChild(divVariant);

        let offers = await getOffers(products[key].productId, freeShipping, freeReturn); 

        var colorArr = [];
        for(const key in offers){

            var colorVariant = await getProductDetailAttributesKeyValue(offers[key].productDetailId, "Color");

            if(colorVariant != "" && !colorArr.includes(colorVariant))
            {
                colorArr.push(colorVariant);
            }
        }        

        for(const index in colorArr)
        {
            var divImageVariant = document.createElement("div");
            divImageVariant.className = "image-variant";
            divVariant.appendChild(divImageVariant);

            var divImageVariantImage = document.createElement("div");
            divImageVariantImage.className = "image-variant-image";
            divImageVariantImage.style.backgroundImage ="url(images/" + products[key].image.split(".")[0] + "_" + colorArr[index] + "." + products[key].image.split(".")[1];
            divImageVariant.appendChild(divImageVariantImage);
        }

        //! create product variants end

        //! create product details start

        var div5 = document.createElement("div");
        div5.className = "product-details";
        div4.appendChild(div5);

        var a2 = document.createElement("a");
        a2.href = "offer.html?productId=" + products[key].productId + "&productName=" + encodeURIComponent(products[key].name) + "&freeShipping=" + freeShipping + "&freeReturn=" + freeReturn;
        div5.appendChild(a2);

        //! create product name start 

        var productName = products[key].name;

        let productAttributes = await getProductAttributesByBroductId(products[key].productId);
        for(const key in productAttributes){
            if(productAttributes[key].showInProductName == true)
            {
                var productAttributeName = productAttributes[key].attributeName;

                let productDetailAttributeValue = await getProductDetailAttributesKeyValue(minPriceItem.productDetailId, productAttributeName);
                if(productDetailAttributeValue != ""){
                    productName += ", " + productDetailAttributeValue;
                }
            }
        }

        var div6 = document.createElement("div");
        div6.className = "product-details-title";            
        div6.innerText = productName;
        a2.appendChild(div6);

        //! create product name end



        //! create offer text start 

        var span = document.createElement("span");
        span.className = "product-details-offers";
        span.innerText = offers.length + " Teklif arasında en uygun"; 
        div5.appendChild(span);

        //! create offer text end

        //! create seller start

        let seller = await getSellerDetail(minPriceItem.sellerId);

        var a3 = document.createElement("a");
        a3.href = "https://www." + seller.webUrl;
        a3.target = "_blank"; 
        a3.className = "product-details-seller-container";
        div5.appendChild(a3);

        var divSeller = document.createElement("div");
        divSeller.className = "product-details-seller";
        divSeller.innerText = seller.webUrl;
        a3.appendChild(divSeller);

        //! create seller end

        //! create price text start        

        if(minPriceItem != null){

            var div7 = document.createElement("div");
            div7.className = "product-details-price";
            a3.appendChild(div7);
                    var div8 = document.createElement("div");
            div8.className = "display-text";
            div7.appendChild(div8);
                    var span2 = document.createElement("span");
            span2.className = "value";
            span2.innerText = minPriceItem.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 });
            div8.appendChild(span2);
                    var span3 = document.createElement("span");
            span3.className = "unit";
            span3.innerText = "₺"; 
            div8.appendChild(span3);
        }

        //! create price text end

        //! create shipping info text start 

        var div9 = document.createElement("div");
        div9.className = "product-details-shipping";
        div5.appendChild(div9);

        var div10 = document.createElement("div");
        div10.className = "product-details-cost-container";
        div9.appendChild(div10);

        var div11 = document.createElement("div");
        div11.className = "shipping-costs";
        div10.appendChild(div11);

        if(minPriceItem.shippingPrice > 0)
        {
            div11.innerText = minPriceItem.shippingPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + " ₺ Kargo";
        }
        else
        {
            div11.innerText = "Ücretsiz kargo";
        }

        var div12 = document.createElement("div");
        div12.className = "date-range";
        div9.appendChild(div12);

        var span4 = document.createElement("span");
        span4.className = "";
        span4.innerText = await getProductDetailAttributesKeyValue(minPriceItem.productDetailId, "DeliveryTime");
        div12.appendChild(span4);

        //! create shipping info text start 

        //! create product details end
    }    
}

