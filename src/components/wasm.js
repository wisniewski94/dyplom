let cache;

module.exports = async (x, y, z) => {
  if (cache) {
    return cache(x, y, z);
  } else {
    const config = {
      env: {
        __memory_base: 0,
        __table_base: 0,
        memory: new WebAssembly.Memory({
          initial: 256
        }),
        table: new WebAssembly.Table({
          initial: 0,
          element: "anyfunc"
        })
      }
    };
    const fetchPromise = fetch(process.env.PUBLIC_URL + "/hello.wasm");
    const { instance } = await WebAssembly.instantiateStreaming(
      fetchPromise,
      config
    );
    cache = instance.exports.mandelIter;
    return instance.exports.mandelIter(x, y, z);
  }
};
