# Installation
Dependencies:  
memcached  
mongodb

git clone <repo>  
cd dandr && npm install

Set up mongodb users, and make sure there is a user with the userAdmin role. (preferably userAdminAnyDatabase).  
Edit /etc/mongodb.conf to turn on authentication

Fill out config (see config-example.js) and rename to config.js


# To-do
Add to config:  
Google credentials  
Session secret  
Memcached config  
    set secure : true when https is available
