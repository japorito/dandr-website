# Installation
Dependencies:  
memcached  
mongodb

`git clone https://github.com/japorito/dandr-website.git`  
`cd dandr-website && npm install`

Set up mongodb users, and make sure there is a user with the userAdmin role. (preferably userAdminAnyDatabase).  
Edit /etc/mongodb.conf to turn on authentication

Fill out config (see config-example.js) and rename to config.js


# To-do
set secure : true when https is available
