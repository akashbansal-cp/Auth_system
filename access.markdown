---

Has not been deployed to any server
Reason:
heroku was the only one hosting service which i found that supports mysql for free but require credit card, which I don't have.
but it works fine on my local machine.

---

- Screenshot are placed in screenshot folder

- Request were made using request.rest file which requires REST client in vs-code.
- mysql_query file contains the code which is required to run manually to create database and table.

Supported routes
listening port 5000

-- /
    provide authentication message

-- /sign_up
    required data
        -name validation(alphanumeric 5<=length<=35)
        -email vaidataion(valid email address)
        -username validation(alphanumeric 5<=lenght<=35)
        -password validation(length >= 5)
    ERRORS:
    --return any input validation error
    --user already exists or not
    NONERROR:
    --user created

-- /login
    required data
        -username validation(alphanumeric 5<=lenght<=35)
        -password validation(length >= 5)
    ERRORS:
    --return any input validation error
    --User exists or not
    --Wrong Password provided by user
    NONERROR:
    --User Logged In
    --Name, Username, Email

-- /logout
    required data
        -username validation(alphanumeric 5<=lenght<=35)
    ERRORS:
    --return any input validation error
    --User exists or not
    NONERROR:
    --User Successfully Logged out

-- /users
    --HIGHLY INSECURE ROUTE
    --LEAK WHOLE INFO IN DATABASE
    NONERROR:
    -- Return all the rows in our database

-- /delete
    required data
        -username validation(alphanumeric 5<=lenght<=35)
        -password validation(length >= 5)
    ERRORS:
    --return any input validation error
    --User exists or not
    --Wrong Password provided by user
    NONERROR:
    --Delete user successfully

