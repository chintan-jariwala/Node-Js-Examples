This is a basic aaplication that takes some input and stores that input in MongoDb.
Just a simple example showing the intraction between Express and MongoDB.

Note - This projecct does not use package.json file as it was build only for understanding
the bound between node and mongodb.

This project also shows beasic implementation of Cookies and Session and why they are needed.


Details about the Mongodb :-
--------------------------

    Database Name - coder

    Collection Name - coderdetail

    You can create a folder and give that folder as a path to mongodb so it can save the data there.
    like - "mongod --dbpath "<path to your folder>" "

    Mongodb is running on the default port on - 27017


Procedures for Executing the Code :-
----------------------------------

    First run the "task1.js" file with --> node task1.js

    In order to add some coders

        1> Go to "localhost:8081" and follow the forms.
        2> After the last form total database entries will be shown.
        3> Repeat from step 1

    To check cookie functionality

        1> Go to "localhost:8081" and enter a name that is in the database.
        2> A cookie named "hadVisited" would be there.

    To check sorting

        1> Go to "localhost:8081" and enter a name that is in the database.
        2>The sorted list people according to their match will be shown.