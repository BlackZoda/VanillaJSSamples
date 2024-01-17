const tweetLog = document.getElementById('tweets');

function postTweet(log, newPost) {
    const hr = document.createElement('hr');
    log.append(hr);
    postLog(log, newPost);
}

const postLog = (log, newPost) => {
    const p = document.createElement('p');
    const content = document.createTextNode(newPost); 
    p.appendChild(content);
    log.append(p);
}

function failureCallback(error) {
    console.error(`An error occurred: ${error}`);
}

function getUserData(callback, errorCallback) {

    postLog(tweetLog, "1. Requesting user data");

    setTimeout(() => {

    const users = [{
        name: "Winnie-the-Pooh",
        email: "pooh@hundredacrewood.com",
        posts: [
            "What's better than honey on a slice of bread? Two slices with honey on, of course! #HoneyEveryday",
            "Was thinking of counting sheep to fall asleep, but ended up counting paws. I think Piglet stole one of mine in his sleep. #PawMystery",
            "Today, I decided to be a bit adventurous and figure out why rabbits are always so hoppy. The answer? Carrots! #HoppingRabbits",
            "I've been wondering why Piglet always looks like he has a secret. Maybe he's the real master detective in the Hundred Acre Wood? #PigletSecrets",
            "Jotted down all my wise thoughts today, but realized most of them were about honey and syrup. Well, it's important to have priorities! #PhilosophicalBearThoughts"
        ]
    },
    {
        name: "Piglet",
        email: "piglet@hundredacrewood.com",
        posts: [
            "Thought about counting butterflies to cheer myself up, but got distracted by a particularly friendly bee. #ButterflyDistraction",
            "Tried to organize a 'Friendship Brunch' today, but got nervous and invited everyone separately. Ended up with five brunches at the same time. #SociallyAwkwardPiglet",
            "Decided to face my fear of heights by climbing a small hill. It was terrifying! I might need a nap to recover. #BraveLittlePiglet",
            "Wrote a poem about the beauty of dandelions, but accidentally sneezed and scattered the seeds everywhere. I guess it's a 'Dandelion Waltz' now. #PoetPiglet",
            "Started a book club in the Hundred Acre Wood. So far, it's just me and a stack of picture books, but I'm optimistic. #BookishPiglet"
        ]
    }];

        users ? 
            callback(users) :
            errorCallback("Didn't receive user information");

    }, 1000);
}

function getUserPosts(user, callback, errorCallback) {
    postLog(tweetLog, `2. Requesting ${user.name}'s posts`); // Fix: Use ${user.name} instead of $(user.posts)

    setTimeout(() => {
        user.posts ?
            callback(user.posts) :
            errorCallback("Didn't find any posts");
    }, 1000);
}

function getRandomPost(posts, callback, errorCallback) {
    postLog(tweetLog, "3. Requesting random post");

    setTimeout(() => {
        const rnd = Math.floor(Math.random() * posts.length);
        const rndPost = posts[rnd];
        rndPost ?
            callback(rndPost) :
            errorCallback("Didn't find a random post");
    }, 1000);
}


// Callback pyramid of hell
getUserData(
    (users) => {
        const userNames = users.map(user => user.name);
        const rndUserName = userNames[Math.floor(Math.random() * userNames.length)];
        const userObj = users.find(user => user.name === rndUserName);
        if (userObj) {
            getUserPosts(
                userObj,
                (posts) => {
                    getRandomPost(
                        posts,
                        (post) => {
                            postTweet(tweetLog, post);
                        },
                        failureCallback
                    );
                },
                failureCallback
            );
        } else {
            failureCallback("User 'Piglet' not found");
        }
    },
    failureCallback
);

