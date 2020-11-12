if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready)
} else {
    ready();
};
function ready(){
    const removeCartItemButtons = document.getElementsByClassName("btn-danger")
    console.log(removeCartItemButtons);
    for(let i=0; i < removeCartItemButtons.length; i++) {
        const button = removeCartItemButtons[i];
        button.addEventListener("click", removeCartItem)
    }

    let quantityInputs = document.getElementsByClassName("cart-quantity-input")
    for(let i=0; i < quantityInputs.length; i++){
        let input = quantityInputs[i]
        input.addEventListener("change", quantityChanged)
    }

    let addToCartButtons = document.getElementsByClassName("btn-addCart");
    for(let i=0; i < addToCartButtons.length; i++){
        let button = addToCartButtons[i]
        button.addEventListener("click", addToCartClicked)
    }
    updateSticker();
    updateStickerSK();
}

function removeCartItem(event){
    const buttonClicked = event.target;
    const title = buttonClicked.parentElement.parentElement.getElementsByClassName("cart-item-title")[0];
    const data = title.dataset.type;
    koszyk.forEach(rzecz => {
        if(title.textContent.replace("szt.", "")+data == rzecz){
            let indexOf = koszyk.indexOf(rzecz)
            koszyk.splice(indexOf, 1)
        }
    })
    const prodData = document.querySelector(".prod_card .title[data-type="+data+"]");
    const parent = prodData.parentElement.parentElement;
    const dropValue = parent.querySelector(".dropdown").value;
    const button = parent.querySelector(".btn-addCart");

    if(prodData.textContent+dropValue.toUpperCase() == title.innerText.replace("szt.", "")){
        button.innerText = "dodaj do koszyka"
    }
    console.log(title.textContent.replace("szt.", "")+data)
    // console.log(prodData.textContent+dropValue);
    console.log(koszyk)
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal()
};

function quantityChanged(event){
    let input = event.target
    if(isNaN(input.value) || input.value <= 0){
        input.value = 1
    }
    updateCartTotal();
}

let koszyk = []

function addToCartClicked(event){
    let button = event.target
    let shopItem = button.parentElement.parentElement
    let title = shopItem.getElementsByClassName("title")[0].innerText;
    let data = shopItem.getElementsByClassName("title")[0].dataset.type;
    let cena = parseFloat(shopItem.getElementsByClassName("cena")[0].innerText.replace("zł", ""))
    let rozmiar = shopItem.getElementsByClassName("dropdown")[0].value.toUpperCase()
    let ilosc = parseFloat(shopItem.getElementsByClassName("number")[0].innerText);
    let obrazek = ""
    if(shopItem.parentElement.querySelector(".nazwa").innerText == "T shirt"){
        obrazek = "./front.png";
    } else if (shopItem.parentElement.querySelector(".nazwa").innerText == "stop 60"){
        obrazek = "./single.png";
    } else if (shopItem.parentElement.querySelector(".nazwa").innerText == "śmierć kapusiom"){
        obrazek = "./skmulti.png";
    }
    addItemToCart(title, cena, rozmiar, ilosc, event, obrazek, data);
    updateCartTotal();
}

