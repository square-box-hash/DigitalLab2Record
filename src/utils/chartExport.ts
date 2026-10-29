/**
 * Renders the live Recharts SVG to a PNG on a clean white sheet, so a student can
 * paste the graph straight into a lab record or print it.
 *
 * The legend is drawn on the canvas rather than in the SVG: Recharts renders its
 * legend as HTML beside the chart, not inside it, so serialising the SVG alone
 * would lose it.
 */

export interface ChartLegendItem {
  label: string;
  color: string;
  kind: 'line' | 'dot';
}

export interface ChartExportOptions {
  title: string;
  subtitle?: string;
  legend: ChartLegendItem[];
  fileName: string;
  scale?: number;
}

const FONT_STACK =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export async function exportChartPng(
  svg: SVGSVGElement,
  options: ChartExportOptions
): Promise<void> {
  const scale = options.scale ?? 2;
  const rect = svg.getBoundingClientRect();
  const width = Math.max(320, Math.round(rect.width));
  const height = Math.max(240, Math.round(rect.height));

  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));

  // The rasteriser has no access to the page's webfonts, so pin a generic stack.
  const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  styleEl.textContent = `text{font-family:${FONT_STACK};}`;
  clone.insertBefore(styleEl, clone.firstChild);

  const serialized = new XMLSerializer().serializeToString(clone);
  const svgUrl = URL.createObjectURL(
    new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' })
  );

  const image = new Image();
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Could not rasterise the chart'));
    image.src = svgUrl;
  });

  const padX = 44;
  const padTop = options.subtitle ? 62 : 52;
  const padBottom = 62;
  const sheetWidth = width + padX * 2;
  const sheetHeight = height + padTop + padBottom;

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(sheetWidth * scale);
  canvas.height = Math.round(sheetHeight * scale);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    URL.revokeObjectURL(svgUrl);
    return;
  }

  ctx.scale(scale, scale);

  // White sheet
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, sheetWidth, sheetHeight);

  // Title block
  ctx.fillStyle = '#0f172a';
  ctx.font = `600 15px ${FONT_STACK}`;
  ctx.fillText(options.title, padX, 28);

  if (options.subtitle) {
    ctx.fillStyle = '#64748b';
    ctx.font = `12px ${FONT_STACK}`;
    ctx.fillText(options.subtitle, padX, 46);
  }

  ctx.drawImage(image, padX, padTop, width, height);
  URL.revokeObjectURL(svgUrl);

  // Legend row
  let cursorX = padX;
  const legendY = padTop + height + 30;
  ctx.font = `12px ${FONT_STACK}`;

  options.legend.forEach((item) => {
    ctx.strokeStyle = item.color;
    ctx.fillStyle = item.color;
    ctx.lineWidth = 2.5;

    if (item.kind === 'line') {
      ctx.beginPath();
      ctx.moveTo(cursorX, legendY - 4);
      ctx.lineTo(cursorX + 20, legendY - 4);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(cursorX + 10, legendY - 4, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#334155';
    ctx.fillText(item.label, cursorX + 28, legendY);
    cursorX += 28 + ctx.measureText(item.label).width + 26;
  });

  // Footer
  ctx.fillStyle = '#94a3b8';
  ctx.font = `10px ${FONT_STACK}`;
  ctx.fillText('CBSE Physics Practicals Companion — Class XI', padX, legendY + 24);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/png')
  );
  if (!blob) return;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = options.fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
