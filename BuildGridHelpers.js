
    // =========================================================
    // BUILD GRID & HELPERS
    // =========================================================
    function buildGridFromCanvas() {
      let w = canvas.width, h = canvas.height;
      let gw = Math.floor(w / cellSize), gh = Math.floor(h / cellSize);

      let data = ctx.getImageData(0, 0, w, h).data;
      let grid = [];
      for (let y = 0; y < gh; y++) {
        let row = [];
        for (let x = 0; x < gw; x++) {
          let walkable = true;
          loopPixels: for (let yy = 0; yy < cellSize; yy++) {
            for (let xx = 0; xx < cellSize; xx++) {
              let px = (y * cellSize + yy) * w * 4 + (x * cellSize + xx) * 4;
              let r = data[px], g = data[px + 1], b = data[px + 2];
              if (r < 50 && g < 50 && b < 50){
                walkable = false;
                break loopPixels;
              }
            }
          }
          row.push(walkable ? 1 : 0);
        }
        grid.push(row);
      }
      return grid;
    }

    function isWalkableCell(grid, x, y){
      if (x < 0 || y < 0 || y >= grid.length || x >= grid[0].length) return false;
      return grid[y][x] === 1;
    }

    function heuristic(a, b){
      // Manhattan
      let dx = Math.abs(a.x - b.x);
      let dy = Math.abs(a.y - b.y);
      return dx + dy;
    }
