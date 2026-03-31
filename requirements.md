![image.png](attachment:d255d443-86d5-43a7-9f79-7c5a1c9abc3f:image.png)

For your project, I am asking you to implement a full stack React application that represents a community of developers sharing programmer-humor jokes with each other. For this application, we are going to be using Tanstack Start, a React framework that makes it easier for us to abstract away the need to manually set up a web server to connect our React app with a database. 

## Requirements:

### **Homepage**

When I visit your homepage, there should be a simple landing page that gives a short bit of information about your app, similar to the welcome message that you see in the picture above. Try to put some effort into styling the application so that it looks reasonably presentable. It doesn’t have to look like my version above, but however you wish. 

Notice that on the homepage, there’s a section that’s supposed to show the list of jokes. If there are no jokes in the database, you should simply show: **No jokes found.** 

However if there *are* some jokes in the database, you should list them all out. Each joke needs to have 2 things associated with it:

1. The joke itself (joke content)
2. The joke score. 

The score of a joke represents how well received it is by others. People can vote a joke up or down. 

## Important Considerations:

We need a way to add jokes, and the approach I recommend is having a page that allows users to Add a joke. What I did was I created a link on my homepage in the navigation bar, **but importantly, you should ensure that the link is disabled for users who are *not signed in.*** 

![image.png](attachment:63cd31e8-3842-4138-af45-45af9053bb08:image.png)

Your users might try to get clever and circumvent this by directly typing in the url bar the url of the add joke page without signing in. Ensure that if they try to get clever and visit the page without signing it, you show them something like this:

![image.png](attachment:9e2a81c9-95b0-4d1c-8cc6-f0a808131b09:image.png)

Okay, now assuming that they *are* signed in, you can show them a form that allows them to add a joke. It’s up to you how you want to structure this. You could represent your joke in the database as a single string (a field called `content` for example), *or* you could structure it in 2 separate strings like: `setup` and `punchline`. I decided to go with the latter but you can choose whatever you wish. 

For example:

![image.png](attachment:70cd879e-1029-4df5-9155-bf3cf53b85a4:image.png)

So upon clicking Save Joke, the joke should be added to the database, and you should navigate the user back to the home page where the joke should now be visible. Let’s see how that looks:

![image.png](attachment:75d4855c-c4af-454e-b46d-1b02c0747899:image.png)

Cool! We can see the joke. By default, given that it’s the only joke in our system, it automatically makes it into the Top 3 Jokes. Let’s add a few more.

![image.png](attachment:e329a46e-0f00-499e-a992-d9ee8f40d866:image.png)

Notice that on the 4th joke, a new category is formed called More Jokes. In order to be in the Top 3 Jokes category, you need to have the highest number of votes. Currently, the first 3 jokes automatically made it in, but let’s upvote the “Why did the function” joke at the bottom.

![image.png](attachment:57c38aff-069d-40d2-ab4d-853884d90cf2:image.png)

Notice that it now moved into the Top 3 Jokes. Let’s upvote a few more jokes. At this point, it should be more clear how things are working:

![image.png](attachment:4b4827b4-4e44-4a06-acc5-2f64389983a6:image.png)

The top 3 jokes with the most points are in the Top 3 section. The remaining jokes are in the “More Jokes” section at the bottom.

In reality, you would want to make sure that:

1. Only logged in users can upvote or download jokes
2. You can only upvote or downvote a joke one single time. 

For this project, I’m not too concerned with whether or not you add those constraints. **But I do want you to add the ability to delete a joke**. Notice that the delete button shows up on every joke. This is because I am the creator of all of those jokes, and thus, I am allowed to delete them. If another user creates a joke, you should *not be allowed to delete their joke**, and should not be able to see the delete button on their joke.*** 

Ensure that all the functionality I have described works together with better-auth. You should be using a database for this application, and in class, I demo-ed the functionality using Neon DB (Postgres) + Drizzle, but you are welcome to use any database you want. I am familiar with most database vendors and ORMs, so I should be able to make sense of your code regardless of how you choose to implement the backend. 

When you are finished, ensure you have your code pushed to a github repository that I can access to view and run your code.