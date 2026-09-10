<!DOCTYPE html>
<html class="dark" lang="es"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "primary-fixed": "#FFE3F5",
                    "surface-container": "#551A4D",
                    "surface-container-high": "#6A1452",
                    "on-secondary-fixed-variant": "#44113E",
                    "inverse-surface": "#FFE3F5",
                    "error": "#ffb4ab",
                    "outline": "#A5698F",
                    "surface-container-low": "#3A0D35",
                    "secondary-fixed-dim": "#F5E97A",
                    "on-tertiary-fixed-variant": "#5C3A56",
                    "background": "#44113E",
                    "on-background": "#FFFFFF",
                    "tertiary-container": "#6A1452",
                    "tertiary": "#D8BFD3",
                    "primary-container": "#FF49C1",
                    "on-secondary-fixed": "#44113E",
                    "on-error": "#690005",
                    "surface-container-highest": "#7C2464",
                    "primary": "#FFB3AE",
                    "secondary": "#FFF7AD",
                    "surface": "#44113E",
                    "on-primary-container": "#ffffff",
                    "on-secondary": "#44113E",
                    "on-primary-fixed": "#5C0F4E",
                    "on-tertiary-fixed": "#2A0A26",
                    "surface-dim": "#3A0D35",
                    "on-tertiary": "#2A0A26",
                    "inverse-primary": "#C72E96",
                    "secondary-fixed": "#FFF7AD",
                    "inverse-on-surface": "#3A0D35",
                    "on-surface": "#FFFFFF",
                    "primary-fixed-dim": "#FFB3AE",
                    "on-error-container": "#ffdad6",
                    "on-primary": "#5C0F4E",
                    "error-container": "#93000a",
                    "on-surface-variant": "#D9B8D1",
                    "on-tertiary-container": "#ffffff",
                    "secondary-container": "#FFF7AD",
                    "surface-variant": "#6A1452",
                    "tertiary-fixed": "#F0DCED",
                    "on-secondary-container": "#44113E",
                    "surface-bright": "#8A2B70",
                    "on-primary-fixed-variant": "#7A1A63",
                    "tertiary-fixed-dim": "#D8BFD3",
                    "surface-tint": "#FF49C1",
                    "surface-container-lowest": "#2E0B29",
                    "outline-variant": "#6A1452"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "unit": "4px",
                    "stack-md": "16px",
                    "gutter": "16px",
                    "margin-mobile": "20px",
                    "stack-sm": "8px",
                    "stack-lg": "32px"
            },
            "fontFamily": {
                    "body-lg": ["Nunito"],
                    "body-sm": ["Nunito"],
                    "headline-md": ["Nunito"],
                    "display-lg": ["Nunito"],
                    "label-caps": ["Nunito"]
            },
            "fontSize": {
                    "body-lg": ["Nunito"],
                    "body-sm": ["Nunito"],
                    "headline-md": ["Nunito"],
                    "display-lg": ["Nunito"],
                    "label-caps": ["Nunito"]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-panel {
            background: rgba(26, 26, 27, 0.8);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .neon-pulse { box-shadow: 0 0 15px rgba(255,247,173,0.4); }
        body { min-height: max(884px, 100dvh); }

        .scene-thumb {
            width: 64px; height: 64px; border-radius: 10px; overflow: hidden;
            flex-shrink: 0; position: relative; background: #0e0e0f;
            border: 2px solid transparent;
        }
        .scene-thumb.done { border-color: #FFF7AD; }
        .scene-thumb.pending { border-color: rgba(255,255,255,0.1); }
        .scene-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .scene-thumb .thumb-status {
            position: absolute; bottom: 2px; right: 2px;
            width: 16px; height: 16px; border-radius: 9999px;
            display: flex; align-items: center; justify-content: center;
            font-size: 10px;
        }
        .thumb-status.done { background: #FFF7AD; color: #003739; }
        .thumb-status.pending { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.5); }

        button:disabled { opacity: 0.5; cursor: not-allowed; }
        #estado-render { text-align: center; font-size: 13px; color: rgba(255,255,255,0.5); margin-top: 8px; }
        #estado-render.error { color: #ffb4ab; }
    </style>
  <script src="../../assets/sidebar.js" defer></script>
</head>
<body class="bg-surface-dim text-on-surface font-body-lg min-h-screen flex flex-col">
<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 flex justify-between items-center px-5 h-16 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_15px_rgba(255,73,193,0.1)]">
<div class="flex items-center gap-stack-md">
<span class="text-xl font-bold bg-gradient-to-r from-[#FF49C1] to-[#FFF7AD] bg-clip-text text-transparent font-headline-md tracking-tighter">FLUX_AI</span>
</div>
<div class="flex items-center gap-gutter">
<button class="text-white/70 hover:text-[#FFF7AD] transition-colors active:scale-95 duration-200">
<span class="material-symbols-outlined">notifications</span>
</button>
<div class="w-8 h-8 rounded-full border border-primary-container overflow-hidden flex items-center justify-center bg-zinc-800">
<span class="material-symbols-outlined text-zinc-500 text-lg">person</span>
</div>
</div>
</header>
<!-- Main Content -->
<main class="flex-1 mt-16 mb-20 px-margin-mobile pt-stack-lg max-w-4xl mx-auto w-full">

<!-- Preview: filmstrip de escenas en orden + video final -->
<section class="mb-stack-lg">
<div class="relative glass-panel rounded-xl overflow-hidden shadow-2xl p-stack-md">
<div class="flex items-center justify-between mb-stack-md">
<div class="relative w-16 h-16 flex-shrink-0">
<svg class="w-16 h-16 -rotate-90" viewbox="0 0 64 64">
<circle cx="32" cy="32" fill="none" r="28" stroke="rgba(255,255,255,0.1)" stroke-width="6"></circle>
<circle cx="32" cy="32" fill="none" id="progress-ring" r="28" stroke="#FFF7AD" stroke-dasharray="176" stroke-dashoffset="176" stroke-linecap="round" stroke-width="6"></circle>
</svg>
<div class="absolute inset-0 flex items-center justify-center">
<span id="progress-percent" class="text-secondary-container font-headline-md text-sm">0%</span>
</div>
</div>
<div class="flex-1 ml-stack-md">
<p id="render-title" class="text-label-caps font-label-caps text-secondary-fixed tracking-widest">CARGANDO STORYBOARD...</p>
<p id="render-subtitle" class="text-body-sm text-white/40 mt-1">—</p>
</div>
</div>
<!-- Filmstrip de miniaturas en orden -->
<div id="filmstrip" class="flex gap-2 overflow-x-auto pb-1 mb-stack-md"></div>
<!-- Preview del video final (aparece cuando está listo) -->
<video id="video-preview" class="w-full rounded-lg hidden" controls="" loop=""></video>
</div>
</section>

<!-- Lista de escenas con estado real -->
<section class="flex flex-col gap-stack-sm mb-stack-lg" id="scene-status-list"></section>

<p id="estado-render"></p>

<!-- Actions -->
<section class="flex flex-col sm:flex-row gap-stack-md mt-stack-md">
<button id="btn-download" class="flex-1 py-4 px-stack-lg rounded-xl bg-primary-container text-on-primary-container font-headline-md flex items-center justify-center gap-stack-sm" disabled="">
<span class="material-symbols-outlined">download</span>
<span>Descargar Video</span>
</button>
<button id="btn-share" class="flex-1 py-4 px-stack-lg rounded-xl glass-panel border border-secondary-container/50 text-secondary-container font-headline-md flex items-center justify-center gap-stack-sm hover:bg-secondary-container/10 transition-all" disabled="">
<span class="material-symbols-outlined">share</span>
<span>Compartir</span>
</button>
</section>

</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 w-full z-50 flex justify-around items-center h-20 pb-safe px-6 bg-[#1A1A1B]/80 backdrop-blur-2xl border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] rounded-t-2xl">
<a class="flex flex-col items-center justify-center text-white/40 hover:text-[#FFF7AD] transition-colors" href="../inicio/index.html">
<span class="material-symbols-outlined">video_library</span>
<span class="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest mt-1">Projects</span>
</a>
<a class="flex flex-col items-center justify-center text-white/40 hover:text-[#FFF7AD] transition-colors" href="../storyboard/index.html">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">add_circle</span>
<span class="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest mt-1">Create</span>
</a>
<a class="flex flex-col items-center justify-center text-white/40 hover:text-[#FFF7AD] transition-colors" href="../activos/index.html">
<span class="material-symbols-outlined">folder_copy</span>
<span class="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest mt-1">Assets</span>
</a>
<a class="flex flex-col items-center justify-center text-white/40 hover:text-[#FFF7AD] transition-colors" href="../perfil/index.html">
<span class="material-symbols-outlined">account_circle</span>
<span class="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest mt-1">Profile</span>
</a>
</nav>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
(function () {
  const SUPABASE_URL = "https://ddyqisycapjtziiqytji.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_vP5c7xHOl4MwIHRCTkFC0w_DOut5s96";

  let sbClient = null;
  try {
    sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.error("No se pudo inicializar Supabase:", e);
  }

  const filmstrip = document.getElementById("filmstrip");
  const sceneList = document.getElementById("scene-status-list");
  const estado = document.getElementById("estado-render");
  const renderTitle = document.getElementById("render-title");
  const renderSubtitle = document.getElementById("render-subtitle");
  const progressRing = document.getElementById("progress-ring");
  const progressPercent = document.getElementById("progress-percent");
  const btnDownload = document.getElementById("btn-download");
  const btnShare = document.getElementById("btn-share");

  const RING_CIRCUMFERENCE = 176; // 2 * PI * 28, redondeado

  let scenes = [];
  let finalBlob = null; // el archivo final ya ensamblado (se genera al completar)
  let finalExtension = "webm"; // "mp4" si se usó WebCodecs, "webm" si fue MediaRecorder

  function setProgress(percent) {
    const offset = RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * percent) / 100;
    progressRing.style.strokeDashoffset = offset;
    progressPercent.textContent = percent + "%";
  }

  function renderFilmstrip() {
    filmstrip.innerHTML = scenes.map(function (s, i) {
      const isDone = !!s.image_url;
      const cls = isDone ? "done" : "pending";
      const img = isDone
        ? '<img src="' + s.image_url + '" alt="Escena ' + (i + 1) + '"/>'
        : '<div class="w-full h-full flex items-center justify-center text-white/20"><span class="material-symbols-outlined text-lg">image</span></div>';
      return (
        '<div class="scene-thumb ' + cls + '">' + img +
          '<div class="thumb-status ' + cls + '">' +
            '<span class="material-symbols-outlined" style="font-size:12px;">' + (isDone ? 'check' : 'hourglass_empty') + '</span>' +
          '</div>' +
        '</div>'
      );
    }).join("");
  }

  function renderSceneList() {
    sceneList.innerHTML = scenes.map(function (s, i) {
      const isDone = !!s.image_url;
      const borderColor = isDone ? "border-secondary-container" : "border-white/10";
      const iconColor = isDone ? "text-secondary-container bg-secondary-container/10" : "text-white/40 bg-white/5";
      const icon = isDone ? "check_circle" : "hourglass_top";
      const statusText = isDone ? "Generada" : "Pendiente";
      const statusColor = isDone ? "text-secondary-container" : "text-white/40";
      return (
        '<div class="glass-panel p-stack-md rounded-xl flex items-center justify-between border-l-4 ' + borderColor + '">' +
          '<div class="flex items-center gap-stack-md">' +
            '<div class="w-10 h-10 rounded-full ' + iconColor + ' flex items-center justify-center">' +
              '<span class="material-symbols-outlined" style="font-variation-settings: \'FILL\' 1;">' + icon + '</span>' +
            '</div>' +
            '<div>' +
              '<h3 class="font-headline-md text-body-lg text-white">Escena ' + (i + 1) + '</h3>' +
              '<p class="font-body-sm text-body-sm text-white/40">' + (s.label || s.script || "Sin descripción") + '</p>' +
            '</div>' +
          '</div>' +
          '<span class="' + statusColor + ' text-xs font-label-caps">' + statusText + '</span>' +
        '</div>'
      );
    }).join("");
  }

  function imageToImageElement(url) {
    return new Promise(function (resolve, reject) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error("No se pudo cargar una imagen para el render: " + url)); };
      img.src = url;
    });
  }

  function sleep(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  // Dibuja una imagen "contain" (con barras negras) dentro del canvas destino
  function dibujarContain(ctx, img, canvasW, canvasH) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasW, canvasH);
    const escala = Math.min(canvasW / img.width, canvasH / img.height);
    const w = img.width * escala;
    const h = img.height * escala;
    const x = (canvasW - w) / 2;
    const y = (canvasH - h) / 2;
    ctx.drawImage(img, x, y, w, h);
  }

  var SEGUNDOS_POR_ESCENA = 2.5;
  var FPS = 30;
  var VIDEO_WIDTH = 1280;
  var VIDEO_HEIGHT = 720;
  var BITRATE = 8000000; // 8 Mbps

  function pickMimeType() {
    var candidatos = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
    ];
    for (var i = 0; i < candidatos.length; i++) {
      if (window.MediaRecorder && MediaRecorder.isTypeSupported(candidatos[i])) {
        return candidatos[i];
      }
    }
    return null;
  }

  function isWebCodecsSupported() {
    return typeof VideoEncoder !== "undefined" && typeof VideoFrame !== "undefined";
  }

  // Intenta ensamblar el video con WebCodecs + mp4-muxer (mejor fidelidad de
  // color y sincronización estricta de tiempos, salida .mp4).
  async function assembleFinalVideoWebCodecs(images) {
    const muxerModule = await import("https://cdn.jsdelivr.net/npm/mp4-muxer@5/build/mp4-muxer.mjs");
    const Muxer = muxerModule.Muxer;
    const ArrayBufferTarget = muxerModule.ArrayBufferTarget;

    const canvas = document.createElement("canvas");
    canvas.width = VIDEO_WIDTH;
    canvas.height = VIDEO_HEIGHT;
    const ctx = canvas.getContext("2d");

    const codecCandidatos = ["avc1.640028", "avc1.4d0028", "avc1.42001f"];
    var codecElegido = null;
    for (var i = 0; i < codecCandidatos.length; i++) {
      const soporte = await VideoEncoder.isConfigSupported({
        codec: codecCandidatos[i], width: VIDEO_WIDTH, height: VIDEO_HEIGHT, bitrate: BITRATE, framerate: FPS
      });
      if (soporte.supported) { codecElegido = codecCandidatos[i]; break; }
    }
    if (!codecElegido) throw new Error("Ningún códec H.264 soportado para estas dimensiones.");

    const muxer = new Muxer({
      target: new ArrayBufferTarget(),
      video: { codec: "avc", width: VIDEO_WIDTH, height: VIDEO_HEIGHT },
      fastStart: "in-memory",
    });

    const encoder = new VideoEncoder({
      output: function (chunk, meta) { muxer.addVideoChunk(chunk, meta); },
      error: function (e) { throw e; },
    });
    encoder.configure({ codec: codecElegido, width: VIDEO_WIDTH, height: VIDEO_HEIGHT, bitrate: BITRATE, framerate: FPS });

    const frameDurationUs = Math.round(1000000 / FPS);
    const framesPorEscena = Math.round(SEGUNDOS_POR_ESCENA * FPS);
    var timestampUs = 0;

    for (var e = 0; e < images.length; e++) {
      dibujarContain(ctx, images[e], canvas.width, canvas.height);
      for (var f = 0; f < framesPorEscena; f++) {
        const frame = new VideoFrame(canvas, { timestamp: timestampUs, duration: frameDurationUs });
        const esKeyFrame = (timestampUs / frameDurationUs) % (FPS * 2) === 0;
        encoder.encode(frame, { keyFrame: esKeyFrame });
        frame.close();
        timestampUs += frameDurationUs;
      }
    }

    await encoder.flush();
    encoder.close();
    muxer.finalize();

    const buffer = muxer.target.buffer;
    return { blob: new Blob([buffer], { type: "video/mp4" }), extension: "mp4" };
  }

  // Método de respaldo: graba un <canvas> con MediaRecorder (salida .webm).
  async function assembleFinalVideoMediaRecorder(images) {
    if (!window.MediaRecorder) {
      throw new Error("Tu navegador no soporta grabación de video (MediaRecorder). Probá con Chrome o Edge.");
    }
    var mimeType = pickMimeType();
    if (!mimeType) {
      throw new Error("Tu navegador no soporta ningún formato de video compatible.");
    }

    const canvas = document.createElement("canvas");
    canvas.width = VIDEO_WIDTH;
    canvas.height = VIDEO_HEIGHT;
    const ctx = canvas.getContext("2d");

    // Frame inicial antes de arrancar a grabar
    dibujarContain(ctx, images[0], canvas.width, canvas.height);

    const stream = canvas.captureStream(FPS);
    const recorder = new MediaRecorder(stream, { mimeType: mimeType, videoBitsPerSecond: BITRATE });
    const chunks = [];
    recorder.ondataavailable = function (e) {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    const grabacionTerminada = new Promise(function (resolve) {
      recorder.onstop = resolve;
    });

    recorder.start();

    for (var i = 0; i < images.length; i++) {
      dibujarContain(ctx, images[i], canvas.width, canvas.height);
      await sleep(SEGUNDOS_POR_ESCENA * 1000);
    }

    recorder.stop();
    await grabacionTerminada;

    return { blob: new Blob(chunks, { type: mimeType }), extension: "webm" };
  }

  // Ensambla las imágenes de las escenas (en orden) en un VIDEO real.
  // Intenta primero WebCodecs (mejor fidelidad, .mp4); si no está soportado
  // o falla en tiempo de ejecución, cae automáticamente a MediaRecorder (.webm).
  async function assembleFinalVideo(scenesConImagen) {
    const images = await Promise.all(scenesConImagen.map(function (s) { return imageToImageElement(s.image_url); }));

    if (isWebCodecsSupported()) {
      try {
        return await assembleFinalVideoWebCodecs(images);
      } catch (err) {
        console.warn("WebCodecs falló, usando MediaRecorder como respaldo:", err.message);
      }
    }

    return assembleFinalVideoMediaRecorder(images);
  }

  const videoPreview = document.getElementById("video-preview");

  btnDownload.addEventListener("click", function () {
    if (!finalBlob) return;
    const url = URL.createObjectURL(finalBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "storyboard-flux-ai." + finalExtension;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  btnShare.addEventListener("click", async function () {
    if (!finalBlob) {
      estado.textContent = "El video todavía no está listo.";
      estado.className = "error";
      return;
    }

    const file = new File([finalBlob], "storyboard-flux-ai." + finalExtension, { type: finalBlob.type });

    console.log("Intentando compartir:", { type: file.type, size: file.size, canShareApi: !!navigator.canShare });

    if (!navigator.canShare) {
      estado.textContent = "Tu navegador no soporta compartir archivos. Usá 'Descargar' y compartilo manualmente.";
      estado.className = "";
      return;
    }

    if (!navigator.canShare({ files: [file] })) {
      console.warn("navigator.canShare devolvió false para este archivo (tipo:", file.type, ")");
      estado.textContent = "Este navegador no puede compartir archivos .webm directamente. Usá 'Descargar' y compartilo manualmente (por ejemplo desde WhatsApp o Drive).";
      estado.className = "";
      return;
    }

    try {
      await navigator.share({
        files: [file],
        title: "Mi Storyboard — FLUX_AI",
        text: "Mirá el video que armé con FLUX_AI",
      });
      estado.textContent = "";
    } catch (e) {
      if (e && e.name === "AbortError") {
        // el usuario cerró el menú de compartir sin elegir nada; no es un error real
        return;
      }
      console.error("Error al compartir:", e);
      estado.textContent = "No se pudo compartir: " + (e && e.message ? e.message : "error desconocido") + ". Probá 'Descargar' y compartilo manualmente.";
      estado.className = "error";
    }
  });

  async function cargarYRenderizar() {
    if (!sbClient) {
      estado.textContent = "No se pudo conectar con el servicio.";
      estado.className = "error";
      return;
    }

    try {
      const { data, error } = await sbClient
        .from("scenes")
        .select("*")
        .order("position", { ascending: true });

      if (error) throw error;

      scenes = data || [];

      if (scenes.length === 0) {
        renderTitle.textContent = "SIN ESCENAS TODAVÍA";
        renderSubtitle.textContent = "Andá al Storyboard para crear tu primera escena.";
        estado.textContent = "";
        return;
      }

      const total = scenes.length;
      const done = scenes.filter(function (s) { return !!s.image_url; }).length;
      const percent = Math.round((done / total) * 100);

      setProgress(percent);
      renderFilmstrip();
      renderSceneList();

      if (done < total) {
        renderTitle.textContent = "ENSAMBLANDO STORYBOARD...";
        renderSubtitle.textContent = done + " de " + total + " escenas generadas";
        btnDownload.disabled = true;
        btnShare.disabled = true;
      } else {
        renderTitle.textContent = "¡STORYBOARD COMPLETO!";
        renderSubtitle.textContent = total + " de " + total + " escenas listas";
        estado.textContent = "Renderizando video… (esto tarda unos segundos, no cierres la pestaña)";

        try {
          const scenesConImagen = scenes.filter(function (s) { return !!s.image_url; });
          const resultado = await assembleFinalVideo(scenesConImagen);
          finalBlob = resultado.blob;
          finalExtension = resultado.extension;

          videoPreview.src = URL.createObjectURL(finalBlob);
          videoPreview.classList.remove("hidden");

          estado.textContent = "";
          btnDownload.disabled = false;
          btnShare.disabled = false;
        } catch (renderErr) {
          estado.textContent = "No se pudo renderizar el video: " + renderErr.message;
          estado.className = "error";
        }
      }
    } catch (err) {
      estado.textContent = "Error al cargar el storyboard: " + err.message;
      estado.className = "error";
    }
  }

  cargarYRenderizar();
})();
</script>
</body></html>
