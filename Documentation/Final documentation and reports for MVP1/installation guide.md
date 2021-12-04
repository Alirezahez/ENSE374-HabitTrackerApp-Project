Installation requirement and guideline

DB:
Download MangoDB

https://www.mongodb.com/try/download/community


____________________________________________________________________________
Download Node.js
https://nodejs.org/en/download/

____________________________________________________________________________
Downloading the project:
 copy the url of the repo then create a local folder. Using a terminal window clone it into that folder.

comand: git clone https://github.com/Alirezahez/ENSE374-HabitTrackerApp-Project.git
____________________________________________________________________________

Creating the .env file

* Create a file directly within src/ named .env and within the file.
* add the text SECRET = “ ”, with any words you would like within the quotations.

You should now have src/.env with e.g. SECRET = “SOME TEXT HERE” in the file.
____________________________________________________________________________
Dependancies 

dependancies to install:

npm install
npm install express

____________________________________________________________________________

For mongod:

In a terminal of the location of the project:
commands:
mongod

____________________________________________________________________________
Running the project locally:

comand:
nodemon 
or 
node app.js

You should be able to view the app in the localhost:3000
____________________________________________________________________________

Workibng with git:

1-git commit -m "changes in statistics HTML page."
2- git push origin main
