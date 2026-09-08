// Renderiza las escenas del Storyboard en un video WebM directamente en el navegador.
(function () {
  window.FluxVideoRenderer = {
    async render(scenes, options) {
      options = options || {};
      const duration = Math.max(0.5, Number(options.duration || 2));
      const fps = Math.max(12, Math.min(30, Number(options.fps || 24)));
      const width = Number(options.width || 1280);
      const height = Number(options.height || 720);
      const valid = (scenes || []).filter(s => s && s.image_url);
      if (!valid.length) throw new Error('No hay escenas con imágenes para renderizar.');
      if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) {
        throw new Error('Este navegador no permite crear video desde el navegador.');
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No se pudo crear el lienzo de renderizado.');
      const images = await Promise.all(valid.map(s => loadImage(s.image_url)));
      const stream = canvas.captureStream(fps);
      const types = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
      const mimeType = types.find(t => MediaRecorder.isTypeSupported(t));
      if (!mimeType) throw new Error('Tu navegador no soporta el formato de video requerido.');
      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8000000 });
      const chunks = [];
      recorder.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
      const stopped = new Promise((resolve, reject) => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
        recorder.onerror = e => reject(e.error || new Error('Error durante el renderizado.'));
      });
      recorder.start(250);
      const totalMs = valid.length * duration * 1000;
      const start = performance.now();
      await new Promise(resolve => {
        const draw = now => {
          const elapsed = now - start;
          const index = Math.min(valid.length - 1, Math.floor(elapsed / (duration * 1000)));
          drawCover(ctx, images[index], width, height);
          const progress = Math.min(100, Math.round((elapsed / totalMs) * 100));
          if (typeof options.onProgress === 'function') options.onProgress(progress);
          if (elapsed >= totalMs) return resolve();
          requestAnimationFrame(draw);
        };
        requestAnimationFrame(draw);
      });
      recorder.stop();
      const blob = await stopped;
      stream.getTracks().forEach(t => t.stop());
      return { blob, mimeType, extension: 'webm', sceneCount: valid.length, duration: valid.length * duration };
    }
  };

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('No se pudo cargar una imagen del Storyboard.'));
      img.src = src;
    });
  }

  function drawCover(ctx, img, width, height) {
    const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    const x = (width - w) / 2;
    const y = (height - h) / 2;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, x, y, w, h);
  }
})();
