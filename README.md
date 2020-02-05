# Getting Started #

This will guide through the steps to install the App Sail CLI (command line interface) and push this repo to a new, live app

**Note: Following these steps will result in charges for the use of DigitalOcean Droplets**

## Requirements

* Docker must be [installed locally](https://docs.docker.com/install/) on your machine, unless you choose to build remotely via Github Actions (beyond the scope of this README)
* You need a DigitalOcean account. If you don't already have one, you can sign up at https://cloud.digitalocean.com/registrations/new
    

## Installing App Sail ##

To install the App Sail CLI, visit https://cloud.digitalocean.com/appsail and choose to Create or Launch a new app. Follow the on-screen instructions for installing the CLI. (On Windows, download and run https://appsail.nyc3.digitaloceanspaces.com/cli/windows/AppSailSetup.exe)

## Downloading the Sample App Source Code

To download the demo app run in your terminal:

	git clone https://github.com/digitalocean-appsail/sample-expressjs.git
	cd sample-expressjs

## Deploying the App ##

	sail push

It will ask for an auth key if you haven't used the sail CLI before. Retrieve it from [the auth page](https://cloud.digitalocean.com/appsail/auth).

Then it will ask how to configure the app.
Answer the questions as follows:

    ✓ Who does this app belong to: <choose your personal account or team>
    ✓ What should this app be called: sample-expressjs
    Let's configure your app for deployment:
    ✓ Choose your configuration preference: Manual...
    ✓ Which Dockerfile: Dockerfile
    ✓ Port to forward requests to: 80
    ✓ What command will run the app:
    ✓ Do you need any background workers: No
    ✓ Do you need a database: No

After that, it will go through a deploy process. Once it's done, you can open the live app or administration dashboard by following the links provided by the App Sail CLI once the push is completed.

## Viewing Application Logs ##

You can view your application's logs by following these steps:
1. Visit the app dashboard at https://cloud.digitalocean.com/appsail
1. Navigate to the sample-expressjs app
1. Click "Logs"

Alternatively, from your terminal while inside your top level application directory (e.g. sample-expressjs), run:

	sail logs --recent
	
Or to see a live stream of your logs, run:

	sail logs

Then visit your live app in your browser to generate some log output (which you'll see in your terminal). Use ctrl-c to stop viewing your log stream in your terminal.
	
To learn more about this command, run `sail logs -h`

## Deleting the App #

When you no longer need this sample application running live, you can delete it by following these steps:
1. Visit the app dashboard at https://cloud.digitalocean.com/appsail
1. Navigate to the sample-expressjs app
1. Choose "App Config"->"Show More"
1. Select "Delete", type your app's name, and click "Delete App".

This will delete the app and destroy any underlying DigitalOcean Droplets. 

**Note: If you don't delete your app, charges for the use of DigitalOcean Droplets will continue to accrue. Also, even if you delete your app, a new push to your sample-expressjs repo on Github will trigger a new deploy which will result in DigitalOcean charges.**
