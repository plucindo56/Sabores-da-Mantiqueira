const products = [
 {id:1,cat:"Queijos",icon:"🧀",name:"Queijo Mantiqueira Tradicional",producer:"Seleção Mantiqueira",weight:"500 g / 900 g / 5 kg",price:0,unit:"preço de venda a definir",desc:"Clássico da região para tábuas, café e harmonizações."},
 {id:2,cat:"Queijos",icon:"🧀",name:"Queijo Mantiqueira Capa Preta",producer:"Seleção Mantiqueira",weight:"500 g / 900 g / 5 kg",price:0,unit:"preço de venda a definir",desc:"Perfil marcante e apresentação premium."},
 {id:3,cat:"Queijos",icon:"🧀",name:"Queijo Mantiqueira Temperado",producer:"Seleção Mantiqueira",weight:"500 g / 900 g",price:0,unit:"preço de venda a definir",desc:"Opção aromática para quem procura sabores diferentes."},
 {id:4,cat:"Queijos",icon:"🍷",name:"Queijo Mantiqueira ao Vinho",producer:"Seleção Mantiqueira",weight:"900 g",price:0,unit:"preço de venda a definir",desc:"Uma opção especial para presentes e harmonizações."},
 {id:5,cat:"Queijos",icon:"🔥",name:"Queijo Mantiqueira Defumado",producer:"Seleção Mantiqueira",weight:"conforme lote",price:0,unit:"preço de venda a definir",desc:"Sabor defumado para tábuas e receitas."},
 {id:6,cat:"Queijos",icon:"🧀",name:"Pérola",producer:"Queijaria Velho Pitta • Itamonte/MG",weight:"conforme lote",price:0,unit:"preço de venda a definir",desc:"Queijo autoral da Mantiqueira."},
 {id:7,cat:"Queijos",icon:"🧀",name:"Madrepérola",producer:"Queijaria Velho Pitta • Itamonte/MG",weight:"conforme lote",price:0,unit:"preço de venda a definir",desc:"Uma das especialidades da queijaria."},
 {id:8,cat:"Queijos",icon:"🫒",name:"Ametista",producer:"Queijaria Velho Pitta • Itamonte/MG",weight:"conforme lote",price:0,unit:"preço de venda a definir",desc:"Versão com azeitona preta."},
 {id:9,cat:"Doces",icon:"🍯",name:"Goiabada Cascão Artesanal",producer:"Seleção de produtos mineiros",weight:"500 g",price:0,unit:"preço de venda a definir",desc:"Harmonização clássica com queijos da Mantiqueira."},
 {id:10,cat:"Doces",icon:"🥛",name:"Doce de Leite Artesanal",producer:"Seleção de produtores",weight:"conforme lote",price:0,unit:"preço de venda a definir",desc:"Para acompanhar queijos, cafés e sobremesas."},
 {id:11,cat:"Cafés",icon:"☕",name:"Café Especial da Mantiqueira",producer:"Seleção regional",weight:"conforme lote",price:0,unit:"preço de venda a definir",desc:"Selecionado para acompanhar a experiência Mantiqueira."},
 {id:12,cat:"Kits",icon:"🎁",name:"Kit Trio Mantiqueira",producer:"Sabores da Mantiqueira",weight:"combinação personalizada",price:0,unit:"monte seu kit",desc:"Queijos + acompanhamento escolhidos para presente ou degustação."},
];

let cart = JSON.parse(localStorage.getItem("sm_cart") || "{}");
let currentCat = "Todos";

function money(v){return v ? v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}) : "Consulte o valor"}

function renderProducts(){
  const list = document.getElementById("products");
  const filtered = currentCat==="Todos" ? products : products.filter(p=>p.cat===currentCat);
  list.innerHTML = filtered.map(p=>`
    <article class="product">
      <div class="product-img">${p.icon}</div>
      <div class="product-body">
        <span class="tag">${p.cat}</span>
        <h3>${p.name}</h3>
        <div class="producer">${p.producer}<br><span class="weight">${p.weight}</span><br>${p.desc}</div>
        <div class="price">${money(p.price)} <small>${p.unit}</small></div>
        <button class="add" onclick="addToCart(${p.id})">Adicionar ao pedido</button>
      </div>
    </article>`).join("");
}

function addToCart(id){
  cart[id]=(cart[id]||0)+1;
  saveCart(); updateCartCount();
  alert("Produto adicionado ao pedido.");
}
function saveCart(){localStorage.setItem("sm_cart",JSON.stringify(cart))}
function updateCartCount(){document.getElementById("cartCount").textContent=Object.values(cart).reduce((a,b)=>a+b,0)}
function openCart(){
  document.getElementById("cartModal").classList.remove("hidden");
  renderCart();
}
function closeCart(){document.getElementById("cartModal").classList.add("hidden")}
function renderCart(){
  const el=document.getElementById("cartItems");
  const ids=Object.keys(cart).map(Number);
  if(!ids.length){el.innerHTML="<p>Seu pedido está vazio.</p>";document.getElementById("cartTotal").textContent="R$ 0,00";return}
  let total=0;
  el.innerHTML=ids.map(id=>{
    const p=products.find(x=>x.id===id), q=cart[id];
    total += (p.price||0)*q;
    return `<div class="cart-line"><div><strong>${p.name}</strong><br><small>${p.unit}</small></div><div class="qty"><button onclick="changeQty(${id},-1)">−</button><span>${q}</span><button onclick="changeQty(${id},1)">+</button></div><strong>${p.price?money(p.price*q):"Consultar"}</strong></div>`;
  }).join("");
  document.getElementById("cartTotal").textContent=total?money(total):"A confirmar";
}
function changeQty(id,delta){
  cart[id]=(cart[id]||0)+delta;
  if(cart[id]<=0) delete cart[id];
  saveCart();updateCartCount();renderCart();
}
function clearCart(){cart={};saveCart();updateCartCount();renderCart()}
function sendWhatsApp(){
  const ids=Object.keys(cart).map(Number);
  if(!ids.length){alert("Adicione pelo menos um produto.");return}
  let msg=`Olá! Gostaria de fazer um pedido pelo ${STORE_NAME}:%0A%0A`;
  ids.forEach(id=>{const p=products.find(x=>x.id===id);msg+=`• ${cart[id]}x ${p.name} — ${p.unit}%0A`});
  msg+=`%0AGostaria de confirmar disponibilidade, valores e condições de entrega.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`,"_blank");
}
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");currentCat=b.dataset.cat;renderProducts();
}));
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();updateCartCount();
