/**
 * Media utilities: client-side image compression, canvas EXIF stripping,
 * lighting quality checks, and geolocation with fallback.
 */

export async function compressImage(
  file,
  maxSide = 1024,
  quality = 0.8
) {
  const src = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const img = await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, w, h);

  const warnings = [];
  if (Math.min(img.width, img.height) < 300) {
    warnings.push("Photo resolution is small. Facial features might be harder to match.");
  }

  try {
    const sample = ctx.getImageData(0, 0, w, h).data;
    let lum = 0;
    let n = 0;
    for (let i = 0; i < sample.length; i += 4 * 50) {
      lum += 0.299 * sample[i] + 0.587 * sample[i + 1] + 0.114 * sample[i + 2];
      n++;
    }
    const avg = lum / (n || 1);
    if (avg < 50) {
      warnings.push("Photo appears too dark. Ensure the face is clearly lit.");
    } else if (avg > 235) {
      warnings.push("Photo appears overexposed. Avoid direct glare.");
    }
  } catch (err) {
    // Canvas read security restriction fallback
  }

  return {
    dataUrl: canvas.toDataURL("image/jpeg", quality),
    width: w,
    height: h,
    warnings,
  };
}

/** Fallback coordinates: Vijayawada Pushkar Ghats */
const PUSHKARALU_COORDS = { lat: 16.5144, lng: 80.6206, address: "Durga Ghat, Krishna River, Vijayawada" };

export function getLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      return resolve({ ...PUSHKARALU_COORDS, approx: true });
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: Number(position.coords.latitude.toFixed(5)),
          lng: Number(position.coords.longitude.toFixed(5)),
          address: "Current GPS Location",
          approx: false,
        });
      },
      () => {
        resolve({ ...PUSHKARALU_COORDS, approx: true });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  });
}

export function formatTime(timestamp = Date.now()) {
  return new Date(timestamp)
    .toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })
    .toLowerCase();
}

/**
 * Generate synthetic voice note audio (WAV) for fallback testing or devices without a mic.
 */
export function createSyntheticVoiceAudio(durationSecs = 3) {
  const sampleRate = 16000;
  const numSamples = Math.floor(sampleRate * durationSecs);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  function writeString(offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  writeString(0, "RIFF");
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, numSamples * 2, true);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const freq = 260 + Math.sin(t * 10) * 50;
    const sample = Math.sin(2 * Math.PI * freq * t) * 0.25 * Math.sin(Math.PI * (i / numSamples));
    view.setInt16(44 + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }

  const blob = new Blob([view], { type: "audio/wav" });
  return URL.createObjectURL(blob);
}
