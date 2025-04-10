const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartmodal = document.getElementById("cart-modal");
const cartModalContainers = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const chekoutBtn = document.getElementById("chekout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarning = document.getElementById("address-warn");
const emptyWarning = document.getElementById("empty-warn");
const dataSpan = document.getElementById("date-span");
const selectPagamento = document.getElementById("selectPagamento");
const troco = document.getElementById("troco");
const trocoAviso = document.getElementById("troco-aviso");
const trocoWarning = document.getElementById("trocoWarning")

let cart = [];

cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartmodal.style.display = "flex";    
});

closeModalBtn.addEventListener("click", function(){
    cartmodal.style = "hidden";
});

cartmodal.addEventListener("click", function(event){
    if(event.target == cartmodal ){
        cartmodal.style.display = "none";
    }
});

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn");

    if(parentButton){
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        addToCart(name, price);
    }
});

function addToCart(name, price){
    const existingItem = cart.find(item => item.name == name);

    if(existingItem){
        existingItem.quantity += 1;
        return; 
    }
    else{
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }

    updateCartModal();
}

function updateCartModal(){
    cartModalContainers.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "jusitfy-between", "mb-4", "flex-col" );

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between"> 
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd:${item.quantity}</p>
                    <p class="font-medium mt-2 ">R$ ${item.price.toFixed(2)}</p>
                </div>

                <button class="remove-btn text-red-600" data-name="${item.name}">Remover</button>
            </div>
            <hr>
        `;

        total += item.price * item.quantity;

        cartModalContainers.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

cartModalContainers.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-btn")){
        const name = event.target.getAttribute("data-name");

        removeItemCart(name);
    }
});

function removeItemCart(name){
    const index = cart.findIndex(item => item.name == name);

    if(index != -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        else{
            cart.splice(index, 1);
            updateCartModal();
            return;
        }
    }
}

selectPagamento.addEventListener("change", function(){
    var itemSelecionado = this.value;

    if(itemSelecionado == "dinheiro"){
        troco.classList.remove("hidden");
        trocoAviso.classList.remove("hidden");
    }else{
        troco.classList.add("hidden");
        trocoAviso.classList.add("hidden");
        return;
    }

    if(itemSelecionado != "naoselecionado"){
        trocoWarning.classList.add("hidden");
        selectPagamento.classList.remove("border-red-600")
    }
});

troco.addEventListener("input", function(event){
    let inputValue2 = event.target.value;

    if(inputValue2 == ""){
        inputValue2 = "Nao precisa de troco";
    }
});

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue != ""){
        addressInput.classList.remove("border-red-500");
        addressWarning.classList.add("hidden");
    }
});



chekoutBtn.addEventListener("click", function(){
    
    if(cart.length == 0){
        emptyWarning.classList.remove("hidden");
        updateCartModal();
        return;
    }
    else{
        emptyWarning.classList.add("hidden");
        updateCartModal();
    }

   
    if(addressInput.value == ""){
        addressWarning.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        updateCartModal();
        return;
    }

    if(selectPagamento.value == "naoselecionado"){
        selectPagamento.classList.add("border-red-600");
        trocoWarning.classList.remove("hidden");
        updateCartModal();
        return;
    }

    
    let total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    
    const cartItems = cart.map((item) => {
        return(
            `${item.name} Quantidade: ${item.quantity}  Preço: R$ ${item.price} | `
        );
    }).join("");

    
    const message = encodeURIComponent(`${cartItems} Total: R$ ${total.toFixed(2)}`);

    
    const phone = "11973061169";
    window.open(`https://wa.me/${phone}?text=${message} pagamento: ${selectPagamento.value} | troco: ${troco.value} | endereço: ${addressInput.value}`, "_blank");

    
    cart.length = 0;
    updateCartModal();
});

function chekoutRestaurantOpen(){
    const data = new Date();
    const horas = data.getHours();
    return horas >=  18 && horas < 22;
}

const spanItem = document.getElementById("date-span");
const isOpen = chekoutRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}
