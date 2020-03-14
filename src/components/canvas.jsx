/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from 'react';
import * as foo from './wasm.js'
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

  const asd = async () => {
    let ctx = canvas.current.getContext('2d');
    let mag = 200;
    let panX = 2;
    let panY = 1.25;
    let maxIter = 100;
    for (let x = 10; x < height; x++)  {
        for (let y = 10; y < width; y++)  {
          //let m = mandelIter(x/mag - panX, y/mag - panY, maxIter);
          let m = await foo(x/mag - panX, y/mag - panY, maxIter);
          ctx.fillStyle = (m === 0) ? '#000' : 'hsl(0, 100%, ' + m + '%)'; 
          ctx.fillRect(x, y, 1,1);
        }
      }
  }
  useEffect(() => {
    let testWASM;
    //asd();

  (async() => {
    const config = {
        env: {
            __memory_base: 0,
            __table_base: 0,
            memory: new WebAssembly.Memory({
                initial: 256,
            }),
            table: new WebAssembly.Table({
                initial: 0,
                element: 'anyfunc',
            }),
        }
      }
      const fetchPromise = fetch(process.env.PUBLIC_URL + '/hello.wasm');
      const {instance} = await WebAssembly.instantiateStreaming(fetchPromise, config);
      testWASM = instance.exports.mandelIter;
      let ctx = canvas.current.getContext('2d');
    let mag = 200;
    let panX = 2;
    let panY = 1.25;
    let maxIter = 100;
    for (let x = 10; x < height; x++)  {
        for (let y = 10; y < width; y++)  {
          //let m = mandelIter(x/mag - panX, y/mag - panY, maxIter);
          let m = testWASM(x/mag - panX, y/mag - panY, maxIter);
          ctx.fillStyle = (m === 0) ? '#000' : 'hsl(0, 100%, ' + m + '%)'; 
          ctx.fillRect(x, y, 1,1);
        }
      }
  })();
                    
    });
  return <canvas ref={canvas} width={width} height={height} />;
};

export default Canvas;
