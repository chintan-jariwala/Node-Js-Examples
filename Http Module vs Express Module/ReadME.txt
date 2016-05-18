This repository shows just a basic Node js Application.
This is devided into 2 tasks. 

Task 1 is a shows a simple Web aaplication that takes input from a user
and saves it.
It also perfroms a search based on the URL as shown below.
For task1 :

    1. http://localhost:8081/ - Gives the form page
    2. http://localhost:8081/coders - Gives all the coders
    3. http://localhost:8081/coders?firstname=<any name> - Filters output by first name
    4. http://localhost:8081/coders?languages=<any language> - Filters output by languages
    5. http://localhost:8081/coders?day=<any day> - Filters output by days
    6. http://localhost:8081/coders?favLang=<any language> - Filters output by Favourite Language

In the task2 the same functionality is implemented except the web application written here
is using Express module of Node Js.

For task2 :

    1. http://localhost:8081/ - Gives the form page
    2. http://localhost:8081/coders - Gives all the coders
    3. http://localhost:8081/coders?firstname=<any name> - Filters output by first name
    4. http://localhost:8081/coders?languages=<any language> - Filters output by languages
    5. http://localhost:8081/coders?day=<any day> - Filters output by days
    6. http://localhost:8081/coders?favLang=<any language> - Filters output by Favourite Language
    7. http://localhost:8081/get_coder/firstname/<any name> - Filters output by first name
    8. http://localhost:8081/get_coder/lastname/<any name> - Filters output by last name