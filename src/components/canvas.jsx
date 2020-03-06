import React, { useState, useEffect, useRef } from 'react';
const wasm = import('../wasm/test.wasm');

const Canvas = ({ width, height }) => {
  const canvas = useRef(null);

  const mandelIter = (x, y, maxIter) => {
    let r = x;
    let i = y;
    for (let a = 0; a < maxIter; a++) {
      let tmpr = r * r - i * i + x;
      let tmpi = 2 * r * i + y;

      r = tmpr;
      i = tmpi;

      if (r * i > 5) {
        return (a / maxIter) * 100;
      }
    }

    return 0;
  };

  useEffect(() => {
    console.log(canvas);
    // const ctx = canvas.current.getContext('2d');
    // let mag = 300;
    // let panX = 2;
    // let panY = 2;
    // let maxIter = 10;

    // for (let x = 10; x < height; x++) {
    //   for (let y = 10; y < width; y++) {
    //     let m = mandelIter(x / mag - panX, y / mag - panY, maxIter);
    //     ctx.fillStyle = m === 0 ? '#000' : 'hsl(0, 100%, ' + m + '%)';
    //     ctx.fillRect(x, y, 1, 1);
    //   }
    // }
    wasm.then(wasm => {
      const mandelIterWASM = wasm._Z10mandelIterffi;
      let ctx = canvas.current.getContext('2d');
      let mag = 200;
      let panX = 2;
      let panY = 1.25;
      let maxIter = 100;

      for (let x = 10; x < height; x++) {
        for (let y = 10; y < width; y++) {
          // let m = this.mandelIter(x/mag - panX, y/mag - panY, maxIter);
          let m = mandelIterWASM(x / mag - panX, y / mag - panY, maxIter);
          ctx.fillStyle = m === 0 ? '#000' : 'hsl(0, 100%, ' + m + '%)';
          ctx.fillRect(x, y, 1, 1);
        }
      }
    });
  });
  return <canvas ref={canvas} width={width} height={height} />;
};

export default Canvas;
