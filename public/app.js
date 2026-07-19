const menu=[
{n:'Chicken Shawarma',c:'Sandwiches',p:10.50,img:'chicken-shawarma.png',video:'meal-videos/chicken-shawarma.mp4',d:'Sliced chicken with garlic sauce and pickles.',opts:['No Pickles'],combo:true,badge:'⭐ Customer Favorite'},
{n:'Gyro Sandwich',c:'Sandwiches',p:10.50,img:'gyro-sandwich.png',video:'meal-videos/gyro-sandwich.mp4',d:'Sliced gyro meat with tzatziki sauce, tomatoes, and onions.',opts:['No Onion','No Tomato','No Sauce','Sauce on the Side'],combo:true},
{n:'Falafel Sandwich',c:'Sandwiches',p:8.35,img:'falafel-sandwich.png',video:'meal-videos/falafel-sandwich.mp4',d:'Crispy falafel, tomatoes, pickles, lettuce, hummus, and tahini sauce.',opts:['No Lettuce','No Tomato','No Pickles','No Tahini','No Hummus'],combo:true},
{n:'Chicken Crispy Wrap',c:'Sandwiches',p:10.50,img:'chicken-crispy-wrap.png',video:'meal-videos/chicken-crispy-wrap.mp4',d:'Crispy chicken tenders wrapped in a warm tortilla with lettuce, tomatoes, pickles, signature Habibi and garlic sauces, and creamy cheese sauce.',opts:['No Lettuce','No Pickles','No Tomato','No Habibi Sauce','No Garlic Sauce','No Cheese Sauce'],combo:true,badge:'NEW'},
{n:'Chicken Crispy Burger',c:'Burgers',p:10.50,img:'chicken-crispy-burger.png',video:'meal-videos/chicken-crispy-burger.mp4',d:'A juicy crispy chicken tender with lettuce, tomatoes, pickles, onions, creamy cheese sauce, and signature Habibi sauce on a toasted bun.',opts:['No Onion','No Lettuce','No Pickles','No Tomato','No Habibi Sauce','No Cheese Sauce'],combo:true,badge:'NEW'},
{n:'Classic Burger',c:'Burgers',p:10.50,img:'classic-burger.png',video:'meal-videos/classic-burger.mp4',d:'Juicy beef with sauce, lettuce, tomatoes, and pickles on a toasted bun.',opts:['No Onion','No Lettuce','No Pickles','No Tomato','No Sauce','No Cheese'],combo:true},
{n:'Chicken Over Rice',c:'Specials',p:13.70,img:'chicken-over-rice.jpg',video:'meal-videos/chicken-over-rice.mp4',d:'Seasoned rice topped with sliced chicken, lettuce, tomatoes, onions, and our special Habibi sauce. Includes a drink.',opts:['No Lettuce','No Onion','No Tomato','No Sauce','Sauce on the Side'],drink:true,badge:'⭐ Customer Favorite'},
{n:'Gyro Over Rice',c:'Specials',p:13.70,img:'gyro-over-rice.jpg',video:'meal-videos/gyro-over-rice.mp4',d:'Seasoned rice topped with sliced gyro, lettuce, tomatoes, onions, and our special Habibi sauce. Includes a drink.',opts:['No Lettuce','No Onion','No Tomato','No Sauce','Sauce on the Side'],drink:true},
{n:'Loaded Fries',c:'Specials',p:12.60,img:'loaded-fries.png',video:'meal-videos/loaded-fries.mp4',d:'Golden fries topped with crispy fried chicken bites, melted cheddar cheese, and our special sauce. Includes a drink.',opts:['No Cheese Sauce','No Habibi Sauce'],drink:true,badge:'🔥 BEST SELLER'},
{n:'Habibi Fried Chicken Meal',c:'Fried Chicken',p:15.90,img:'fried-chicken-meal.png',video:'meal-videos/fried-chicken-meal.mp4',d:'A half-chicken feast with breast, thigh, wing, and drumstick, served with fries, garlic sauce, spicy garlic sauce, Muhammara, and a drink.',opts:[],drink:true},
{n:'Chicken Tenders',c:'Fried Chicken',p:11.50,img:'chicken-tenders.png',video:'meal-videos/chicken-tenders.mp4',d:'Four crispy fried chicken strips served with garlic sauce and Muhammara on the side.',opts:[],combo:true},
{n:'Hummus',c:'Appetizers',p:5.20,img:'hummus.png',video:'meal-videos/hummus.mp4',d:'Creamy chickpea dip blended with tahini and lemon, served with two pieces of pita.',opts:[]},
{n:'Falafel 5 Pieces',c:'Appetizers',p:7.40,img:'falafel-5pc.png',video:'meal-videos/falafel-5pc.mp4',d:'Five crispy golden chickpea patties seasoned with Middle Eastern spices.',opts:[]},
{n:'Crepe',c:'Desserts',p:4.99,img:'crepe.jpeg',d:'Fresh crepe batter made with flour, sugar, vanilla, eggs, milk, a little oil, and a pinch of salt, filled with chocolate, cream, strawberries, and bananas.',opts:[],badge:'NEW'},
{n:'Chicken Meat',c:'Sides',p:3.50,img:'chicken-meat.png',d:'A side portion of seasoned chicken.',opts:[]},
{n:'Gyro Meat',c:'Sides',p:3.50,img:'gyro-meat.png',d:'A side portion of seasoned gyro meat.',opts:[]},
{n:'Side Rice',c:'Sides',p:3.50,img:'side-rice.png',d:'A warm side of seasoned rice.',opts:[]},
{n:'Muhammara',c:'Sides',p:3.50,img:'muhammara.jpg',d:'Traditional roasted red pepper and walnut dip.',opts:[]},
{n:'Pita Bread',c:'Sides',p:1.00,img:'pita.jpg',d:'Warm pita bread.',opts:[]},
{n:'Fries',c:'Sides',p:3.50,img:'fries.jpg',d:'Hot, crispy golden fries.',opts:[]}
];
const drinks=['Cola','Diet Cola','Sprite','Fanta','Water'];let active='All',cart=[];
const grid=document.querySelector('#menuGrid'),tabs=document.querySelector('#categoryTabs'),search=document.querySelector('#search');
const cats=['All',...new Set(menu.map(x=>x.c))];
cats.forEach(c=>{const b=document.createElement('button');b.textContent=c;b.className=c==='All'?'active':'';b.onclick=()=>{active=c;[...tabs.children].forEach(x=>x.classList.toggle('active',x===b));render()};tabs.appendChild(b)});
function render(){
  const q=search.value.trim().toLowerCase();
  const rows=menu.filter(x=>(active==='All'||x.c===active)&&(!q||`${x.n} ${x.c} ${x.d}`.toLowerCase().includes(q)));
  grid.innerHTML=rows.map(x=>`<article class="card" data-i="${menu.indexOf(x)}">${x.badge?`<span class="badge">${x.badge}</span>`:''}<div class="card-media"><img loading="lazy" src="assets/${x.img}" alt="${x.n}"></div><div class="card-body"><h3>${x.n}</h3><p>${x.d}</p><button class="learn" type="button">What is ${x.n}?</button><div class="price-row"><span class="price">$${x.p.toFixed(2)}</span><button class="add" type="button">Add</button></div></div></article>`).join('');
  document.querySelector('#empty').style.display=rows.length?'none':'block';
  document.querySelectorAll('.add').forEach(b=>b.onclick=e=>openItem(menu[+e.target.closest('.card').dataset.i],e.target.closest('.card').querySelector('img')));
  document.querySelectorAll('.learn').forEach(b=>b.onclick=e=>openInfo(menu[+e.target.closest('.card').dataset.i],e.target.closest('.card').querySelector('img')));
}
search.oninput=render;document.querySelector('#clearSearch').onclick=()=>{search.value='';render()};render();

