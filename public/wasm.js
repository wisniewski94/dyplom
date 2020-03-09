let mandelIterWASM;

const loadWasm = filename => {
    return fetch(filename)
        .then(response => response.arrayBuffer())
        .then(bits => WebAssembly.compile(bits))
        .then(module => {return new WebAssembly.Instance(module)});
}

loadWasm("test.wasm").then(instance => {
    //   const mandelIterWASM = wasm._Z10mandelIterffi;
    mandelIterWASM = instance.exports._Z10mandelIterffi;
});

const testWASM = async (x, y, z) => {
    const fetchPromise = fetch('test.wasm');
    const { instance } = await WebAssembly.instantiateStreaming(fetchPromise);
    const result = instance.exports._Z10mandelIterffi(z, y, z);
    return result;
};