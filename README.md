# cmpe273
LAB 3:
1) Clone the repository and then go into lab3.
2) There are two folders - freelancer_frontend and freelancer-server
3) Go into freelancer_frontend and do npm install.
4) Now execute npm start, to start the frontend on localhost: 3000
5) No Open the freelancer-server in IntelliJ IDE or any preferred IDE. Now Go to pom.xml and right click -> maven-> reimport.
This should get all your dependencies required.
6) Now run the Application.java where Main class resides. Your server should start on 3001 and connect to MySQL DB.
7) You are up and running now.


LAB 2:

1) Connect to AWS via given credentials in the report. Also check and start the instance if stopped.
2) All folders like freelancer-frontend, freelancer-server and freelancer-kafkabackend reside in /home/ec2-            user/cmpe273/freelancer
3) Get the public DNS and change the URL in serverurl.js in freelancer-frontend to get the change to current public DNS as it keeps on changing.
4) Change the origin in CORS in freelancer-backend to point to current public DNS: 3000
5) Goto cmpe273->Lab2->freelancer->freelancer-frontend.
6) Do execute command 'npm install' to get all node_modules
7) similarly do it for freelancer-backend and freelancer-kafkabackend from their directories.
8) After getting node_modules, start the zookeeper and kafka from /home/ec2-user/kafka/kafka_2.11.1.0/kafka_2.11.1.0
9) Once started properly, do 'npm start' in frontend, backend and kafkabackend respectively.
10) Everything should run properly.


LAB 1:

1) For Calculator:


a) For frontend, Goto Lab1->Calculator->calculator->Do npm install here to install the dependency -> Then do execute npm start

b) For server, Goto Lab1->Calculator->CalculatorServer-> Do npm install here to install the dependency -> Then do execute npm start

2) For Freelancer:

a) For frontend, Goto Lab1->Freelancer->freelancer_frontend->Do npm install here to install the dependency -> Then do execute npm start

b) For server, Goto Lab1->Freelancer->freelancer-server-> Do npm install here to install the dependency -> Then do execute npm start


Also in ListAllBids.js component replace /Users/venkateshdevale/Desktop/private git/cmpe273/lab1/Freelancer/freelancer-server at line number 67 with where you copy the Freelancer in your desktop as '/Users/venkateshdevale/Desktop/private git/cmpe273/lab1' is local to me. 

Same for ImageUpload component, at line 94. I could not find some way to use cloud or any other technique.
