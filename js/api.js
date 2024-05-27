async function getSubCategories(categoryId){

    const response = await fetch(
        "http://localhost:5166/api/category/getbyparentid/" + categoryId
      )
      
      const data = await response.json();
      return data;
}

async function getProducts(categoryId){

    const response = await fetch(
        "http://localhost:5166/api/product/getbycategoryid/" + categoryId
    )

    const data = await response.json();
    return data;
}

async function getProductsByFilter(categoryId, freeShipping, freeReturn){

    const response = await fetch(
        "http://localhost:5166/api/product/getbyfilter?categoryId=" + categoryId + "&freeShipping=" + freeShipping + "&freeReturn=" + freeReturn
    )

    const data = await response.json();
    return data;
}

async function getOffers(productId, freeShipping, freeReturn){

    let offers = await fetch('http://localhost:5166/api/productdetail/getbyfilter?productId=' + productId + "&freeShipping=" + freeShipping + "&freeReturn=" + freeReturn)
            .then(response => response.json())
            .then(data => {

                    return data;              
                })
                .catch(error => console.error(error));
                
    return offers;
}

async function getMinPriceItem(productId, freeShipping, freeReturn){

    let item = await fetch('http://localhost:5166/api/productdetail/getminpricebyfilter?productId=' + productId + "&freeShipping=" + freeShipping + "&freeReturn=" + freeReturn)
            .then(response => response.json())
            .then(data => {

                return data;
            })
            .catch(error => console.error(error));

    return item;
}

async function getSellerDetail(sellerId){

    let seller = await fetch('http://localhost:5166/api/seller/' + sellerId)
            .then(response => response.json())
            .then(data => {

                return data;
            })
            .catch(error => console.error(error));

    return seller;
}

async function getProductAttributesByBroductId(productId){

    let productAttributes = await fetch('http://localhost:5166/api/productattribute/getbyproductid/' + productId)
            .then(response => response.json())
            .then(data => {

                return data;
            })
            .catch(error => console.error(error));

    return productAttributes;
}

async function getProductDetailAttributesKeyValue(productDetailId, attributeName){

    var attributeValue = "";
    let productDetailAttributes = await fetch('http://localhost:5166/api/productdetailattribute/getbyproductdetailid/' + productDetailId)
            .then(response => response.json())
            .then(data => {

                return data;
            })
            .catch(error => console.error(error));

    for(const key in productDetailAttributes){
        if(productDetailAttributes[key].attributeName == attributeName)
        {
            attributeValue = productDetailAttributes[key].attributeValue;
        }
    }
    return attributeValue;
}

