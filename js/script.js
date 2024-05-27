
const navBar = document.querySelector(".navbar");
const categoryContainer = document.querySelector(".category-items-container");

main().catch(console.log);

async function main(){

  document.addEventListener("mouseover", function(e){
    if(!e.composedPath().includes(navBar)
        && !e.composedPath().includes(categoryContainer))
      {
        categoryContainer.classList.remove("open");
      }
  })

  //! Add navbar items start

  let data = await getSubCategories(-1);
  for (const key in data){

    var a = document.createElement("a");
    a.href = "#";
    a.className = "nav-ele-title";
    a.innerText = data[key].name;
    navBar.appendChild(a);
   
    a.addEventListener("mouseover", () => loadCategoryContainer(data[key].categoryId));
  }

  //! Add navbar items end
}

async function loadCategoryContainer(categoryId){

  categoryContainer.setAttribute("style", "left:" + categoryId*5 + "%"); //locate category container
  categoryContainer.classList.add("open");
  categoryContainer.innerHTML = "";  

  //! Add category container items start 

  let data = await getSubCategories(categoryId);
  for (const key in data){

    var div = document.createElement("div");
    div.className = "category-item";
    categoryContainer.appendChild(div);

    var span = document.createElement("span");
    span.className = "category-item-title";
    span.innerText = data[key].name;;
    div.appendChild(span);  

    let subData = await getSubCategories(data[key].categoryId);
    if(subData.length > 0){

      var ul = document.createElement("ul");
      ul.className = "category-item-list";
      div.appendChild(ul);
      
      for (const key in subData){

        var li = document.createElement("li");
        ul.appendChild(li);

        var a = document.createElement("a");
        a.href = "product.html?categoryId=" + subData[key].categoryId + "&categoryName=" + encodeURIComponent(subData[key].name);
        a.title = subData[key].name;
        a.innerText = subData[key].name;
        li.appendChild(a);
      }
    }
  }

  //! Add category container items end
}

