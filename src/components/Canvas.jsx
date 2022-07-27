import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import "./Canvas.css";

function Canvas(props) {
  const [canvas, setCanvas] = useState("");
  const [file, setFile] = useState(null);

  const initCanvas = () =>
    new fabric.Canvas("canvas", {
      height: 500,
      width: 800,
      backgroundColor: "#61dafb",
      selection: false,
      renderOnAddRemove: true,
    });

  useEffect(() => {
    let canvas = initCanvas();
    setCanvas(canvas);

    ///ZOOMING
    canvas.on("mouse:wheel", function (opt) {
      let delta = opt.e.deltaY;
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;

      if (zoom > 20) zoom = 20;
      if (zoom < 1) zoom = 1;
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);

      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    // destroy fabric on unmount
    return () => {
      canvas.dispose();
      canvas = null;
    };
  }, []);

  const addImg = (e, file, canvas) => {
    e.preventDefault();
    const url = URL.createObjectURL(file);

    new fabric.Image.fromURL(url, (img) => {
      img.set({
        left: 0,
        top: 0,
      });
      img.scaleToHeight(canvas.height);
      img.scaleToWidth(canvas.width);

      canvas.add(img);
      canvas.renderAll();
    });
  };

  const onImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
    } else {
      setFile(null);
    }
  };
  return (
    <div className="canvas-container">
      <form onSubmit={(e) => addImg(e, file, canvas)}>
        <label htmlFor="file" className="file__input">
          Select Image
          <input id="file" type="file" onChange={onImageChange} />
        </label>
        {file && <span className="imageName">{file.name}</span>}
        <button className="btn-add" type="submit">
          Add Image
        </button>
      </form>
      <canvas id="canvas" />
    </div>
  );
}

export default Canvas;