function openInfo(item,imgEl){
  const body=document.querySelector('#infoModalBody');
  const media=item.video
    ? `<video class="meal-info-video" autoplay muted loop playsinline preload="metadata" poster="assets/${item.img}"><source src="assets/${item.video}" type="video/mp4"></video>`
    : `<img class="meal-info-image" src="assets/${item.img}" alt="${item.n}">`;
  body.innerHTML=`${media}<div class="meal-info-copy"><p class="eyebrow">${item.c}</p><div class="meal-info-title"><h2>${item.n}</h2><b class="price">$${item.p.toFixed(2)}</b></div><p>${item.d}</p><button class="modal-add info-order">Customize & Add to Cart</button></div>`;
  body.querySelector('.info-order').onclick=()=>{closeInfo();openItem(item,imgEl)};
  document.querySelector('#infoModal').classList.add('open');
  document.querySelector('#backdrop').classList.add('open');
}
function closeInfo(){
  const info=document.querySelector('#infoModal');
  info.classList.remove('open');
  const video=info.querySelector('video');if(video){video.pause();video.currentTime=0;}
  if(!document.querySelector('#modal').classList.contains('open')&&!document.querySelector('#cartDrawer').classList.contains('open'))document.querySelector('#backdrop').classList.remove('open');
}
document.querySelector('#closeInfoModal').onclick=closeInfo;

