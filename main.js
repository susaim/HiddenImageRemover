const imageInput = document.getElementById('imageInput');
const processBtn = document.getElementById('processBtn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadLink = document.getElementById('downloadLink');

let img = new Image();

imageInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

processBtn.addEventListener('click', () => {
  if (!img.src) return;
  ctx.drawImage(img, 0, 0);
  compressCenter();
  if (document.getElementById('pixelShift').checked) {
    applyPixelShift();
  }
  if (document.getElementById('moire').checked) {
    applyMoire();
  }
  downloadLink.href = canvas.toDataURL('image/png');
});

function compressCenter(factor = 0.9) {
  const temp = document.createElement('canvas');
  temp.width = canvas.width;
  temp.height = canvas.height;
  temp.getContext('2d').drawImage(canvas, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const dw = canvas.width * factor;
  const dh = canvas.height * factor;
  const dx = (canvas.width - dw) / 2;
  const dy = (canvas.height - dh) / 2;
  ctx.drawImage(temp, 0, 0, canvas.width, canvas.height, dx, dy, dw, dh);
}

function applyPixelShift() {
  const temp = document.createElement('canvas');
  temp.width = canvas.width;
  temp.height = canvas.height;
  temp.getContext('2d').drawImage(canvas, 0, 0);
  const tctx = temp.getContext('2d');
  for (let y = 0; y < canvas.height; y++) {
    const shift = (y % 2 === 0 ? 1 : -1) * 2;
    const row = tctx.getImageData(0, y, canvas.width, 1);
    ctx.putImageData(row, shift, y);
  }
}

function applyMoire() {
  const temp = document.createElement('canvas');
  temp.width = canvas.width;
  temp.height = canvas.height;
  temp.getContext('2d').drawImage(canvas, 0, 0);
  const tctx = temp.getContext('2d');
  const amplitude = 5;
  const frequency = 20;
  for (let y = 0; y < canvas.height; y++) {
    const shift = Math.round(Math.sin(y / frequency) * amplitude);
    const row = tctx.getImageData(0, y, canvas.width, 1);
    ctx.putImageData(row, shift, y);
  }
}
