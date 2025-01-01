
    // =========================================================
    // PATHFINDING
    // =========================================================
    function startSolver() {
      if (!startPoint || !endPoint) {
        alert("Please set both a start & end, or draw walls first.");
        return;
      }
      solveStop();

      // Convert to cell coords
      let startCell = {
        x: Math.floor(startPoint.x / cellSize),
        y: Math.floor(startPoint.y / cellSize)
      };
      let endCell = {
        x: Math.floor(endPoint.x / cellSize),
        y: Math.floor(endPoint.y / cellSize)
      };

      // Build walkable grid
      let grid = buildGridFromCanvas();

      // Reset path data
      openSet = [];
      closedSet.clear();
      cameFrom.clear();
      path = [];
      frontierParticles = [];
      solutionParticles = [];
      stepCount = 0;
      visitedCount = 0;
      frontierHistory = [];
      frontierSize = 0;
      maxFrontier = 0;
      pathLength = 0;
      expansionsPerSec = 0;

      startTime = performance.now();
      endTime = 0;

      // Prepare start node
      let sNode = { x: startCell.x, y: startCell.y, g: 0, f: 0 };
      if (chosenAlgo === 'astar') {
        sNode.f = heuristic(sNode, endCell);
      }
      openSet.push(sNode);
      visitedCount++;

      solving = true;
      setStatus(`Solving with ${chosenAlgo.toUpperCase()}...`);
      stepSearch(grid, startCell, endCell);
      // Start a requestAnimationFrame loop to update time
      animateTime();
    }

    function solveStop() {
      solving = false;
      cancelAnimationFrame(animationFrame);
    }

    function stepSearch(grid, startCell, endCell) {
      if (!solving) {
        updateStats(true); 
        return;
      }
      if (openSet.length === 0) {
        alert("No path found!");
        setStatus("No path found");
        solving = false;
        endTime = performance.now();
        updateStats(true);
        return;
      }

      // BFS => no sort
      // Dijkstra => sort by g
      // A* => sort by f
      if (chosenAlgo === 'astar') {
        openSet.sort((a, b) => a.f - b.f);
      } else if (chosenAlgo === 'dijkstra') {
        openSet.sort((a, b) => a.g - b.g);
      }

      let current = openSet.shift();
      addFrontierParticles(current);

      // Goal check
      if (current.x === endCell.x && current.y === endCell.y) {
        reconstructPath(current);
        setStatus("Path found!");
        endTime = performance.now();
        updateStats(true);
        return;
      }

      let directions = [[1,0], [-1,0], [0,1], [0,-1]];
      let currentId = current.y * grid[0].length + current.x;
      closedSet.add(currentId);

      for (let d of directions) {
        let nx = current.x + d[0];
        let ny = current.y + d[1];
        if (!isWalkableCell(grid, nx, ny)) continue;

        let nid = ny * grid[0].length + nx;
        if (closedSet.has(nid)) continue;

        let neighborNode = openSet.find(n => n.x === nx && n.y === ny);
        let cost = current.g + 1;
        if (!neighborNode) {
          neighborNode = { x: nx, y: ny, g: cost, f: cost, from: current };
          if (chosenAlgo === 'astar') {
            neighborNode.f = neighborNode.g + heuristic(neighborNode, endCell);
          } else if (chosenAlgo === 'bfs') {
            neighborNode.f = 0;
          }
          cameFrom.set(nid, current);
          openSet.push(neighborNode);
          visitedCount++;
        } else {
          if ((chosenAlgo === 'astar' || chosenAlgo === 'dijkstra') && cost < neighborNode.g) {
            neighborNode.g = cost;
            if (chosenAlgo === 'astar') {
              neighborNode.f = neighborNode.g + heuristic(neighborNode, endCell);
            } else {
              neighborNode.f = cost;
            }
            neighborNode.from = current;
            cameFrom.set(nid, current);
          }
        }
      }

      stepCount++;
      frontierSize = openSet.length;
      if (frontierSize > maxFrontier) maxFrontier = frontierSize;
      drawSearchState();
      updateStats();

      // Speed => bigger => smaller delay
      let delay = 10 / solverSpeed; 
      setTimeout(() => {
        animationFrame = requestAnimationFrame(() => stepSearch(grid, startCell, endCell));
      }, delay);
    }

    function reconstructPath(current) {
      let nodes = [];
      let c = current;
      while (c) {
        nodes.push(c);
        c = c.from;
      }
      nodes.reverse();

      path = nodes.map(n => ({
        x: n.x * cellSize + cellSize / 2,
        y: n.y * cellSize + cellSize / 2
      }));
      pathLength = path.length;

      drawSearchState();
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++){
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.stroke();

      // Spawn solution particles
      for (let i = 0; i < 60; i++){
        solutionParticles.push({
          x: path[0].x,
          y: path[0].y,
          index: 0
        });
      }
      animateSolutionParticles();
    }

    function animateSolutionParticles() {
      if (!solutionParticles.length) return;

      ctx.putImageData(mazeImageData, 0, 0);
      drawMazeState();

      // Re-draw path
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++){
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.stroke();

      if (hazeEnabled) {
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(mazeImageData, 0, 0);
        drawMazeState();
        // Path again
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++){
          ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
      }

      for (let p of solutionParticles) {
        if (p.index < path.length - 1) {
          let target = path[p.index + 1];
          let dx = target.x - p.x;
          let dy = target.y - p.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          let speed = solverSpeed * 30; 
          if (dist < speed) {
            p.x = target.x; 
            p.y = target.y;
            p.index++;
          } else {
            p.x += (dx / dist) * speed;
            p.y += (dy / dist) * speed;
          }
        }
        ctx.fillStyle = 'rgba(0,255,200,0.5)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      if (solutionParticles.every(pp => pp.index >= path.length - 1)) {
        solving = false;
        endTime = performance.now();
        updateStats(true);
        setStatus("Solution animation complete");
        return;
      }
      requestAnimationFrame(animateSolutionParticles);
    }

    // Animate "Time Elapsed" continuously while solving
    function animateTime() {
      if (!solving) return;
      updateStats();
      requestAnimationFrame(animateTime);
    }

    function addFrontierParticles(node) {
      for (let i = 0; i < 4; i++) {
        let angle = Math.random() * Math.PI * 2;
        let dist = Math.random() * 10;
        let px = node.x * cellSize + cellSize / 2 + Math.cos(angle) * dist;
        let py = node.y * cellSize + cellSize / 2 + Math.sin(angle) * dist;
        frontierParticles.push({
          x: px, y: py,
          alpha: 0.3 + Math.random() * 0.2,
          radius: 2 + Math.random() * 3
        });
      }
      frontierParticles = frontierParticles.map(p => {
        p.alpha *= 0.9;
        return p;
      }).filter(p => p.alpha > 0.01);
    }

    function drawSearchState() {
      ctx.putImageData(mazeImageData, 0, 0);
      drawMazeState();
      for (let p of frontierParticles) {
        ctx.fillStyle = `rgba(100,100,255,${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