function openItem(item,imgEl){const body=document.querySelector('#modalBody');body.innerHTML=`<div class="modal-top"><img src="assets/${item.img}"><div><p class="eyebrow">${item.c}</p><h2>${item.n}</h2><b class="price">$${item.p.toFixed(2)}</b></div></div>${item.opts.length?`<div class="option-group"><h4>Customize</h4>${item.opts.map(o=>`<label><input type="checkbox" name="opt" value="${o}"> ${o}</label>`).join('')}</div>`:''}${item.combo?`<div class="option-group"><h4>Make it a Combo</h4><label><input id="combo" type="checkbox"> Add Fries + Drink (+$2.99)</label></div>`:''}<div class="option-group drink-options ${item.drink?'show':''}" id="drinks"><h4>${item.drink?'Choose Your Free Drink':'Choose Your Drink'}</h4>${drinks.map((d,i)=>`<label><input type="radio" name="drink" value="${d}" ${i===0?'checked':''}> ${d}</label>`).join('')}</div><div class="option-group"><h4>Special Instructions</h4><textarea id="notes" placeholder="Anything else we should know?"></textarea></div><button class="modal-add">Add to Cart • $<span id="modalPrice">${item.p.toFixed(2)}</span></button>`;
const combo=body.querySelector('#combo');if(combo)combo.onchange=()=>{body.querySelector('#drinks').classList.toggle('show',combo.checked);body.querySelector('#modalPrice').textContent=(item.p+(combo.checked?2.99:0)).toFixed(2)};
body.querySelector('.modal-add').onclick=()=>{const opts=[...body.querySelectorAll('input[name=opt]:checked')].map(x=>x.value);const dr=body.querySelector('input[name=drink]:checked');const isCombo=combo?.checked||false;cart.push({...item,final:item.p+(isCombo?2.99:0),custom:[...opts,isCombo?'Combo (+$2.99)':null,dr&&(item.drink||isCombo)?dr.value:null,body.querySelector('#notes').value].filter(Boolean)});closeModal();updateCart();fly(imgEl)};document.querySelector('#modal').classList.add('open');document.querySelector('#backdrop').classList.add('open')}
function closeModal(){document.querySelector('#modal').classList.remove('open');if(!document.querySelector('#cartDrawer').classList.contains('open')&&!document.querySelector('#infoModal').classList.contains('open'))document.querySelector('#backdrop').classList.remove('open')}
document.querySelector('#closeModal').onclick=closeModal;
function fly(img){const r=img.getBoundingClientRect(),c=document.querySelector('#cartButton').getBoundingClientRect(),f=img.cloneNode();f.className='fly';Object.assign(f.style,{left:r.left+'px',top:r.top+'px',width:'70px',height:'70px',objectFit:'cover'});document.body.appendChild(f);requestAnimationFrame(()=>Object.assign(f.style,{left:c.left+'px',top:c.top+'px',width:'20px',height:'20px',opacity:.2}));setTimeout(()=>{f.remove();document.querySelector('#cartButton').classList.add('shake');setTimeout(()=>document.querySelector('#cartButton').classList.remove('shake'),450)},760)}
function updateCart(){document.querySelector('#cartCount').textContent=cart.length;document.querySelector('#cartItems').innerHTML=cart.length?cart.map((x,i)=>`<div class="cart-item"><img src="assets/${x.img}"><div><b>${x.n}</b><p>${x.custom.join(' • ')||'Standard'}</p><strong>$${x.final.toFixed(2)}</strong></div><button data-r="${i}">×</button></div>`).join(''):'<p style="color:#888;text-align:center;padding:50px 10px">Your cart is empty.</p>';document.querySelector('#subtotal').textContent='$'+cart.reduce((a,x)=>a+x.final,0).toFixed(2);document.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{cart.splice(+b.dataset.r,1);updateCart()})}
function openCart(){document.querySelector('#cartDrawer').classList.add('open');document.querySelector('#backdrop').classList.add('open')}function closeCart(){document.querySelector('#cartDrawer').classList.remove('open');if(!document.querySelector('#modal').classList.contains('open')&&!document.querySelector('#infoModal').classList.contains('open'))document.querySelector('#backdrop').classList.remove('open')}document.querySelector('#cartButton').onclick=openCart;document.querySelector('#closeCart').onclick=closeCart;updateCart();
function status(){const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());const get=t=>parts.find(p=>p.type===t)?.value;const day=get('weekday'),mins=+get('hour')*60 + +get('minute');let open=false;if(['Tue','Wed','Sun'].includes(day))open=mins>=990;if(['Thu','Fri','Sat'].includes(day))open=mins>=990||mins<150;const el=document.querySelector('#status');el.className='status '+(open?'open':'closed');el.querySelector('b').textContent=open?'OPEN NOW':'CLOSED'}status();setInterval(status,60000);
setTimeout(()=>{const w=document.querySelector('#welcome');w.classList.add('show');setTimeout(()=>w.classList.remove('show'),2200)},500);
const obs=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.12});document.querySelectorAll('.reveal').forEach(x=>obs.observe(x));document.querySelectorAll('[data-filter]').forEach(a=>a.onclick=()=>{active=a.dataset.filter;[...tabs.children].forEach(x=>x.classList.toggle('active',x.textContent===active));render()});


