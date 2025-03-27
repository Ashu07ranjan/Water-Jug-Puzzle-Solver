function solve() {
    // Get user input
    const jug1Cap = parseInt(document.getElementById('jug1').value);
    const jug2Cap = parseInt(document.getElementById('jug2').value);
    const target = parseInt(document.getElementById('target').value);

    // Validate input
    if (isNaN(jug1Cap) || isNaN(jug2Cap) || isNaN(target)) {
        alert("Please enter valid numbers!");
        return;
    }

    if (target > Math.max(jug1Cap, jug2Cap)) {
        document.getElementById('solution').innerText = "Target cannot be larger than the biggest jug!";
        return;
    }

    // Solve the puzzle
    const solution = waterJugSolver(jug1Cap, jug2Cap, target);

    // Display solution
    const solutionDiv = document.getElementById('solution');
    if (solution[0] === "No solution found!") {
        solutionDiv.innerText = "No solution exists for these inputs.";
    } else {
        solutionDiv.innerHTML = "<strong>Solution Steps:</strong><br><br>" + 
            solution.map((step, i) => `${i+1}. ${step}`).join('<br>');
    }
}

function waterJugSolver(jug1Cap, jug2Cap, target) {
    const visited = new Set();
    const queue = [];
    queue.push({ jug1: 0, jug2: 0, steps: [] });

    while (queue.length > 0) {
        const { jug1, jug2, steps } = queue.shift();

        // Check if we've reached the target
        if (jug1 === target || jug2 === target) {
            return steps;
        }

        // Skip if we've been in this state before
        const stateKey = `${jug1},${jug2}`;
        if (visited.has(stateKey)) {
            continue;
        }
        visited.add(stateKey);

        // Generate all possible next states
        const nextStates = [
            // Fill jug1
            { 
                jug1: jug1Cap, 
                jug2: jug2, 
                steps: [...steps, `Fill Jug1 (${jug1Cap}L)`] 
            },
            // Fill jug2
            { 
                jug1: jug1, 
                jug2: jug2Cap, 
                steps: [...steps, `Fill Jug2 (${jug2Cap}L)`] 
            },
            // Empty jug1
            { 
                jug1: 0, 
                jug2: jug2, 
                steps: [...steps, "Empty Jug1"] 
            },
            // Empty jug2
            { 
                jug1: jug1, 
                jug2: 0, 
                steps: [...steps, "Empty Jug2"] 
            },
            // Pour from jug1 to jug2
            { 
                jug1: Math.max(0, jug1 - (jug2Cap - jug2)), 
                jug2: Math.min(jug2Cap, jug2 + jug1), 
                steps: [...steps, `Pour Jug1 -> Jug2 (${Math.min(jug1, jug2Cap - jug2)}L)`] 
            },
            // Pour from jug2 to jug1
            { 
                jug1: Math.min(jug1Cap, jug1 + jug2), 
                jug2: Math.max(0, jug2 - (jug1Cap - jug1)), 
                steps: [...steps, `Pour Jug2 -> Jug1 (${Math.min(jug2, jug1Cap - jug1)}L)`] 
            }
        ];

        // Add valid states to the queue
        for (const state of nextStates) {
            const key = `${state.jug1},${state.jug2}`;
            if (!visited.has(key)) {
                queue.push(state);
            }
        }
    }

    return ["No solution found!"];
}