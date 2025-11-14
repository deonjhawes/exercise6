function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        const userData = {
          id: userId,
          name: `Deon${userId}`,
          email: `user${userId}@gmail.com`
        };
        resolve(JSON.stringify(userData,null,2));
      } else {
        reject("Invalid userId: userId must be a positive number.");
      }
    }, 1500); 
  });
}


fetchUserData(1)
  .then((user) => 
    console.log(user))
  .catch((error) => 
    console.error(error))


  function generateUserHTML(user) {
  return `
        <div class="user-card">
            <h2>${user.name}</h2>
            <p>Email: ${user.email}</p>
            <p>ID: ${user.id}</p>
            <p>signin: ${user.signin}</p>
        </div>
    `;
}
function fetchUserPosts(userId) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {

      if (userId > 0) {
              resolve([
         {
            id: 89744,
            title: "My first post",
            content: "hiii",
            userId: userId
            },
                    {
              id: 555655,
                title: "my second post",
                content: "maths",
                userId: userId
                  }
                ]);
         } else {
                reject(" Error: userId is invalid. .");
            }

        }, 1000); 
    });
}

function getUserWithPosts(userId) {
    return fetchUserData(userId)
        .then(user => {
            
            return fetchUserPosts(user.id).then(posts => {
                return {
                    user: user,
                    posts: posts
                };
            });
        })
        .catch(error => {
            console.error("Error in your promise chain", error);
        });
}

async function getUserWithPosts(userId) {
    try {
        console.log("Step 1: Starting to fetch user data...");
        const user = await fetchUserData(userId);
        console.log("Step 1: User fetched:", user);

        console.log("Step 2: Starting to fetch user's posts...");
        const posts = await fetchUserPosts(user.id);
        console.log(`Step 2: post ${posts.length} fetched ${user.id}.`);

        console.log("Step 3: Combining user and posts...");
        const combined = { user, posts };

        console.log("Step 4: Done — returning combined data.");
        return combined;

    } catch (error) {
       
        console.error("there has been an error fetching user and posts:", error);
        return null;
    }
}

async function fetchMultipleUsers(userIds) {
  
    const promises = userIds.map(id =>
        fetchUserData(id).catch(error => {
            console.error(JSON.stringify(`Error fetching user ${id}:`, error));
            return null; 
        })
    );

    const results = await Promise.all(promises);

  
    return results.filter(user => user !== null);
}

async function fetchUsersAndPosts(userIds) {
    try {
        
        const userPromises = userIds.map(id =>
            fetchUserData(id).catch(err => {
                console.error(`Error fetching user ${id}:`, err);
                return null; 
            })
        );

        const users = await Promise.all(userPromises);
        
        const validUsers = users.filter(u => u !== null);

  
        const postsPromises = validUsers.map(user =>
            fetchUserPosts(user.id).catch(err => {
                console.error(`Error fetching posts ${user.id}:`, err);
                return [];
            })
        );

        const allPosts = await Promise.all(postsPromises);

        const combined = validUsers.map((user, index) => {
            return {
                user: user,
                posts: allPosts[index]
            };
        });

        return combined;

    } catch (error) {
        console.error("an error has occured", error);
        return [];
    }
}

async function testUserFetch() {
    console.log(" TEST: Single User Fetch ");
    try {
        const singleUser = await fetchUserData(2);
        console.log("Single user fetched successfully:", singleUser);
    } catch (error) {
        console.error(JSON.stringify("Error fetching single user:", error) );
    }

    console.log("\nTEST: Multiple User Fetch ");
    try {
        const multipleUsers = await fetchMultipleUsers([2, 3, 4]);
        console.log(JSON.stringify("Multiple users fetched successfully:", multipleUsers));
    } catch (error) {
        console.error("Error fetching multiple users:", error);
    }

    console.log("\nTEST: Error Handling ");
    try {
        const badUser = await fetchUserData(5);
        console.log("This should NOT print:", badUser);
    } catch (error) {
        console.error("Expected error caught:", error.message);
    }
}

testUserFetch();