// Delivery partner modal
function openDelivery(){
  document.querySelector('#deliveryModal').classList.add('open');
  document.querySelector('#backdrop').classList.add('open');
}
function closeDelivery(){
  const modal=document.querySelector('#deliveryModal');
  if(modal) modal.classList.remove('open');
  if(!document.querySelector('#modal').classList.contains('open')&&!document.querySelector('#infoModal').classList.contains('open')&&!document.querySelector('#cartDrawer').classList.contains('open')&&!document.querySelector('#checkoutModal').classList.contains('open')&&!document.querySelector('#successModal').classList.contains('open'))document.querySelector('#backdrop').classList.remove('open');
}
document.querySelector('#openDelivery').onclick=openDelivery;
document.querySelector('#closeDelivery').onclick=closeDelivery;

// ---- Square checkout: tax, tips, cards, Apple Pay and Google Pay ----
const TAX_RATE = 0.0968;
let squareCard = null;
let squareApplePay = null;
let squareGooglePay = null;
let squarePaymentRequest = null;
let squarePayments = null;
let squareReady = false;
let squareConfig = null;
let selectedTipPercent = 0;

function money(value){ return `$${Number(value).toFixed(2)}`; }
function cartSubtotal(){ return cart.reduce((sum,item)=>sum + Number(item.final || 0) * Number(item.quantity || 1), 0); }
function checkoutTotals(){
  const subtotal=cartSubtotal();
  const tax=Math.round(subtotal*TAX_RATE*100)/100;
  const tip=Math.round(subtotal*(selectedTipPercent/100)*100)/100;
  const total=Math.round((subtotal+tax+tip)*100)/100;
  return {subtotal,tax,tip,total};
}
function setPaymentStatus(message='', type=''){
  const el=document.querySelector('#paymentStatus');
  if(!el) return;
  el.textContent=message;
  el.className=`payment-status ${type}`.trim();
}
function updateCheckoutTotals(){
  const totals=checkoutTotals();
  document.querySelector('#checkoutSubtotal').textContent=money(totals.subtotal);
  document.querySelector('#checkoutTax').textContent=money(totals.tax);
  document.querySelector('#checkoutTip').textContent=money(totals.tip);
  document.querySelector('#checkoutTotal').textContent=money(totals.total);
  document.querySelector('#payTotal').textContent=money(totals.total);
  if(squarePaymentRequest){
    try{squarePaymentRequest.update({total:{amount:totals.total.toFixed(2),label:'Habibi Grill'}})}catch(_){ }
  }
}
function loadScript(src){
  return new Promise((resolve,reject)=>{
    const existing=[...document.scripts].find(s=>s.src===src);
    if(existing){ if(window.Square) resolve(); else existing.addEventListener('load',resolve,{once:true}); return; }
    const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=()=>reject(new Error('Could not load Square payment form.'));document.head.appendChild(script);
  });
}
async function initializeSquare(){
  if(squareReady){updateCheckoutTotals();return;}
  setPaymentStatus('Connecting securely to Square…');
  const response=await fetch('/api/config');
  const config=await response.json();
  if(!response.ok) throw new Error(config.error || 'Square is not configured yet.');
  squareConfig=config;
  const sdkUrl=config.environment==='production'?'https://web.squarecdn.com/v1/square.js':'https://sandbox.web.squarecdn.com/v1/square.js';
  await loadScript(sdkUrl);
  if(!window.Square) throw new Error('Square payment SDK did not load.');
  squarePayments=window.Square.payments(config.applicationId,config.locationId);
  squareCard=await squarePayments.card();
  await squareCard.attach('#card-container');

  const totals=checkoutTotals();
  squarePaymentRequest=squarePayments.paymentRequest({
    countryCode:'US',currencyCode:'USD',
    total:{amount:totals.total.toFixed(2),label:'Habibi Grill'}
  });

  const appleButton=document.querySelector('#applePayButton');
  try{
    squareApplePay=await squarePayments.applePay(squarePaymentRequest);
    appleButton.hidden=false;
  }catch(_){appleButton.hidden=true;}

  const googleContainer=document.querySelector('#google-pay-button');
  try{
    squareGooglePay=await squarePayments.googlePay(squarePaymentRequest);
    googleContainer.hidden=false;
    await squareGooglePay.attach('#google-pay-button');
  }catch(_){googleContainer.hidden=true;}

  squareReady=true;
  document.querySelector('#payButton').disabled=false;
  setPaymentStatus(config.environment==='sandbox'?'Sandbox test mode — no real charge will be made.':'');
}
async function openCheckout(){
  if(!cart.length){openCart();return;}
  closeCart();
  selectedTipPercent=0;
  document.querySelectorAll('[data-tip]').forEach(b=>b.classList.toggle('active',b.dataset.tip==='0'));
  updateCheckoutTotals();
  document.querySelector('#checkoutModal').classList.add('open');
  document.querySelector('#backdrop').classList.add('open');
  try{ await initializeSquare(); }
  catch(error){ setPaymentStatus(error.message,'error'); document.querySelector('#payButton').disabled=true; }
}
function closeCheckout(){
  document.querySelector('#checkoutModal').classList.remove('open');
  if(!document.querySelector('#modal').classList.contains('open')&&!document.querySelector('#cartDrawer').classList.contains('open')&&!document.querySelector('#successModal').classList.contains('open'))document.querySelector('#backdrop').classList.remove('open');
}
function customerPayload(){
  return {
    name:document.querySelector('#customerName').value.trim(),
    phone:document.querySelector('#customerPhone').value.trim(),
    email:document.querySelector('#customerEmail').value.trim()
  };
}
function validateCustomer(){
  const customer=customerPayload();
  if(!customer.name || !customer.phone){setPaymentStatus('Please enter your name and phone number.','error');return null;}
  return customer;
}
async function completePayment(sourceId,paymentMethod){
  const customer=validateCustomer();
  if(!customer)return;
  const button=document.querySelector('#payButton');
  button.disabled=true;setPaymentStatus('Authorizing payment securely…');
  try{
    const response=await fetch('/api/checkout',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        sourceId,cart,customer,tipPercent:selectedTipPercent,
        smsConsent:document.querySelector('#smsConsent').checked,
        paymentMethod
      })
    });
    const result=await response.json();
    if(!response.ok)throw new Error(result.error||'Payment failed.');
    closeCheckout();
    document.querySelector('#successDetails').innerHTML=`<p><b>Subtotal:</b> ${money((result.subtotal||0)/100)}</p><p><b>Tax:</b> ${money((result.tax||0)/100)}</p><p><b>Tip:</b> ${money((result.tip||0)/100)}</p><p><b>Total:</b> ${money((result.total||0)/100)}</p><p><b>Status:</b> ${result.status||'COMPLETED'}</p><p class="text-note">Text updates will be sent when your order is being prepared, ready, and picked up.</p>`;
    const receipt=document.querySelector('#receiptLink');
    if(result.receiptUrl){receipt.href=result.receiptUrl;receipt.hidden=false}else receipt.hidden=true;
    document.querySelector('#successModal').classList.add('open');document.querySelector('#backdrop').classList.add('open');
    cart=[];updateCart();
  }catch(error){setPaymentStatus(error.message,'error');}
  finally{button.disabled=!squareReady;button.innerHTML=`Pay <span id="payTotal">${money(checkoutTotals().total)}</span>`;}
}
async function submitCardPayment(){
  const customer=validateCustomer();
  if(!customer)return;
  if(!squareCard){setPaymentStatus('Square payment form is not ready.','error');return;}
  const button=document.querySelector('#payButton');button.disabled=true;button.textContent='Processing…';
  try{
    const totals=checkoutTotals();
    const tokenResult=await squareCard.tokenize({
      amount:totals.total.toFixed(2),currencyCode:'USD',intent:'CHARGE',
      customerInitiated:true,sellerKeyedIn:false,
      billingContact:{givenName:customer.name,email:customer.email,phone:customer.phone}
    });
    if(tokenResult.status!=='OK')throw new Error((tokenResult.errors||[]).map(e=>e.message).join(' ')||'Card details could not be verified.');
    await completePayment(tokenResult.token,'card');
  }catch(error){setPaymentStatus(error.message,'error');button.disabled=false;button.innerHTML=`Pay <span id="payTotal">${money(checkoutTotals().total)}</span>`;}
}
async function submitWallet(method){
  if(!validateCustomer())return;
  const wallet=method==='apple_pay'?squareApplePay:squareGooglePay;
  if(!wallet){setPaymentStatus(`${method==='apple_pay'?'Apple Pay':'Google Pay'} is not available on this device.`,'error');return;}
  try{
    setPaymentStatus(`Opening ${method==='apple_pay'?'Apple Pay':'Google Pay'}…`);
    const tokenResult=await wallet.tokenize();
    if(tokenResult.status!=='OK')throw new Error((tokenResult.errors||[]).map(e=>e.message).join(' ')||'Digital wallet payment was canceled.');
    await completePayment(tokenResult.token,method);
  }catch(error){setPaymentStatus(error.message,'error');}
}
function closeSuccess(){document.querySelector('#successModal').classList.remove('open');document.querySelector('#backdrop').classList.remove('open')}

document.querySelectorAll('[data-tip]').forEach(button=>button.onclick=()=>{
  selectedTipPercent=Number(button.dataset.tip);
  document.querySelectorAll('[data-tip]').forEach(b=>b.classList.toggle('active',b===button));
  updateCheckoutTotals();
});
document.querySelector('#checkoutButton').onclick=openCheckout;
document.querySelector('#closeCheckout').onclick=closeCheckout;
document.querySelector('#payButton').onclick=submitCardPayment;
document.querySelector('#applePayButton').onclick=()=>submitWallet('apple_pay');
document.querySelector('#google-pay-button').addEventListener('click',()=>submitWallet('google_pay'));
document.querySelector('#closeSuccess').onclick=closeSuccess;
document.querySelector('#backdrop').onclick=()=>{closeDelivery();closeInfo();closeModal();closeCart();closeCheckout();closeSuccess()};
