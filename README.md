# Path Finders

A collection of algorithms using a grid-based and variable weight implementation.

This web application is written in TypeScript and uses the following libraries:

- [heap-js](https://www.npmjs.com/package/heap-js);
- React Bootstrap
- Router Dom

## Search Algorithms

The following algorithms are showcased in this project

### Implemented
- Dikstra's
- A*

### Planned
- Breath First Search
- Dept First Search

## Functionality

As of now, the project is still under development. While a majority of the background functionality is written, the remaining tasks focus on the user interface and display.

### Current Features
All current functions are accessible via the development bar at the bottom, which will be removed for a better user interface in the future:
- Set Random Endpoints
  - Sets a random start and end point, denoted by green and red colors respectively
  - Clears any previous node attributes on the screen (e.g., after running an algorithm).
- Set Random Weights
  - Assigns random weights (1-10) to each node on the screen.
  - Should be pressed after "Set Random Endpoints" (this will be changed later).
  - Values are cleared after pressing `Set Random Endpoints`.
- Algorithm Drop Down and Run
  - Selects the current algorithm to run once the "Run" button is pressed.
- Click Action
  - Sets a 'wall' on a clicked node

The remaining buttons are for debugging purposes.

### Known Issues
- Pressing the "Run" button without setting start and end nodes causes it to get stuck in "running".
- Running two consecutive algorithms without clearing the grid causes overlapping.
- Rare case where start and end node are set on the same node.
- Grid click actions should be disabled when an algorithm is thinking/running, or the process should be stopped altogether.
  
These issues can be easily fixed but I've been working on this for longer then I would've liked to. I'm switching gears to something else for the time being.
 
## Running the WebApp

You can run the web application by either visiting the link below or cloning the repository.

### Online 
- [Path Finders](https://emeremikwu.github.io/Path-Finders/)

### Local 
1. Download and install the latest version of Node.js.
2. Clone the repository and navigate to the directory. 
3. Run the following commands to build and run a local instance.

```
npm install
npm run build
npm run preview
```