function addItemToCart(title, cena, rozmiar, ilosc, event, obrazek, data){
    let cartRow = document.createElement("div")
    cartRow.classList.add("cart-row")
    let cartItems = document.getElementsByClassName("cart-items")[0]
    let cartItemsNames = cartItems.getElementsByClassName("cart-item-title");

    let selectParent = event.target.parentElement.parentElement.parentElement;
    let titleOf = selectParent.querySelector(".title").innerHTML;

    for (let i = 0; i < cartItemsNames.length; i++){
        let dane = cartItems.getElementsByClassName("cart-item-title")[i].dataset.type
        if(cartItemsNames[i].textContent.replace("szt.", "")+dane == title+rozmiar+data){
            alert("ten produkt został już dodany do koszyka, wybierz inny rozmiar lub pakiet");
            return;
        } else {
        }
        console.log(cartItemsNames[i].textContent+dane)
    }
    koszyk.splice(0, 0, titleOf+rozmiar.toUpperCase()+data)
    console.log(koszyk)
    event.target.innerText="w koszyku"

    if (isNaN(rozmiar)){
        
    } else {
        rozmiar = `${rozmiar}szt.`
    }

    let cartRowContents = `
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="${obrazek}"></img>
                <span class="cart-item-title" data-type="${data}">${title}<strong class="size-cart-item">${rozmiar}</strong></span> 
            </div>
            <span class="cart-price cart-column">${cena}zł</span>
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" type="number" value="${ilosc}">
                <button class="btn btn-danger" type="button">usuń</button>
            </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.appendChild(cartRow)
    cartRow.getElementsByClassName("btn-danger")[0].addEventListener("click", removeCartItem);
    cartRow.getElementsByClassName("cart-quantity-input")[0].addEventListener("change", quantityChanged);        
}

document.querySelectorAll(".dropdown").forEach(dd => {
    dd.addEventListener("change", (event => {
        let selectParent = event.target.parentElement.parentElement.parentElement;
        let data = selectParent.querySelector(".title").dataset.type;
        let button = selectParent.querySelector(".btn-addCart")
        let titleOf = selectParent.querySelector(".title").innerHTML;
        console.log(koszyk)
       
            if(koszyk.includes(titleOf+event.target.value.toUpperCase()+data)){
                button.innerText = "w koszyku"
            }else{
                button.innerText = "dodaj do koszyka"
            }
    }))
}) 

const nazwy = document.querySelectorAll(".nazwa")
const prodcard = document.querySelectorAll(".prod_card")
nazwy.forEach(el => {
    el.addEventListener("click", evt => {
        el.nextElementSibling.classList.toggle("expand")
        el.classList.toggle("fill")
        document.querySelector(".stop60 .dropdown").addEventListener("change", updateSticker)
        document.querySelector(".sk .dropdown").addEventListener("change", updateStickerSK)
        nazwy.forEach(nazwa => {
            if (nazwa != el) {
                nazwa.nextElementSibling.classList.remove("expand");
                nazwa.classList.remove("fill");
            }
        })
    })
})

const mute = document.querySelector(".mute")
const vid = document.querySelector(".BGcontainer");
mute.addEventListener("click", e => {
    mute.classList.toggle("muted");
    if (mute.classList.contains("muted")){
        vid.muted = true;
        vid.load();
        vid.pause();
    }else{
        vid.muted = false;
        vid.play();
    }
})


const minus = document.querySelectorAll(".minus");
const plus = document.querySelectorAll(".plus");
let number = document.querySelectorAll(".number");
for(let i=0; i<minus.length; i++){
    let amount = 1;
    number[i].dataset.amount=amount
    plus[i].addEventListener("click", e =>{
        amount = amount+1;
        console.log(amount);
        number[i].innerHTML = `${amount}`;
        number[i].dataset.amount=amount;
    });
    
    minus[i].addEventListener("click", e =>{
        if(amount > 1){
        amount = amount-1;
        console.log(amount)
        number[i].innerHTML = `${amount}`;
        number[i].dataset.amount=amount;
        }
    });
}
document.querySelector(".cart-open").addEventListener("click", e =>{
    document.querySelector(".cart-popup").classList.toggle("hidden");
    updateCartTotal();
    nazwy.forEach(nazwa => {
        nazwa.nextElementSibling.classList.remove("expand");
        nazwa.classList.remove("fill")
    })
    document.querySelectorAll(".nazwa").forEach(naz =>{
        naz.addEventListener("click", tak => {
            document.querySelector(".cart-popup").classList.add("hidden")
        })
    });
});

document.querySelector(".close").addEventListener("click", e =>{
    document.querySelector(".cart-popup").classList.add("hidden");
})


function updateCartTotal(){
    const cartItemContainer = document.getElementsByClassName("cart-items")[0]
    const cartRows = cartItemContainer.getElementsByClassName("cart-row");
    document.querySelector(".count-rows").innerText = cartRows.length;
    let total = 0
    for(let i = 0; i < cartRows.length; i++){
        const cartRow = cartRows[i];
        const priceElement = cartRow.getElementsByClassName("cart-price")[0]
        const quantityElement = cartRow.getElementsByClassName("cart-quantity-input")[0]
        const price = parseFloat(priceElement.innerHTML.replace("zł",""))
        const quantity = quantityElement.value
        // console.log(price*quantity);
        total = total + (price*quantity);
    }
    document.getElementsByClassName("cart-total-price")[0].innerText = total + ",-";
    document.getElementsByClassName("final-price")[0].innerText = (total + 15) + "zł";
}

let tShirtArray = new Array();

tShirtArray[0] = new Image();
tShirtArray[0].src = "./front.png";

tShirtArray[1] = new Image();
tShirtArray[1].src = "./back.png";

tShirtArray[2] = new Image();
tShirtArray[2].src = "./sizing.png";

let stop60Array = new Array();

stop60Array[0] = new Image();
stop60Array[0].src = "./single.png";

stop60Array[1] = new Image();
stop60Array[1].src = "./multi.png";

let SKarray = new Array();

SKarray[0] = new Image();
SKarray[0].src = "./skmulti.png"

const tpic = document.querySelector(".t-product-pics");
const right = document.querySelector(".tee.custom-arrow-right");
const left = document.querySelector(".tee.custom-image-arrow");

const stop60pics = document.querySelector(".sixt-product-pics");
const stright = document.querySelector(".sixt.custom-arrow-right");
const stleft = document.querySelector(".sixt.custom-image-arrow");
let Tee = 0;
let sixt = 0;
let sk = 0

right.addEventListener("click", nextPic);
left.addEventListener("click", prevPic);
stright.addEventListener("click", stnextPic);
stleft.addEventListener("click", stprevPic);
checkIndex(Tee);
stCheckIndex(sixt);

function nextPic(event){
if(Tee < tShirtArray.length -1) {   
   Tee++;
   tpic.src = tShirtArray[(Tee)].src;
   checkIndex(Tee);
}else{
    event.preventDefault();
    checkIndex(Tee);
}
}
function prevPic(event){
    if(Tee > 0){
        Tee--;
        tpic.src = tShirtArray[(Tee)].src;
        checkIndex(Tee);
    } else {
        event.preventDefault();
        checkIndex(Tee);
    }
}

function stnextPic(event){
if(sixt < stop60Array.length -1) {   
   sixt++;
   stop60pics.src = stop60Array[(sixt)].src;
   stCheckIndex(sixt);
}else{
    event.preventDefault();
    stCheckIndex(sixt);
}
}
function stprevPic(event){
    if(sixt > 0){
        sixt--;
        stop60pics.src = stop60Array[(sixt)].src;
        stCheckIndex(sixt);
    } else {
        event.preventDefault();
        stCheckIndex(sixt);
    }
    
}

function checkIndex(Tee){
    console.log(Tee);
    if (Tee == tShirtArray.length-1){
        right.classList.add("hide-arrow");
        left.classList.remove("hide-arrow")
    } else if (Tee == 0){
        left.classList.add("hide-arrow");
        right.classList.remove("hide-arrow");
    } else {
        left.classList.remove("hide-arrow");
        right.classList.remove("hide-arrow");
    }
}

function stCheckIndex(sixt){
    if (sixt == stop60Array.length-1){
        console.log("jestemy na koncu")
        stright.classList.add("hide-arrow");
        stleft.classList.remove("hide-arrow")
    } else if (sixt == 0){
        stleft.classList.add("hide-arrow");
        stright.classList.remove("hide-arrow");
    } else {
        stleft.classList.remove("hide-arrow");
        stright.classList.remove("hide-arrow");
    }
}

function updateSticker(){
    const dropdownST = document.querySelector(".stop60 .dropdown").value;
    let cenaST = document.querySelector(".stop60 .cena");
    if(dropdownST == 10){
        cenaST.innerText = "15zł";
    } else if(dropdownST == 30){
        cenaST.innerText = "30zł";
    }else if(dropdownST == 100){
        cenaST.innerText = "90zł";
    }
} 
function updateStickerSK(){
    const dropdownSK = document.querySelector(".sk .dropdown").value;
    let cenaSK = document.querySelector(".sk .cena");
    if(dropdownSK == 10){
        cenaSK.innerText = "15zł";
    } else if(dropdownSK == 30){
        cenaSK.innerText = "30zł";
    }else if(dropdownSK == 100){
        cenaSK.innerText = "90zł";
    }
} 

// document.querySelectorAll(".dropdown").forEach(dd => {
//     dd.addEventListener("change", (event => {
//         let selectParent = event.target.parentElement.parentElement.parentElement;
//         let button = selectParent.querySelector(".btn-addCart")
//         let cartItems = document.getElementsByClassName("cart-items")[0]
//         let cartItemsNames = cartItems.querySelectorAll(".cart-item-title");
//         let titleOf = selectParent.querySelector(".title").innerHTML;
//         let koszyk = Array.from(cartItemsNames, i => (i.textContent))
//         console.log(koszyk)
       
//             if(koszyk.includes(titleOf+event.target.value.toUpperCase())){
//                 button.innerText = "dodano strachu kapusiom"
//             }else{
//                 button.innerText = "dodaj do koszyka"
//             }
//     }))
// })        
 
    





