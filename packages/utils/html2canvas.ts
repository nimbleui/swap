const CSSRules = [
  'width',
  'height',
  'line-height',
  'max-height',
  "min-height",
  "max-width",
  "min-width",
  "font-size",
  "text-align",
  "color",
  "background",
  "border",
  "box-sizing",
  "margin",
  "padding",
  "left",
  "top",
  "bottom",
  "display",
  "flex",
  "position",
  "z-index",
]

function setElementStyles(el: Element, styleEl: Element) {
  const css = getComputedStyle(el);
  CSSRules.forEach((key) => {
    (styleEl as HTMLElement).style.setProperty(key, css.getPropertyValue(key))
  })
}

function imgUrlToBase64(img: HTMLImageElement, styleEl: HTMLImageElement) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const { width, height } = img;
  img.crossOrigin = 'anonymous'
  canvas.width = width;
  canvas.height = height;
  ctx?.clearRect(0, 0, width, height);
  ctx?.drawImage(img, 0, 0, width, height);
  styleEl.crossOrigin = 'anonymous'
  styleEl.src = canvas.toDataURL();
}

function setStyle(el: Element, cloneDom?: Element ) {
  const tagName = el.tagName.toLowerCase();
  const cloneEl = el.cloneNode() as Element;
  setElementStyles(el, cloneEl);
  if (tagName == 'img') {
    imgUrlToBase64(el as HTMLImageElement, cloneEl as HTMLImageElement)
  }

  if (cloneDom) {
    cloneDom.appendChild(cloneEl);
  }

  const child = el.children;
  if (child.length) {
    for (let i = 0; i < child?.length; i++) {
      setStyle(child[i], cloneDom || cloneEl)
    }
  }
  if (cloneEl && el.textContent) {
    cloneEl.appendChild(document.createTextNode(el.textContent))
  }

  return cloneEl
}

export function html2canvas(content: Element) {
  if (!content) return
  const cloneDom = setStyle(content);
  const { width, height } = content.getBoundingClientRect();
  const xml = new XMLSerializer().serializeToString(cloneDom);
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <foreignObject x="0" y="0" width="100%" height="100%">${xml}</foreignObject></svg>`.replace(/\n/g, '').replace(/\t/g, '').replace(/#/g, '%23');

  document.body.appendChild(img);
  return img
}