# Simulated Annealing for Constrained Optimization

Simulated annealing is a heuristic optimization algorithm that searches for near-optimal solutions to constrained optimization problems by imitating the way heated metal cools into a low-energy crystal structure.

## Constrained optimization

A constrained optimization problem requires finding the best balance among competing factors while keeping the solution feasible. Examples include placing factories, warehouses, and distribution centers while accounting for supplier prices, demand, material use, setup and maintenance costs, production capacity, operating costs, and environmental impact. Exact methods work well when the problem has a simple mathematical form, but problems with many interrelated variables can make exhaustive or exact search impractical.

## Physical annealing analogy

In physical annealing, metal is heated and then cooled slowly. At high temperature, atoms move randomly; as temperature drops, they are less likely to move into higher-energy positions and tend to settle into a low-energy, defect-free crystal arrangement. Slow cooling gives atoms time to escape poor local arrangements before they become fixed.

## Simulated annealing algorithm

In 1983, three IBM researchers adapted this process into an optimization algorithm. The algorithm starts from a random solution and repeatedly applies random changes. Early in the search, it accepts some changes that worsen the objective, analogous to atoms temporarily moving into higher-energy states. This allows the search to escape local optima. As the "temperature" decreases, the algorithm becomes less willing to accept worsening changes and converges toward a near-optimal solution.

## Applications

Simulated annealing has been applied to facility location and product planning, airline route planning under profit, fuel, travel-time, and capacity constraints, protein structure prediction constrained by experimental data and physical feasibility, university exam scheduling, power generator siting, and robot route planning.

> Source: inbox/video/The Most Metal Algorithm in Computer Science [I_0GBWCKft8].mkv · processed 2026-11-25
