
    // =========================================================
    // EVENT LISTENERS
    // =========================================================
    document.querySelectorAll('input[name="mode"]').forEach(radio => {
      radio.addEventListener('change', e => { mode = e.target.value; });
    });
    document.getElementById('algoSelect').addEventListener('change', e => {
      chosenAlgo = e.target.value;
    });
    // Removed Generate Maze Button Event Listener
    document.getElementById('resetButton').addEventListener('click', resetCanvas);
    document.getElementById('startSolverButton').addEventListener('click', startSolver);
    document.getElementById('speedRange').addEventListener('input', e => {
      solverSpeed = parseInt(e.target.value, 10);
    });
    document.getElementById('hazeToggle').addEventListener('change', e => {
      hazeEnabled = e.target.checked;
    });

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
