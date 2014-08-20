sudo NODE_ENV=production PORT=80 HANDHELD_DATA_PATH=/home/ftpclient screen -dm sails lift
sudo screen -dm node worker.js
echo "deployment started"
