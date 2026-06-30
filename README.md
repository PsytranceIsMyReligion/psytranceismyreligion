# psytranceismyreligion
Crowdsourced Enlightenment

## Project Overview
A full-stack application consisting of an Angular frontend and a Node.js Express backend. It provides a platform for crowdsourced enlightenment.

## Tech Stack - MEAN
- **Frontend:** Angular 9
- **Backend:** Node.js, Express
- **Database:** MongoDB

## Project Structure
- `/frontend`: Angular 9 frontend application
- `/backend`: Node.js Express backend application

## Prerequisites
- Node.js and npm installed
- MongoDB installed and running on default port (27017)

## Installation

After cloning the repo, install the dependencies for both backend and frontend:

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Running the Application

Ensure MongoDB is up and running.

### Start the Backend
```bash
cd backend
npm run dev
```

### Start the Frontend
```bash
cd frontend
npm start
```

App runs on [http://localhost:4200](http://localhost:4200)

## Deployment Instructions (Bitnami)

The application is deployed on a Bitnami environment.

**SSH User:** `bitnami`

```bash
cd /home/bitnami/projects/psytranceismyreligion/frontend
sudo /opt/bitnami/ctlscript.sh stop apache
sudo /opt/bitnami/ctlscript.sh stop mongodb

git pull
npm run-script build

sudo rm -r /opt/bitnami/apache2/htdocs
sudo cp -avf dist/frontend/ /opt/bitnami/apache2/htdocs/

sudo /opt/bitnami/ctlscript.sh start mongodb
sudo /opt/bitnami/ctlscript.sh start apache

cd ../backend
forever start server.js
```

### Bitnami Service Commands
- **Stop:** `sudo /opt/bitnami/ctlscript.sh stop`
- **Start:** `sudo /opt/bitnami/ctlscript.sh start`
- **Restart:** `sudo /opt/bitnami/ctlscript.sh restart`
