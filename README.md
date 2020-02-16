# GifChat

**Has postmodernity rendered you speechless? Does your soul yearn to express itself in a way words cannot? Do you like chatting, but hate typing? Do you like GIFs?**

*GifChat is for you!*

## Table of Contents
[About](#about)
<br>
[Tech](#tech)
<br>
[Why?](#why)
 

<a name="about"></a>
## About

GifChat is a pseudo-anonymous, self-cleaning chat service that only allows users to communicate via animated GIFs.

### Pseudo-anonymous?

GifChat does not care who you are. There is no sign-up process, no login process: Just grab a room and start chatting with a friend or stranger.

### If there are no accounts, how do I know who sent which message?

Good question! This is why only two people can share a room at a time. In that case, it's easy: Either you sent the message, in which case you know who sent it; or you did not, in which case you also know who sent it!

### How do I chat with a friend?
Click on the "Get a room" button to generate a link to a room. You can copy the link, copy the URL or just type or say it to your friend: Room names are designed to be human-readable and fun to make them easy to remember and share.

To enter a room, either paste the link to the room into your URL bar, or enter the name of your room, with hyphens, after clicking the "Go to room" button on the homepage.

### How do I chat with a stranger?
Click on the "Get a rando" button on the homepage to be taken to a room with a random person. This feature obviously benefits from higher user counts, but don't despair if no one's in your room: Leave them a GIF saying hello and check back later; you may find they left you a response!

### Self-cleaning?

GifChat rooms/conversations can and will die of neglect. If a room is generated but never entered, it will be deleted within 24 hours. Once a room has been entered, it's good for seven days past the time it was last entered. This means you can keep a room alive by using it. Have a fun interaction with a stranger and want to GIF with them some more? If you keep the room alive, you can keep the connection alive. Have a particularly funny exchange with a friend or looking for a GIF from one of your conversations? It'll be there, as long as you have recently.

<a name="tech"></a>
## Tech

GifChat is a full-stack web application. The client is hosted [Zeit](https://zeit.co/home) and the server and database are hosted on [Heroku](https://www.heroku.com). Here's the stack:

**Front end**
<br>
HTML5/CSS3/JS
<br>
[React](https://reactjs.org/)
<br>
[Socket.io client](https://socket.io/)

**Back end**
<br>
[Node.js](https://nodejs.org/en/)
<br>
[Express](https://expressjs.com/)
<br>
[Socket.io 2.0](https://socket.io/)
<br>
[PostgreSQL](https://www.postgresql.org/)

For details about how the GifChat API works, check the comments in the source files of [its repo](https://github.com/bradbautista/gifchat-api).

**Misc.**
<br>
[Tenor API](https://tenor.com/gifapi)
<br>
[React Router](https://reacttraining.com/react-router/)
<br>
[node-cron](https://github.com/node-cron/node-cron)
<br>
[Knex](https://knexjs.org/)
<br>
[unique-names-generator](https://github.com/andreasonny83/unique-names-generator#readme)
<br>
[Mocha](https://mochajs.org/) / [Chai](https://www.chaijs.com/) / [Supertest](https://github.com/visionmedia/supertest)
<br>
[Morgan](https://github.com/expressjs/morgan) / [CORS](https://github.com/expressjs/cors) / [Helmet](https://github.com/helmetjs/helmet)

<a name="why"></a>
## Why?

I mean, why not? But mostly: Time, scope, appeal, and a desire to play with new tech.

I wanted a project, and did not have a lot of time to see it from idea to finished product. This meant whatever idea I chose to run with needed to be achieveable as mostly-idea — that is, I want you to be able to enjoy a meal without having to build an entire kitchen to prepare it for you.

For me, this meant dispensing with any sort of user or accounts system, for multiple reasons:
1. **Scope:** It's a bunch of work for something that likely has nothing to do with the core idea. 
2. **Security:** The last thing I want is someone getting credential-stuffed because they reused a password on my silly project.
3. **User-friendliness:** The fact that every website wants your email address is one of the worst parts of the modern web. How many neat tools or services have you balked at because you didn't want to deal with yet another sign-up process? If your app needs users more than anything else, you need them to try it before they leave.
4. **Creative restraint:** How are you going to deal with the implications of not having user accounts?

As I was running down my list of ideas to people to gauge their reactions, one consistently got smiles: "GifChat, a chat room where you can only communicate using GIFs." It sparked joy.

So, we're building a chat service! ...without any sort of user accounts. What does THAT look like?

As I spent time considering the shape of the project, I started to really become interested in and appreciate the type of space and the nature of the exchanges a service like this has the potential to engender. 

When you tear away all of the identifying information about a user, limit their vocabulary and force them to engage with only one other person in a private space, you theoretically eliminate a lot of the vectors for toxicity that exist on social platforms. There are no lynch mobs. There are no unsolicited pictures of genitalia. There are no DMs. There is nothing letting your chat partner know whether you're a man, woman, both, neither or all of the above. There is no handle for them to track you across the Internet with. There are no strings: there's only the room, and the GIFs the Tenor API can serve up.

Getting rid of identifying user information also had interesting security implications: Even if someone were to access a room you had been chatting in, all they would see is a string of GIFs. They could presume context, but it would be projection. It's security through absurdity.

Add a dash of [the Glass Bead Game](https://en.wikipedia.org/wiki/The_Glass_Bead_Game#The_game), and you've got a GifChat!
