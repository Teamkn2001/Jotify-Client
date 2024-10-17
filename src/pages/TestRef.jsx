import React, { useState, useRef, useEffect } from "react";

const Stopwatch = () => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null); // Step 1: Store the interval ID

  const start = () => {
    if (intervalRef.current) return; // Prevent starting multiple intervals
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current); // Clear the interval
    intervalRef.current = null; // Reset the ref value
  };

  const reset = () => {
    stop();
    setSeconds(0); // Reset the seconds
  };

  // ----------------Mounting part--------------------------------------
  // Step 1: Create a ref using useRef
  const inputRef = useRef(null);

  console.log("inputRef =",inputRef)

  // Step 2: Use useEffect to focus the input when the component mounts
  useEffect(() => {
    inputRef.current.focus(); // Directly accesses the input element
  }, []);



  return (
    <div className="m-40">
      <h1>{seconds} seconds</h1>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>

      {/* mounting */}
      <div>
        <input ref={inputRef} type="text" placeholder="Focus on me automatically!" />
      </div>
    </div>
  );
};

export default Stopwatch;
