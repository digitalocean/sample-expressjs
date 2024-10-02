Getting Started with the Sample Express App
This guide will help you deploy a sample Express application on the DigitalOcean App Platform.

Note: Following these steps may incur charges for DigitalOcean services.

Requirements
A DigitalOcean account. If you don't have one, sign up here.
Deploying the App
Click the button below to deploy the app to DigitalOcean App Platform. You’ll be prompted to log in if you’re not already:



Note: Using this button will disable automatic re-deploys when you push changes to the repository.

To enable automatic re-deployment:

Fork the GitHub repository to your account. Click the Fork button in the GitHub repository.
After forking, navigate to your forked repo (e.g., https://github.com/<your-org>/sample-expressjs).
Go to DigitalOcean App Platform, click Create App, select GitHub, and choose your forked repository. Select the main branch.
Configure your app by specifying HTTP routes, environment variables, or adding a database.

Provide a name for your app, select the deployment region, and click Next. The closest region will be selected by default.

On the next screen, leave the default settings and click Next.

Confirm your Plan settings and the number of containers you want to launch, then click Launch Basic/Pro App.

You will see a "Building..." progress indicator. Click View Logs for build details.

Once the build completes, click the Live App link to view your running application.

Making Changes to Your App
If you forked the repo, you can make changes and see them automatically deployed:

Edit index.js, changing "Hello World!" on line 24 to a new greeting.

Commit the change to the main branch (for best practices, create a new branch for changes and merge it after review).

Visit DigitalOcean Apps and navigate to your app.

Watch for the "Building..." progress indicator. Once complete, click the Live App link to see your updated application. You may need to refresh the page.

Learn More
Explore more about the App Platform and application management in the DigitalOcean documentation.

Deleting the App
To delete the sample application when no longer needed:

Visit the Apps control panel at DigitalOcean Apps.
Navigate to your app.
In the Settings tab, click Destroy.
Note: If the app is not deleted, charges will continue to accrue for DigitalOcean services.
