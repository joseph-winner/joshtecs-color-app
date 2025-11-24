"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  FiCopy,
  FiUpload,
  FiPlus,
  FiMinus,
  FiDroplet,
  FiArrowLeft,
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

const INITIAL_PALETTE = [
  { name: "Desert Sky", hex: "#2596be" },
  { name: "Soft Sand", hex: "#f5e3cf" },
  { name: "Burnt Orange", hex: "#e67a3a" },
  { name: "Clay", hex: "#d48a4c" },
  { name: "Deep Earth", hex: "#6a3c2a" },
  { name: "Rust", hex: "#8b3f22" },
  { name: "Cool Aqua", hex: "#a7dbe8" },
  { name: "Midnight Blue", hex: "#003c71" },
  { name: "Ocean Deep", hex: "#0a4474" },
];

function hexToRgb(hex) {
  if (!hex) return "0, 0, 0";
  let clean = hex.replace("#", "");
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return "0, 0, 0";
  }
  return `${r}, ${g}, ${b}`;
}

function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const h = n.toString(16);
    return h.length === 1 ? "0" + h : h;
  };
  return "#" + toHex(r) + toHex(g) + toHex(b);
}

function hexToHsl(hex) {
  if (!hex) return "0, 0%, 0%";
  let clean = hex.replace("#", "");
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  let r = parseInt(clean.slice(0, 2), 16) / 255;
  let g = parseInt(clean.slice(2, 4), 16) / 255;
  let b = parseInt(clean.slice(4, 6), 16) / 255;

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return "0, 0%, 0%";
  }

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h}, ${s}%, ${l}%`;
}

function Colorpicker() {
  const [palette, setPalette] = useState(INITIAL_PALETTE);
  const [activeHex, setActiveHex] = useState(INITIAL_PALETTE[0].hex);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [previewHex, setPreviewHex] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const rgb = useMemo(() => hexToRgb(activeHex), [activeHex]);
  const hsl = useMemo(() => hexToHsl(activeHex), [activeHex]);
  const activeFromPalette = palette.find(
    (c) => c.hex.toLowerCase() === activeHex.toLowerCase()
  );
  const activeLabel = activeFromPalette?.name || "Picked Color";

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageSrc = event.target.result;
      setUploadedImage(imageSrc);
      // Extract colors from the newly uploaded image
      extractColorsFromImage(imageSrc);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageLoad = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
  };

  const getColorAtPosition = (e) => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return null;

    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const ctx = canvas.getContext("2d");
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const [r, g, b] = pixel;
    const hex = rgbToHex(r, g, b);

    return { hex, x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseMove = (e) => {
    const result = getColorAtPosition(e);
    if (result) {
      setPreviewHex(result.hex);
      setCursorPos({ x: result.x, y: result.y });
    }
  };

  const handleMouseLeave = () => {
    setPreviewHex(null);
  };

  const handlePickFromImage = (e) => {
    const result = getColorAtPosition(e);
    if (!result) return;

    const hex = result.hex;
    setActiveHex(hex);

    // auto-add to palette (rotate if full)
    setPalette((prev) => {
      if (prev.some((c) => c.hex.toLowerCase() === hex.toLowerCase())) {
        return prev;
      }
      const next = [
        ...prev.slice(Math.max(prev.length - 8, 0)), // keep last 8
        { name: "Picked", hex },
      ];
      return next;
    });
  };

  // Extract dominant colors from image
  const extractColorsFromImage = (imageSrc) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");

      // Resize for performance
      const maxSize = 100;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      tempCanvas.width = img.width * scale;
      tempCanvas.height = img.height * scale;

      tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

      const imageData = tempCtx.getImageData(
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
      );
      const pixels = imageData.data;

      // Sample pixels and collect colors
      const colorMap = {};
      const step = 4; // Sample every 4th pixel for performance

      for (let i = 0; i < pixels.length; i += step * 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        // Skip transparent pixels
        if (a < 128) continue;

        // Quantize colors to reduce variations
        const qr = Math.round(r / 32) * 32;
        const qg = Math.round(g / 32) * 32;
        const qb = Math.round(b / 32) * 32;

        const hex = rgbToHex(qr, qg, qb);
        colorMap[hex] = (colorMap[hex] || 0) + 1;
      }

      // Sort by frequency and get top colors
      const sortedColors = Object.entries(colorMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 9)
        .map(([hex], index) => ({
          name: `Color ${index + 1}`,
          hex: hex,
        }));

      if (sortedColors.length > 0) {
        setPalette(sortedColors);
        setActiveHex(sortedColors[0].hex);
      }
    };

    img.src = imageSrc;
  };

  // Extract colors from default image on mount
  useEffect(() => {
    const defaultImage =
      "https://images.pexels.com/photos/128421/pexels-photo-128421.jpeg?auto=compress&cs=tinysrgb&w=1200";
    extractColorsFromImage(defaultImage);
  }, []);

  const handleCopy = (value) => {
    if (navigator?.clipboard) {
      navigator.clipboard
        .writeText(value)
        .then(() => {
          toast.success(`${value} copied to clipboard!`, {
            duration: 2000,
            position: "top-center",
            style: {
              background: "#1e293b",
              color: "#f1f5f9",
              border: "1px solid #334155",
            },
          });
        })
        .catch(() => {
          toast.error("Failed to copy to clipboard", {
            duration: 2000,
            position: "top-center",
          });
        });
    }
  };

  const handleExportPalette = () => {
    // Generate CSS custom properties format
    const cssVariables = palette
      .map((color, index) => {
        // Convert color name to kebab-case for CSS variable naming
        const varName = color.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
        return `  --${varName}: ${color.hex};`;
      })
      .join("\n");

    const cssOutput = `:root {\n${cssVariables}\n}`;

    // Copy to clipboard
    if (navigator?.clipboard) {
      navigator.clipboard
        .writeText(cssOutput)
        .then(() => {
          toast.success("CSS palette exported to clipboard!", {
            duration: 3000,
            position: "top-center",
            style: {
              background: "#1e293b",
              color: "#f1f5f9",
              border: "1px solid #334155",
            },
          });
        })
        .catch(() => {
          toast.error("Failed to export palette", {
            duration: 2000,
            position: "top-center",
          });
        });
    }
  };

  const activeIndex = palette.findIndex(
    (c) => c.hex.toLowerCase() === activeHex.toLowerCase()
  );

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-6xl rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl p-6 lg:p-8 backdrop-blur">
          {/* Branding at the top */}
          <div className="flex items-center gap-2 text-slate-200 mb-6">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/40">
              <FiArrowLeft className="text-sky-400" />
            </span>
            <span className="text-sm font-semibold tracking-wide text-slate-200">
              Joshtecs
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/40">
              <FiDroplet className="text-sky-400" />
            </span>
          </div>

          {/* Layout: image left, options right (stack on mobile) */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT: Image + palette */}
            <div className="flex-1 flex flex-col gap-4 order-1">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-200">
                    Photo Picker
                  </h2>
                  <p className="text-xs text-slate-400">
                    Tap the image to pick a color.
                  </p>
                </div>

                <button
                  onClick={handleUploadClick}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 transition"
                >
                  <FiUpload className="text-slate-300" />
                  Use your image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Image area */}
              <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800">
                <div
                  className="relative w-full pt-[62%] cursor-crosshair"
                  onClick={handlePickFromImage}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Replace src with your asset/import */}
                  <img
                    ref={imgRef}
                    onLoad={handleImageLoad}
                    crossOrigin="anonymous"
                    src={
                      uploadedImage ||
                      "https://images.pexels.com/photos/128421/pexels-photo-128421.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    }
                    alt={uploadedImage ? "Uploaded image" : "Desert car"}
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  {/* Lens - follows cursor when hovering */}
                  {previewHex && (
                    <div
                      className="pointer-events-none absolute h-40 w-40 rounded-full border border-sky-300/80 bg-slate-900/30 backdrop-blur-md shadow-xl flex items-center justify-center transition-transform duration-75"
                      style={{
                        left: `${cursorPos.x}px`,
                        top: `${cursorPos.y}px`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div className="h-[88%] w-[88%] rounded-full border border-sky-500/40 bg-[linear-gradient(to_right,rgba(148,163,184,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.4)_1px,transparent_1px)] bg-[size:10px_10px] flex items-center justify-center">
                        <span
                          className="h-8 w-8 rounded-full border-2 border-sky-400 shadow-lg"
                          style={{ backgroundColor: previewHex }}
                        />
                      </div>
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-slate-700 px-3 py-1.5 rounded-lg">
                        <span className="text-xs font-mono text-slate-200">
                          {previewHex}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Hidden canvas for pixel reading */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Palette */}
              <div className="rounded-2xl bg-slate-900/80 border border-slate-800 px-4 py-3">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-400">
                      Palette
                    </p>
                    <p className="text-xs text-slate-500">
                      On mobile, colors scroll horizontally.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs">
                      <FiMinus />
                    </button>
                    <button className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-sky-500/70 bg-sky-500/10 text-sky-200 hover:bg-sky-500/20 text-xs">
                      <FiPlus />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {palette.map((color, index) => {
                    const isActive = index === activeIndex;
                    return (
                      <button
                        key={`${color.hex}-${index}`}
                        onClick={() => setActiveHex(color.hex)}
                        className={`relative h-10 w-14 shrink-0 rounded-xl border-2 transition-all focus:outline-none ${
                          isActive
                            ? "border-sky-400 ring-2 ring-sky-500/40 ring-offset-2 ring-offset-slate-900"
                            : "border-slate-800 hover:border-slate-600"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        aria-label={color.name}
                      >
                        {isActive && (
                          <span className="absolute inset-0 rounded-xl border border-white/30" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT: Color details */}
            <div className="flex-1 flex flex-col gap-4 lg:gap-5 order-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-300">
                    Colors
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Click the image or palette to change the active color.
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-[11px] text-slate-400">
                    Local only • No upload
                  </span>
                </div>
              </div>

              {/* Active color preview */}
              <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 p-4 flex gap-4">
                <div
                  className="h-20 w-20 rounded-2xl border border-slate-700 shadow-inner"
                  style={{ backgroundColor: activeHex }}
                />
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      Active Color
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-100">
                      {activeLabel}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500">
                    Perfect for highlights, accents and gradients in your UI.
                  </p>
                </div>
              </div>

              {/* HEX */}
              <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-3.5 flex items-center justify-between gap-3">
                <div className="flex flex-col flex-1">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    HEX
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-mono text-slate-100">
                      {activeHex}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(activeHex)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 transition"
                >
                  <FiCopy className="text-slate-300" />
                  Copy
                </button>
              </div>

              {/* RGB */}
              <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-3.5 flex items-center justify-between gap-3">
                <div className="flex flex-col flex-1">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    RGB
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-mono text-slate-100">
                      rgb({rgb})
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(`rgb(${rgb})`)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 transition"
                >
                  <FiCopy className="text-slate-300" />
                  Copy
                </button>
              </div>

              {/* RGBA */}
              <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-3.5 flex items-center justify-between gap-3">
                <div className="flex flex-col flex-1">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    RGBA
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-mono text-slate-100">
                      rgba({rgb}, 1)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(`rgba(${rgb}, 1)`)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 transition"
                >
                  <FiCopy className="text-slate-300" />
                  Copy
                </button>
              </div>

              {/* HSL */}
              <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-3.5 flex items-center justify-between gap-3">
                <div className="flex flex-col flex-1">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    HSL
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-mono text-slate-100">
                      hsl({hsl})
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(`hsl(${hsl})`)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 transition"
                >
                  <FiCopy className="text-slate-300" />
                  Copy
                </button>
              </div>

              {/* Tip */}
              <div className="mt-2 rounded-2xl border border-sky-500/40 bg-sky-500/5 p-3.5 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-300">
                  <p className="font-medium">Built for Every Device</p>
                  <p className="text-slate-400 mt-1">
                    Experience seamless design on any screen. Our responsive
                    interface adapts perfectly to mobile, delivering your color
                    palettes exactly where you need them.
                  </p>
                </div>
                <button
                  onClick={handleExportPalette}
                  className="shrink-0 rounded-xl bg-sky-500/90 hover:bg-sky-400 text-xs font-semibold text-slate-950 px-4 py-2 transition shadow-lg shadow-sky-500/20"
                >
                  Export palette
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Colorpicker;
