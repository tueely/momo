
    // =========================================================
    // RESET & DRAW STATE
    // =========================================================
    function resetCanvas() {
      solveStop();
      startPoint = null;
      endPoint = null;

      ctx.fillStyle = '#fdfdfd';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      mazeImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Reset maze arrays
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          maze[r][c] = { top: true, right: true, bottom: true, left: true };
          visited[r][c] = false;
        }
      }

      // Stats reset
      frontierHistory = [];
      stepCount = 0;
      visitedCount = 0;
      frontierSize = 0;
      maxFrontier = 0;
      pathLength = 0;
      startTime = 0;
      endTime = 0;
      expansionsPerSec = 0;
      updateStats(true);

      setStatus("Canvas reset");
    }

    function drawMazeState() {
      if (startPoint) {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      if (endPoint) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(endPoint.x, endPoint.y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
