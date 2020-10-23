# vent-chat

demo : [ventchat](http://ventchat.herokuapp.com)
# Instructions

#### 1 . Clone or download this repo

#### 2 . install nodejs/npm and install dependiences using 
>npm i 

####  3. run locally using
> node app.js

#### 4 go to http://localhost:3000/ in web browser 


### Features
- [x] public random chat like omegle,chat42 using socketio
- [x] User Management
    - [x] Login with json web tokens (jwt)
    - [x] Signup with jwt
    - [x] search for other users
    - [ ] User profile picture 
- [x] mongodb schema for user management and conversatons between users
- [x] Friend System backend rest-api
    - [x] Send friend requests
    - [x] Accept friend requests
    - [x] Decline friend requests
    - [x] Cancel friend requests
    - [x] Remove Friends
- [x] Have 1-on-1 conversations with friends(socketio)
    - [x] Store the private messages in a Database
    - [ ] Last seen and online status
- [ ] Frontent 
- [ ] More image assets and ui/ux design
- [x] Add CORS
- [x] Add environment variable for urls,jwt secrets etc
- [ ] loggers in backend
- [ ] Some more features
