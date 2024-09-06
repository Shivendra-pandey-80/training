// worker.js

self.onmessage = function(event) {
    const { data, from } = event.data;
  
    for (let i = 2; i <= data.length - 1; i++) {
      let j = 1;
      let result = [];
      
      Object.keys(data[i - 1]).forEach((key) => {
        result.push({ row: i + from, col: j, value: data[i][key] });
        j++;
      });
  
      self.postMessage(result); // Send the result back to the main thread
    }
    self.close(); // Terminate the worker when done
  };