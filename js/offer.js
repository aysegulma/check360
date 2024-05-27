const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get('productId');
const productName = urlParams.get('productName');
const freeShipping = urlParams.get('freeShipping');
const freeReturn = urlParams.get('freeReturn');

const offersContainer = document.querySelector(".offers-container");

main().catch(console.log);

async function main(){

    let offers = await getOffers(productId, freeShipping, freeReturn);

    for (const key in offers){

        var div = document.createElement("div");
        div.className = "single-offer-container";
        offersContainer.appendChild(div);

        let seller = await getSellerDetail(offers[key].sellerId);

        var a = document.createElement("a");
        a.href = "https://www." + seller.webUrl;
        a.className = "offers-link";
        a.target = "_blank";
        div.appendChild(a);

        var div2 = document.createElement("div");
        div2.className = "offers";
        a.appendChild(div2);

        var div3 = document.createElement("div");
        div3.className = "card";
        div2.appendChild(div3);

        var div4 = document.createElement("div");
        div4.className = "card-body";
        div3.appendChild(div4);

        var fullProductName = productName;

        let productAttributes = await getProductAttributesByBroductId(productId);
        for(const key2 in productAttributes){
            if(productAttributes[key2].showInProductName == true)
            {
                var productAttributeName = productAttributes[key2].attributeName;

                let productDetailAttributeValue = await getProductDetailAttributesKeyValue(offers[key].productDetailId, productAttributeName);
                if(productDetailAttributeValue != ""){
                    fullProductName += ", " + productDetailAttributeValue;
                }
            }
        }

        var div5 = document.createElement("div");
        div5.className = "offer-product-name";
        div5.innerText = fullProductName; 
        div4.appendChild(div5);

        var div6 = document.createElement("div");
        div6.className = "offer-information";
        div4.appendChild(div6);

        var div7 = document.createElement("div");
        div7.className = "offer-price";
        div6.appendChild(div7);

        var div8 = document.createElement("div");
        div8.className = "offer-price-value";
        div8.innerText = offers[key].price.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + " ₺";
        div7.appendChild(div8);

        var div9 = document.createElement("div");
        div9.className = "delivery-costs";
        if(offers[key].shippingPrice > 0){
            var totalPrice = offers[key].price + offers[key].shippingPrice;
            div9.innerText = totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + " ₺ - Kargo dahil";
        }else{
            div9.innerText = "Ücretsiz kargo"; 
        }     
        div6.appendChild(div9);

        var div10 = document.createElement("div");
        div10.className = "offer-details";
        div4.appendChild(div10);

        var div11 = document.createElement("div");
        div11.className = "offer-details-item";
        div10.appendChild(div11);

        var div12 = document.createElement("div");
        div12.className = "offer-details-icon";
        div11.appendChild(div12);

        var i = document.createElement("i");
        i.className = "fa-solid fa-truck";
        div12.appendChild(i);

        let deliveryTime = await getProductDetailAttributesKeyValue(offers[key].productDetailId, "DeliveryTime");

        var div13 = document.createElement("div");
        div13.className = "offer-details-text";
        div13.innerText = deliveryTime;
        div11.appendChild(div13); 
        
        var div14 = document.createElement("div");
        div14.className = "return-policy";
        div10.appendChild(div14);

        var div15 = document.createElement("div");
        if(offers[key].isReturnChargeable == true)
        {
            div15.className = "return-policy-icon gelb";
        }else{
            div15.className = "return-policy-icon";
        }
        div14.appendChild(div15);

        var i2 = document.createElement("i");
        i2.className = "fa-solid fa-rotate";
        div15.appendChild(i2);

        var div16 = document.createElement("div");
        div16.className = "return-policy-text";
        if(offers[key].isReturnChargeable == true)
        {
            div16.innerText = "İade: ücretli"; 
        }else{
            div16.innerText = "İade: ücretsiz";
        }        
        div14.appendChild(div16);

        var div17 = document.createElement("div");
        div17.className = "offer-links";
        div4.appendChild(div17);

        var div18 = document.createElement("div");
        div18.className = "offer-logo";
        div17.appendChild(div18);

        var img = document.createElement("img");
        img.src = "images/sellers/" + seller.logo;
        div18.appendChild(img);
    }
}
