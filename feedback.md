- Teacher does not wants to capture the geolocation of the user (x, y);
- Suggested me to think about proof of Stake. 
- Proof of work, and verification. 
- one user can verify that other students are present in the class. that no need to store the geo location data into the blockchain. 

- cspring
- seed based wallet implementations. 
- consiouncuos in the blockchain


- all the student will be having an mobile applicatiion. 
- they logged with thier ID's and email, verify Email, and then opens the app. 
- the active session will be popped on front. 
- app allow the user to access the device location.
- user select participate checks the nearby users with the same app. 
- find each students id, and thier locations. 
- system will pick one master or validattors, in each day entry. the master calculates all the data, and store those data into the blockchain). once the data is stored. the user's will get notioficed, that the attendance is captured successfully. 

- proof of stake to be implementd. 
- how the master app finds the users nearby, and validates the data and share the data to the api. 
- it has to share to the api, ( UserID, SessionID ) - what to send, what to store in the blockchain.

- which blockchain to use. cheapsest option in need. 
- how to dsign smart contracts. 
- how to host the blockchian arthitecture.
- how to connect with node js server. 
- How user's later can verify that the data is a valid data, each attendence captured. 


--My approach. 
1. teacher cretes the session. 
2. students opens the app. 
3. who ever is assigned to that course, or specefic session. then student get's the attendence notificatoin. 
4. student taps and participate. 
5. Share the location data and verifies the details. 
6. get's acknoledge. 

I am still thinking how to make this process so simple, and clean. so there will be no multiple steps, and it can be done just within a minute or so. 

I am more concern about how do i calculate the distance between each nodes and prepare a data. 

- when one user is assigned a master, tnen what if some user's are not opening the locatoin services in thier device. then there will be a proble, as well. all the users will not be able to participate. 

- how to make sure thjat all the users are connected to the network. 
- as this is the attendence process, we can't tell stuedents to stay longer for the operatoin. 


- i need in which format to send data to the server. from the client. 
- how to collect data, technical guidence. 


- BLE - bluetooth works
- not sure. 
even for bluetooth, i need to ask for access. 
- each user will have thier private and public key pairs. 
- user login with email, id, - assign private key, annd public key stays in the blockchian.
- host agreegates the data, user data. peer data. 
- validates and store the data with the master/validators signatures. 



- studnet can query the data and check from the blockchain. 
