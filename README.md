# psytranceismyreligion
Crowdsourced Enlightenment 

# Tech Stack - MEAN

Angular 6
MongoDb
Express
Node

After cloning the repo, go into /backend and run > npm install
                        go into /frontend and run > npm install
                        
To run the backend > npm start dev
To run the frontend > ng serve

App runs on http://localhost:4200

Note you will need Mongodb up and running too! Connection is via default port.

cd /home/bitnami/projects/psytranceismyreligion/frontend
sudo /opt/bitnami/ctlscript.sh stop apache
sudo /opt/bitnami/ctlscript.sh stop mongodb
sudo cp -avf dist/frontend/ /opt/bitnami/apache2/htdocs/
npm run-script build --prod
sudo cp -avf dist/frontend/ /opt/bitnami/apache2/htdocs/
sudo /opt/bitnami/ctlscript.sh start apache
sudo /opt/bitnami/ctlscript.sh start mongodb