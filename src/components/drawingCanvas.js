import React, { useRef, useEffect, useState } from "react";
import "../App.css";
const shapeCoefficients = {
  pentagon: [0.5, -0.25, 0.25, -0.25, 0.25, -0.25, 0, 0, 0, 0],

  decagon: [
    0.5, -0.25, 0.25, -0.25, 0.25, -0.25, 0.25, -0.25, 0.25, -0.25, 0.25, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
  ],
};

function calculateFourierSeries(time, coeffs) {
  const numCoeffs = coeffs.length / 2;
  const points = [];
  for (let n = 0; n < numCoeffs; n++) {
    const freq = n + 1;
    const amplitude = Math.sqrt(coeffs[n] ** 2 + coeffs[numCoeffs + n] ** 2);
    const phase = Math.atan2(coeffs[numCoeffs + n], coeffs[n]);
    const x = amplitude * Math.cos(freq * time + phase);
    const y = amplitude * Math.sin(freq * time + phase);
    points.push({ x, y });
  }
  return points;
}

function DrawingCanvas() {
  const [selectedShape, setSelectedShape] = useState("pentagon");
  const canvasRef = useRef(null);

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    let animationFrameId;
    let time = 0;

    const render = () => {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      const coeffs = shapeCoefficients[selectedShape];
      const points = calculateFourierSeries(time, coeffs);
      drawShape(context, points);
      time += 0.01;
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [selectedShape]);

  const drawShape = (context, points) => {
    const canvasWidth = context.canvas.width;
    const canvasHeight = context.canvas.height;

    const xScale = canvasWidth / 2;
    const yScale = canvasHeight / 2;
    const xOffset = canvasWidth / 2;
    const yOffset = canvasHeight / 2;

    context.beginPath();
    context.moveTo(
      points[0].x * xScale + xOffset,
      points[0].y * yScale + yOffset
    );
    for (let i = 1; i < points.length; i++) {
      context.lineTo(
        points[i].x * xScale + xOffset,
        points[i].y * yScale + yOffset
      );
    }
    context.closePath();
    context.stroke();
  };

  const handleChange = (event) => {
    setSelectedShape(event.target.value);
  };

  return (
    <div>
      <h1>Fourier Coefficients for Simple Animations</h1>
      <p>
        Fourier coefficients can be used to create simple animations that are
        storage efficient. The Fourier transform can decompose a complex
        function into a series of simpler sine and cosine waves, each with its
        own amplitude and frequency. By adjusting these amplitudes and
        frequencies, it is possible to create a wide variety of animated shapes
        and movements. Because the Fourier coefficients describe the shape of
        the animation at each point in time, it is possible to store the
        animation using only these coefficients, rather than storing each frame
        of the animation individually. This can result in significant storage
        savings, especially for longer or more complex animations.
      </p>

      <select value={selectedShape} onChange={handleChange}>
        <option value="pentagon">Pentagon</option>

        <option value="decagon">Decagon</option>
      </select>

      <canvas ref={canvasRef} width="700" height="700" />
      <p>
        The code defines an object shapeCoefficients that contains two
        properties, pentagon and decagon, each of which is an array of
        coefficients used to define a shape. The calculateFourierSeries function
        takes two arguments, time and coeffs, and uses the coefficients to
        calculate a series of points that define the shape of the object at that
        time. The DrawingCanvas component uses useState to create a state
        variable called selectedShape that defaults to "pentagon". It uses
        useRef to create a reference to a canvas element that will be used to
        display the animation. The component uses useEffect to set up a
        continuous animation loop. The loop uses the requestAnimationFrame
        method to redraw the canvas element at a constant frame rate. It uses
        the calculateFourierSeries function to calculate the points that define
        the shape of the selected object at each frame, and then calls a
        drawShape function to draw the shape on the canvas. The drawShape
        function takes two arguments, a context object and an array of points.
        It uses the moveTo and lineTo methods of the context object to draw a
        polygon using the points. The handleChange function is called when the
        user selects a different shape from a dropdown menu. It updates the
        selectedShape state variable.
      </p>
    </div>
  );
}

export default DrawingCanvas;
