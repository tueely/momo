
    // =========================================================
    // GRAPH DRAWING (Frontier size)
    // =========================================================
    function drawGraph() {
      graphCtx.fillStyle = '#f1f1f1';
      graphCtx.fillRect(0, 0, graphCanvas.width, graphCanvas.height);

      frontierHistory.push(frontierSize);
      if (frontierHistory.length < 2) return;

      let maxVal = Math.max(...frontierHistory);
      let steps = frontierHistory.length;
      let xScale = graphCanvas.width / (steps - 1);
      let yScale = maxVal > 0 ? graphCanvas.height / maxVal : 1;

      graphCtx.strokeStyle = 'blue';
      graphCtx.lineWidth = 2;
      graphCtx.beginPath();
      graphCtx.moveTo(0, graphCanvas.height - frontierHistory[0] * yScale);
      for (let i = 1; i < steps; i++) {
        let xPos = i * xScale;
        let yPos = graphCanvas.height - frontierHistory[i] * yScale;
        graphCtx.lineTo(xPos, yPos);
      }
      graphCtx.stroke();
    }
