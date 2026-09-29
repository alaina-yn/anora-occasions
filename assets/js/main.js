// Anora Occasions — interactive bits (no build, no dependency)
(function(){
  "use strict";
  var $ = function(s,c){ return (c||document).querySelector(s); };
  var $$ = function(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); };

  // Year
  $$("[data-year]").forEach(function(el){ el.textContent = new Date().getFullYear(); });

  // Mobile nav
  var burger = $("#burger"), navLinks = $("#navLinks");
  if(burger && navLinks){ burger.addEventListener("click", function(){ navLinks.classList.toggle("mobile-open"); }); }

  // Active nav
  var path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  $$("#navLinks a").forEach(function(a){
    var href = (a.getAttribute("href")||"").toLowerCase();
    if(href === path || (path === "" && href === "index.html")) a.classList.add("active");
  });

  // Reveal on scroll
  var io = ("IntersectionObserver" in window) ? new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  },{threshold:.12}) : null;
  $$(".reveal").forEach(function(el){ if(io) io.observe(el); else el.classList.add("in"); });

  // FAQ accordion
  $$(".faq > button").forEach(function(btn){
    btn.addEventListener("click", function(){
      var item = btn.parentElement, open = item.classList.contains("open");
      $$(".faq.open").forEach(function(f){ f.classList.remove("open"); });
      if(!open) item.classList.add("open");
    });
  });

  /* ---------- MENU DATA ---------- */
  var MENU = {
    mains:[
      {id:"m1", name:"Nasi Kerabu with Ayam Percik", price:9, tag:"Malaysian favourite"},
      {id:"m2", name:"Beef Rendang + Steamed Rice", price:11, tag:"Crowd pleaser"},
      {id:"m3", name:"Butter Chicken + Naan", price:10, tag:"Mild & creamy"},
      {id:"m4", name:"Sweet & Sour Fish + Rice", price:9, tag:"Light option"},
      {id:"m5", name:"Vegetarian Nasi Lemak", price:7, tag:"Vegetarian"},
      {id:"m6", name:"Chicken Satay (6 sticks)", price:8, tag:"Grilled live"}
    ],
    sides:[
      {id:"s1", name:"Rojak Buah", price:4, tag:"Fresh"},
      {id:"s2", name:"Spring Rolls (3 pcs)", price:3, tag:"Crispy"},
      {id:"s3", name:"Cucur Udang", price:4, tag:"Local snack"},
      {id:"s4", name:"Garden Salad + Dressing", price:3, tag:"Healthy"},
      {id:"s5", name:"Kuih Assortment (3 pcs)", price:4, tag:"Dessert bite"}
    ],
    desserts:[
      {id:"d1", name:"Dessert Station (cakes + macarons)", price:8, tag:"Premium"},
      {id:"d2", name:"Cendol Cups", price:4, tag:"Local classic"},
      {id:"d3", name:"Fresh Fruit Platter", price:3, tag:"Light"},
      {id:"d4", name:"Teh Tarik / Coffee Service", price:2, tag:"Drinks"}
    ],
    staffing:[
      {id:"st1", name:"On-site service staff", price:6, tag:"Per guest"},
      {id:"st2", name:"Full table styling", price:5, tag:"Per guest"},
      {id:"st3", name:"Live cooking station", price:7, tag:"Per guest"}
    ]
  };
  var PACKAGES = {
    casual:{name:"Casual Gathering", base:35, min:10, max:30},
    celebration:{name:"Celebration", base:55, min:30, max:100},
    grand:{name:"Grand Affair", base:75, min:100, max:500}
  };

  function money(n){ return "RM " + (Math.round(n*100)/100).toLocaleString("en-MY"); }

  // Menu builder (used on index + services)
  $$("[data-builder]").forEach(function(root){
    var listEl = $("[data-dish-list]", root);
    var pkgSel = $("[data-pkg]", root);
    var guestInput = $("[data-guests]", root);
    var sel = {};
    var cat = "mains";
    var dishes = MENU.mains.concat(MENU.sides, MENU.desserts, MENU.staffing);

    function renderTabs(){
      var tabs = $$("[data-cat]", root);
      tabs.forEach(function(t){
        if(t.getAttribute("data-cat") === cat) t.classList.add("on"); else t.classList.remove("on");
        t.onclick = function(){ cat = t.getAttribute("data-cat"); renderList(); renderTabs(); };
      });
    }
    function renderList(){
      var items = MENU[cat] || [];
      listEl.innerHTML = "";
      items.forEach(function(d){
        var row = document.createElement("div"); row.className = "dish";
        var left = document.createElement("div");
        left.innerHTML = "<strong>"+d.name+"</strong><br><span class='muted' style='font-size:.85rem'>"+d.tag+" · +"+money(d.price)+" / guest</span>";
        var btn = document.createElement("button"); btn.type="button";
        btn.textContent = sel[d.id] ? "Added ✓" : "Add";
        if(sel[d.id]) btn.classList.add("on");
        btn.onclick = function(){ if(sel[d.id]) delete sel[d.id]; else sel[d.id]=d; renderList(); renderTotal(); };
        row.appendChild(left); row.appendChild(btn); listEl.appendChild(row);
      });
    }
    function renderTotal(){
      var pkg = PACKAGES[pkgSel.value] || PACKAGES.celebration;
      var guests = Math.max(10, parseInt(guestInput.value||"50",10) || 50);
      var addons = Object.keys(sel).reduce(function(s,k){ return s + sel[k].price; }, 0);
      var perGuest = pkg.base + addons;
      var total = perGuest * guests;
      var tables = Math.ceil(guests/10);
      var perTable = total / tables;
      $("[data-per-guest]", root).textContent = money(perGuest);
      $("[data-total]", root).textContent = money(total);
      $("[data-per-table]", root).textContent = money(perTable);
      $("[data-tables]", root).textContent = tables + " tables · " + guests + " guests";
      $("[data-pkg-name]", root).textContent = pkg.name;
      var quoteBtn = $("[data-quote]", root);
      if(quoteBtn){
        quoteBtn.href = "contact.html?package="+encodeURIComponent(pkg.name)+"&guests="+guests+"&estimate="+encodeURIComponent(money(total));
      }
    }
    pkgSel.addEventListener("change", renderTotal);
    guestInput.addEventListener("input", renderTotal);
    renderTabs(); renderList(); renderTotal();
  });

  // Headcount / portion calculator
  $$("[data-portions]").forEach(function(root){
    var g = $("[data-p-guests]", root);
    function calc(){
      var guests = Math.max(10, parseInt(g.value||"50",10)||50);
      var rice = (guests*0.12).toFixed(1);
      var chicken = Math.ceil(guests*1.2);
      var kuih = Math.ceil(guests*2);
      var drinks = (guests*0.5).toFixed(1);
      var staff = Math.max(2, Math.ceil(guests/25));
      $("[data-p-rice]", root).textContent = rice + " kg";
      $("[data-p-chicken]", root).textContent = chicken + " pcs";
      $("[data-p-kuih]", root).textContent = kuih + " pcs";
      $("[data-p-drinks]", root).textContent = drinks + " L";
      $("[data-p-staff]", root).textContent = staff + " crew";
      $("[data-p-tables]", root).textContent = Math.ceil(guests/10) + " tables";
    }
    g.addEventListener("input", calc); calc();
  });

  // Gallery filter + lightbox
  var filters = $$("[data-filter]");
  if(filters.length){
    filters.forEach(function(b){
      b.addEventListener("click", function(){
        filters.forEach(function(x){ x.classList.remove("on"); });
        b.classList.add("on");
        var f = b.getAttribute("data-filter");
        $$("[data-g-item]").forEach(function(item){
          item.style.display = (f === "all" || item.getAttribute("data-g-item") === f) ? "" : "none";
        });
      });
    });
    var lb = $("#lightbox"), lbImg = $("#lightboxImg"), lbCap = $("#lightboxCap");
    $$("[data-g-item] img").forEach(function(img){
      img.style.cursor = "zoom-in";
      img.addEventListener("click", function(){
        var fig = img.closest("figure");
        lbImg.src = img.src; lbImg.alt = img.alt;
        lbCap.textContent = (fig && fig.querySelector("figcaption")) ? fig.querySelector("figcaption").textContent : img.alt;
        lb.classList.add("open");
      });
    });
    if(lb){ lb.addEventListener("click", function(){ lb.classList.remove("open"); }); }
  }

  // Contact form: prefill from query, validate, mailto fallback
  var form = $("#inquiryForm");
  if(form){
    var q = new URLSearchParams(location.search);
    if(q.get("package")){ var p = $("#fEvent"); if(p) p.value = q.get("package") + " inquiry"; }
    if(q.get("guests")){ var gg = $("#fGuests"); if(gg) gg.value = q.get("guests"); }
    if(q.get("estimate")){ var m = $("#fMsg"); if(m) m.value = "Hi Anora! Estimated total from menu builder: " + q.get("estimate") + ". "; }
    form.addEventListener("submit", function(ev){
      ev.preventDefault();
      var name = $("#fName").value.trim(), email = $("#fEmail").value.trim(),
          event = $("#fEvent").value, date = $("#fDate").value,
          guests = $("#fGuests").value, msg = $("#fMsg").value.trim();
      var ok = name && email && /.+@.+\..+/.test(email) && msg;
      var note = $("#formNote"), success = $("#formSuccess");
      if(!ok){ note.textContent = "Please add your name, a valid email, and a short message."; return; }
      try{ localStorage.setItem("anora-inquiry", JSON.stringify({name:name,email:email,event:event,date:date,guests:guests,msg:msg,at:new Date().toISOString()})); }catch(e){}
      success.classList.add("show");
      success.innerHTML = "<strong>Thanks, "+name.split(" ")[0]+"!</strong> Your inquiry is ready. We usually reply within one business day. A copy has opened in your email app — just hit send.";
      note.textContent = "";
      form.reset();
      var subject = encodeURIComponent("Event inquiry — " + event + " — " + name);
      var body = encodeURIComponent("Name: "+name+"\nEmail: "+email+"\nEvent: "+event+"\nDate: "+date+"\nGuests: "+guests+"\n\n"+msg);
      window.location.href = "mailto:abdullahalowasi369@gmail.com?subject="+subject+"&body="+body;
    });
  }
})();
