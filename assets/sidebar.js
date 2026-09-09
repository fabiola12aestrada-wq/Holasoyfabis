/* FLUX_AI — Menú lateral compartido.
   Incluir con: <script src="RUTA/assets/sidebar.js" defer></script>
   La ruta relativa del propio <script> se usa para calcular los enlaces,
   así que basta con incluir la etiqueta: no requiere configuración extra.
   Si la página tiene un <span id="flux-menu-mount"></span> dentro de su
   header, el botón hamburguesa se inserta ahí; si no existe, se crea un
   botón flotante fijo en la esquina superior izquierda. */
(function () {
  "use strict";

  // ---- 1. Calcular ruta base a partir del propio <script src="..."> ----
  var thisScript = document.currentScript;
  var src = thisScript ? thisScript.getAttribute("src") : "assets/sidebar.js";
  var base = src.replace(/assets\/sidebar\.js.*$/, ""); // ej: "../../"

  var ICONS = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/>',
    palette: '<circle cx="12" cy="12" r="9"/><circle cx="8.5" cy="10.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="8" r="1.1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="10.5" r="1.1" fill="currentColor" stroke="none"/><path d="M12 21a9 9 0 0 1 0-18 9 9 0 0 1 4 17c-1 .5-2-.2-2-1.3a1.7 1.7 0 0 1 .5-1.2 1.7 1.7 0 0 0 .5-1.2c0-1-1-1.6-2-1.6H12"/>',
    upload: '<path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
    render: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m9.5 9 5 3-5 3z" fill="currentColor" stroke="none"/>',
    storyboard: '<rect x="2.5" y="5" width="6" height="14" rx="1"/><rect x="9" y="5" width="6" height="14" rx="1"/><rect x="15.5" y="5" width="6" height="14" rx="1"/>',
    inventory: '<path d="M3 7h18v3H3z"/><path d="M4 10v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9"/><path d="M10 13.5h4"/>',
    gallery: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="m21 16-5-5-4 4-2-2-6 6"/>',
    profile: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.2-3.5 4-5.5 7-5.5s5.8 2 7 5.5"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 13a7.6 7.6 0 0 0 0-2l2-1.5-2-3.4-2.3.9a7.7 7.7 0 0 0-1.8-1l-.3-2.5H10l-.3 2.5a7.7 7.7 0 0 0-1.8 1l-2.3-.9-2 3.4L5.6 11a7.6 7.6 0 0 0 0 2l-2 1.6 2 3.4 2.3-.9c.5.4 1.1.8 1.8 1l.3 2.5h4l.3-2.5c.7-.2 1.3-.6 1.8-1l2.3.9 2-3.4-2-1.6Z"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
    close: '<path d="M18 6 6 18"/><path d="M6 6l12 12"/>',
    menu: '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>'
  };

  function icon(name, size) {
    return '<svg width="' + (size || 20) + '" height="' + (size || 20) +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round">' + ICONS[name] + "</svg>";
  }

  var NAV = [
    { icon: "home", label: "Inicio", href: base + "screens/inicio/index.html" },
    { icon: "palette", label: "Generador", href: base + "screens/generador/index.html" },
    { icon: "upload", label: "Subir", href: base + "screens/subir/index.html" },
    { icon: "render", label: "Renderizado", href: base + "screens/renderizado/index.html" },
    { icon: "storyboard", label: "Storyboard", href: base + "screens/storyboard/index.html" },
    { icon: "inventory", label: "Activos", href: base + "screens/activos/index.html" },
    { icon: "gallery", label: "Galería", href: base + "screens/galería/index.html" },
    { icon: "profile", label: "Perfil", href: base + "screens/perfil/index.html" },
    { icon: "settings", label: "Configuración", href: base + "screens/configuración/index.html" }
  ];

  // ---- 2. Estilos ----
  var style = document.createElement("style");
  style.textContent = [
    "#flux-sidebar-backdrop{position:fixed;inset:0;background:rgba(10,3,9,.55);backdrop-filter:blur(2px);z-index:99998;opacity:0;pointer-events:none;transition:opacity .25s ease;}",
    "#flux-sidebar-backdrop.open{opacity:1;pointer-events:auto;}",
    "#flux-sidebar-panel{position:fixed;top:0;left:0;bottom:0;width:280px;max-width:82vw;background:#2C0B29;border-right:1px solid rgba(255,73,193,.28);z-index:99999;transform:translateX(-100%);transition:transform .28s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;font-family:'Nunito',sans-serif;box-shadow:8px 0 30px rgba(0,0,0,.4);}",
    "#flux-sidebar-panel.open{transform:translateX(0);}",
    "#flux-sidebar-panel .flux-sb-head{display:flex;align-items:center;justify-content:space-between;padding:1.1rem 1.1rem .9rem;border-bottom:1px solid rgba(255,255,255,.08);}",
    "#flux-sidebar-panel .flux-sb-logo{color:#FFB3AE;font-weight:800;font-size:1.05rem;letter-spacing:.5px;display:flex;align-items:center;gap:.4rem;}",
    "#flux-sidebar-panel .flux-sb-logo span{color:#FF49C1;}",
    "#flux-sidebar-panel .flux-sb-close{background:transparent;border:none;color:rgba(255,255,255,.6);cursor:pointer;padding:.3rem;border-radius:8px;display:flex;}",
    "#flux-sidebar-panel .flux-sb-close:hover{color:#fff;background:rgba(255,255,255,.08);}",
    "#flux-sidebar-panel nav{flex:1;overflow-y:auto;padding:.75rem;display:flex;flex-direction:column;gap:.35rem;}",
    "#flux-sidebar-panel nav a{display:flex;align-items:center;gap:.8rem;padding:.75rem .9rem;border-radius:12px;color:#fff;text-decoration:none;font-size:.92rem;font-weight:600;opacity:.85;transition:all .15s ease;}",
    "#flux-sidebar-panel nav a:hover{background:rgba(255,255,255,.06);opacity:1;}",
    "#flux-sidebar-panel nav a.active{background:#FF49C1;opacity:1;box-shadow:0 4px 14px rgba(255,73,193,.35);}",
    "#flux-sidebar-panel nav a svg{flex-shrink:0;opacity:.9;}",
    "#flux-sidebar-panel .flux-sb-foot{border-top:1px solid rgba(255,255,255,.08);padding:.75rem;}",
    "#flux-sidebar-panel .flux-sb-logout{width:100%;display:flex;align-items:center;gap:.8rem;padding:.75rem .9rem;border-radius:12px;background:transparent;border:none;color:#FFB3AE;font-family:inherit;font-size:.92rem;font-weight:700;cursor:pointer;}",
    "#flux-sidebar-panel .flux-sb-logout:hover{background:rgba(255,73,193,.12);}",
    "#flux-menu-btn,.flux-menu-btn-floating{background:rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.12);color:#fff;width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;}",
    "#flux-menu-btn:hover,.flux-menu-btn-floating:hover{background:rgba(255,73,193,.25);}",
    ".flux-menu-btn-floating{position:fixed;top:14px;left:14px;z-index:9999;}"
  ].join("\n");
  document.head.appendChild(style);

  // ---- 3. Construir el panel + backdrop ----
  var backdrop = document.createElement("div");
  backdrop.id = "flux-sidebar-backdrop";

  var panel = document.createElement("div");
  panel.id = "flux-sidebar-panel";

  var here = window.location.pathname.replace(/\/$/, "");
  var navHtml = NAV.map(function (item) {
    var itemPath = item.href.replace(/^https?:\/\/[^/]+/, "");
    var isActive = here.indexOf(itemPath.replace(/^\.\.\//g, "").split("/").slice(-2).join("/")) !== -1;
    return '<a href="' + item.href + '" class="' + (isActive ? "active" : "") + '">' +
      icon(item.icon) + "<span>" + item.label + "</span></a>";
  }).join("");

  panel.innerHTML =
    '<div class="flux-sb-head">' +
      '<div class="flux-sb-logo">✦ FLUX<span>_AI</span></div>' +
      '<button class="flux-sb-close" aria-label="Cerrar menú">' + icon("close", 20) + "</button>" +
    "</div>" +
    "<nav>" + navHtml + "</nav>" +
    '<div class="flux-sb-foot">' +
      '<button class="flux-sb-logout">' + icon("logout") + "<span>Cerrar sesión</span></button>" +
    "</div>";

  document.body.appendChild(backdrop);
  document.body.appendChild(panel);

  function openMenu() {
    backdrop.classList.add("open");
    panel.classList.add("open");
  }
  function closeMenu() {
    backdrop.classList.remove("open");
    panel.classList.remove("open");
  }

  backdrop.addEventListener("click", closeMenu);
  panel.querySelector(".flux-sb-close").addEventListener("click", closeMenu);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  panel.querySelector(".flux-sb-logout").addEventListener("click", function () {
    try {
      Object.keys(localStorage)
        .filter(function (k) { return k.indexOf("sb-") === 0; })
        .forEach(function (k) { localStorage.removeItem(k); });
    } catch (e) {}
    window.location.href = base + "index.html";
  });

  // ---- 4. Botón hamburguesa: usar mount point si existe, si no, flotante ----
  var mount = document.getElementById("flux-menu-mount");
  var btn = document.createElement("button");
  btn.id = "flux-menu-btn";
  btn.setAttribute("aria-label", "Abrir menú");
  btn.innerHTML = icon("menu", 20);
  btn.addEventListener("click", openMenu);

  if (mount) {
    mount.appendChild(btn);
  } else {
    btn.className = "flux-menu-btn-floating";
    document.body.appendChild(btn);
  }
})();
