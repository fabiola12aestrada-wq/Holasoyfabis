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
  const videoPreview = document.getElementById("video-preview");

  const RING_CIRCUMFERENCE = 176;

  // Idioma de la narración (mismo que se usa para interpretar el PDF).
  const IDIOMA_NARRACION = localStorage.getItem("pdf_lang") || "es";

  const MIN_SEGUNDOS_ESCENA = 2.5;  // duración mínima si una escena no tiene narración
  const PADDING_NARRACION = 0.5;    // aire después de que termina de hablar la escena
  const DURACION_TRANSICION = 0.6;
  const FPS = 30;
  const VIDEO_WIDTH = 1920;
  const VIDEO_HEIGHT = 1080;
  const BITRATE = 8000000;

  let scenes = [];
  let finalBlob = null;
  let finalExtension = "webm";

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
              '<p class="font-body-sm text-body-sm text-white/40">' + (s.script || s.label || "Sin descripción") + '</p>' +
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

  function dibujarCoverConKenBurns(ctx, img, canvasW, canvasH, progreso) {
    const ZOOM_INICIAL = 1.0;
    const ZOOM_FINAL = 1.08;
    const escalaKenBurns = ZOOM_INICIAL + (ZOOM_FINAL - ZOOM_INICIAL) * progreso;

    const escalaBase = Math.max(canvasW / img.width, canvasH / img.height);
    const w = img.width * escalaBase * escalaKenBurns;
    const h = img.height * escalaBase * escalaKenBurns;

    const deriva = (progreso - 0.5) * (w - canvasW) * 0.2;
    const x = (canvasW - w) / 2 - deriva;
    const y = (canvasH - h) / 2;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasW, canvasH);
    ctx.drawImage(img, x, y, w, h);
  }

  function dibujarSubtitulos(ctx, texto, canvasW, canvasH) {
    if (!texto) return;

    ctx.save();
    ctx.font = "bold 32px 'Nunito', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const margin = 80;
    const maxWidth = canvasW - 160;
    const words = texto.split(" ");
    let line = "";
    const lines = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    const lineHeight = 44;
    const boxHeight = lines.length * lineHeight + 30;
    const boxY = canvasH - margin - boxHeight;

    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.beginPath();
    ctx.roundRect((canvasW - maxWidth - 40) / 2, boxY, maxWidth + 40, boxHeight, 15);
    ctx.fill();

    ctx.fillStyle = "#FFF7AD";
    lines.forEach(function (l, i) {
      ctx.fillText(l.trim(), canvasW / 2, boxY + 25 + i * lineHeight);
    });

    ctx.restore();
  }

  // --- NARRACIÓN REAL: pide el audio ya sintetizado a /api/tts ---
  // (usa el mismo HF_TOKEN que /api/generate.js — ver api/tts.js)
  // El idioma se toma de "narration_language" (lo detecta la pantalla de
  // "subir" al analizar el PDF, escena por escena); si una escena no lo
  // trae, se usa IDIOMA_NARRACION como respaldo.
  async function generarAudioEscena(texto, lang, audioCtx) {
    if (!texto || !texto.trim()) return null;
    try {
      const resp = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: texto, lang: lang || IDIOMA_NARRACION }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(function () { return {}; });
        throw new Error(err.error || ("El servicio de voz respondió " + resp.status));
      }
      const arrayBuffer = await resp.arrayBuffer();
      return await audioCtx.decodeAudioData(arrayBuffer);
    } catch (e) {
      console.warn("No se pudo generar narración para una escena:", e.message);
      return null; // la escena queda sin voz, pero el render no se corta
    }
  }

  // Genera el audio de cada escena y arma la línea de tiempo: cada escena
  // dura lo que dura su narración (+ aire), en vez de un tiempo fijo.
  async function prepararLineaDeTiempo(scenesConImagen, audioCtx) {
    estado.textContent = "Generando narración con voz…";

    const audios = await Promise.all(
      scenesConImagen.map(function (s) {
        return generarAudioEscena(s.script || s.label || "", s.narration_language, audioCtx);
      })
    );

    let cursor = 0;
    const timeline = scenesConImagen.map(function (s, i) {
      const audioBuffer = audios[i];
      const duracion = Math.max(
        MIN_SEGUNDOS_ESCENA,
        audioBuffer ? audioBuffer.duration + PADDING_NARRACION : MIN_SEGUNDOS_ESCENA
      );
      const item = { scene: s, audioBuffer: audioBuffer, startTime: cursor, duration: duracion };
      cursor += duracion;
      return item;
    });

    return { timeline: timeline, totalDuration: cursor };
  }

  // Mezcla todas las narraciones en UNA sola pista de audio continua, ya
  // alineada en el tiempo con la duración real de cada escena.
  function mezclarPistaDeAudio(audioCtx, timeline, totalDuration) {
    const sampleRate = audioCtx.sampleRate;
    const numberOfChannels = 2;
    const totalSamples = Math.max(1, Math.ceil(totalDuration * sampleRate));
    const mixBuffer = audioCtx.createBuffer(numberOfChannels, totalSamples, sampleRate);

    timeline.forEach(function (item) {
      if (!item.audioBuffer) return;
      const offset = Math.round(item.startTime * sampleRate);
      for (let c = 0; c < numberOfChannels; c++) {
        const src = item.audioBuffer.getChannelData(Math.min(c, item.audioBuffer.numberOfChannels - 1));
        const dest = mixBuffer.getChannelData(c);
        for (let i = 0; i < src.length && offset + i < totalSamples; i++) {
          dest[offset + i] += src[i];
        }
      }
    });

    return mixBuffer;
  }

  function buscarEscenaActiva(timeline, tSegundos) {
    for (let i = timeline.length - 1; i >= 0; i--) {
      if (tSegundos >= timeline[i].startTime) return i;
    }
    return 0;
  }

  function dibujarFotogramaEnTiempo(ctx, timeline, images, width, height, tSegundos) {
    const idx = Math.min(images.length - 1, buscarEscenaActiva(timeline, tSegundos));
    const item = timeline[idx];
    const tLocal = Math.min(1, (tSegundos - item.startTime) / item.duration);

    const inicioTransicion = 1 - (DURACION_TRANSICION / item.duration);
    const haySiguiente = idx < images.length - 1;

    dibujarCoverConKenBurns(ctx, images[idx], width, height, tLocal);

    if (haySiguiente && tLocal >= inicioTransicion) {
      const alpha = (tLocal - inicioTransicion) / (1 - inicioTransicion);
      ctx.save();
      ctx.globalAlpha = Math.min(1, Math.max(0, alpha));
      dibujarCoverConKenBurns(ctx, images[idx + 1], width, height, 0);
      ctx.restore();
    }

    const textoActual = item.scene.script || item.scene.label || "";
    dibujarSubtitulos(ctx, textoActual, width, height);
  }

  function pickMimeType() {
    var candidatos = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
    for (var i = 0; i < candidatos.length; i++) {
      if (window.MediaRecorder && MediaRecorder.isTypeSupported(candidatos[i])) {
        return candidatos[i];
      }
    }
    return null;
  }

  function isWebCodecsSupported() {
    return (
      typeof VideoEncoder !== "undefined" &&
      typeof VideoFrame !== "undefined" &&
      typeof AudioEncoder !== "undefined" &&
      typeof AudioData !== "undefined"
    );
  }

  // Codifica la pista de audio mezclada a AAC y la va entregando al muxer.
  async function codificarAudioEnAAC(muxer, mixBuffer, sampleRate, numberOfChannels) {
    const FRAME_SIZE = 1024;
    const totalFrames = mixBuffer.length;
    const channelsData = [];
    for (let c = 0; c < numberOfChannels; c++) channelsData.push(mixBuffer.getChannelData(c));

    const encoder = new AudioEncoder({
      output: function (chunk, meta) { muxer.addAudioChunk(chunk, meta); },
      error: function (e) { throw e; },
    });
    encoder.configure({
      codec: "mp4a.40.2",
      sampleRate: sampleRate,
      numberOfChannels: numberOfChannels,
      bitrate: 128000,
    });

    for (let start = 0; start < totalFrames; start += FRAME_SIZE) {
      const length = Math.min(FRAME_SIZE, totalFrames - start);
      const planar = new Float32Array(length * numberOfChannels);
      for (let c = 0; c < numberOfChannels; c++) {
        planar.set(channelsData[c].subarray(start, start + length), c * length);
      }
      const audioData = new AudioData({
        format: "f32-planar",
        sampleRate: sampleRate,
        numberOfFrames: length,
        numberOfChannels: numberOfChannels,
        timestamp: Math.round((start / sampleRate) * 1e6),
        data: planar,
      });
      encoder.encode(audioData);
      audioData.close();
    }

    await encoder.flush();
    encoder.close();
  }

  async function assembleFinalVideoWebCodecs(timeline, images, mixBuffer, sampleRate) {
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

    const numberOfChannels = mixBuffer.numberOfChannels;

    const muxer = new Muxer({
      target: new ArrayBufferTarget(),
      video: { codec: "avc", width: VIDEO_WIDTH, height: VIDEO_HEIGHT },
      audio: { codec: "aac", numberOfChannels: numberOfChannels, sampleRate: sampleRate },
      fastStart: "in-memory",
    });

    const encoder = new VideoEncoder({
      output: function (chunk, meta) { muxer.addVideoChunk(chunk, meta); },
      error: function (e) { throw e; },
    });
    encoder.configure({ codec: codecElegido, width: VIDEO_WIDTH, height: VIDEO_HEIGHT, bitrate: BITRATE, framerate: FPS });

    const totalDuration = timeline[timeline.length - 1].startTime + timeline[timeline.length - 1].duration;
    const frameDurationUs = Math.round(1000000 / FPS);
    const totalFrames = Math.round(totalDuration * FPS);
    var timestampUs = 0;

    for (var f = 0; f < totalFrames; f++) {
      const tSegundos = f / FPS;
      dibujarFotogramaEnTiempo(ctx, timeline, images, canvas.width, canvas.height, tSegundos);
      const frame = new VideoFrame(canvas, { timestamp: timestampUs, duration: frameDurationUs });
      const esKeyFrame = (timestampUs / frameDurationUs) % (FPS * 2) === 0;
      encoder.encode(frame, { keyFrame: esKeyFrame });
      frame.close();
      timestampUs += frameDurationUs;
    }

    await encoder.flush();
    encoder.close();

    await codificarAudioEnAAC(muxer, mixBuffer, sampleRate, numberOfChannels);

    muxer.finalize();
    const buffer = muxer.target.buffer;
    return { blob: new Blob([buffer], { type: "video/mp4" }), extension: "mp4" };
  }

  async function assembleFinalVideoMediaRecorder(timeline, images, mixBuffer, audioCtx) {
    if (!window.MediaRecorder) {
      throw new Error("Tu navegador no soporta grabación de video (MediaRecorder).");
    }
    var mimeType = pickMimeType();
    if (!mimeType) {
      throw new Error("Tu navegador no soporta ningún formato de video compatible.");
    }

    const canvas = document.createElement("canvas");
    canvas.width = VIDEO_WIDTH;
    canvas.height = VIDEO_HEIGHT;
    const ctx = canvas.getContext("2d");
    dibujarFotogramaEnTiempo(ctx, timeline, images, canvas.width, canvas.height, 0);

    const canvasStream = canvas.captureStream(FPS);

    // Reproducimos la pista de audio mezclada hacia un destino de MediaStream
    // y la combinamos con el video del canvas ANTES de grabar. Así el audio
    // sí queda dentro del archivo final (a diferencia de speechSynthesis).
    const audioDestino = audioCtx.createMediaStreamDestination();
    const fuenteAudio = audioCtx.createBufferSource();
    fuenteAudio.buffer = mixBuffer;
    fuenteAudio.connect(audioDestino);

    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...audioDestino.stream.getAudioTracks(),
    ]);

    const recorder = new MediaRecorder(combinedStream, {
      mimeType: mimeType,
      videoBitsPerSecond: BITRATE,
      audioBitsPerSecond: 128000,
    });
    const chunks = [];
    recorder.ondataavailable = function (e) {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    const grabacionTerminada = new Promise(function (resolve) {
      recorder.onstop = resolve;
    });

    const totalDuration = timeline[timeline.length - 1].startTime + timeline[timeline.length - 1].duration;
    const totalMs = totalDuration * 1000;

    recorder.start();
    fuenteAudio.start();
    const inicio = performance.now();

    await new Promise(function (resolve) {
      function draw(ahora) {
        const transcurridoMs = ahora - inicio;
        const tSegundos = transcurridoMs / 1000;
        dibujarFotogramaEnTiempo(ctx, timeline, images, canvas.width, canvas.height, tSegundos);
        if (transcurridoMs >= totalMs) return resolve();
        requestAnimationFrame(draw);
      }
      requestAnimationFrame(draw);
    });

    recorder.stop();
    fuenteAudio.stop();
    await grabacionTerminada;

    return { blob: new Blob(chunks, { type: mimeType }), extension: "webm" };
  }

  async function assembleFinalVideo(scenesConImagen) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const images = await Promise.all(scenesConImagen.map(function (s) { return imageToImageElement(s.image_url); }));

    const preparado = await prepararLineaDeTiempo(scenesConImagen, audioCtx);
    const timeline = preparado.timeline;
    const totalDuration = preparado.totalDuration;

    estado.textContent = "Renderizando video con voz y subtítulos… (no cierres la pestaña)";
    const mixBuffer = mezclarPistaDeAudio(audioCtx, timeline, totalDuration);

    if (isWebCodecsSupported()) {
      try {
        return await assembleFinalVideoWebCodecs(timeline, images, mixBuffer, audioCtx.sampleRate);
      } catch (err) {
        console.warn("WebCodecs falló, usando MediaRecorder como respaldo:", err.message);
      }
    }

    return assembleFinalVideoMediaRecorder(timeline, images, mixBuffer, audioCtx);
  }

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

    if (!navigator.canShare || !navigator.canShare({ files: [file] })) {
      estado.textContent = "No se puede compartir directamente. Usá 'Descargar' para guardarlo.";
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
      if (e && e.name === "AbortError") return;
      estado.textContent = "Error al compartir. Probá 'Descargar' y compartilo manualmente.";
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
