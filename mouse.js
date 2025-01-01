 // =========================================================
    // MOUSE / DRAWING HANDLERS
    // =========================================================
    function onMouseDown(e) {
      const { x, y } = getMousePos(e);
      switch (mode) {
        case 'draw':
          startDrawing(x, y, 'black', lineWidth);
          break;
        case 'erase':
          startDrawing(x, y, 'white', eraserWidth);
          break;
        case 'start':
          startPoint = { x, y };
          drawMazeState();
          revertToDrawMode();
          break;
        case 'end':
          endPoint = { x, y };
          drawMazeState();
          revertToDrawMode();
          break;
      }
    }

    function onMouseMove(e) {
      if (!drawing) return;
      const { x, y } = getMousePos(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    function onMouseUp() {
      if (drawing) {
        drawing = false;
        ctx.closePath();
        drawMazeState();
        if (!solving) {
          mazeImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
      }
    }

    function startDrawing(x, y, color, width) {
      drawing = true;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    function revertToDrawMode() {
      document.querySelector('input[value="draw"]').checked = true;
      mode = 'draw';
    }
