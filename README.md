Silo App
=============
## Key Technologies ##
- node.js
- sails.js
- socket.io
- d3.js
- snapsvg

## Deploy Script##
`sudo NODE_ENV=production PORT=80 HANDHELD_DATA_PATH=/home/ftpclient screen sails lift`
- To deploy with multiple screens:
  - `sudo screen -dm ${COMMAND}`   ex. `sudo screen -dm node worker.js`
- To list current screens active (and switch to a respective one):
  - `sudo screen -ls`
  - `sudo screen -r ${PID}`
- To detach or terminate current screen:
  - Detach: `CTRL+A  CTRL+D`
  - Terminate: `CTRL+C`

## How to Push and Pull ##
- Normal pull: `git pull`
- From food safety: `git pull upstream master`  //ensure upstream exists
- Push: `git push origin master`
