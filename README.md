# SYNIVA:

## Develop on local:

To develop on local and get the benefits of "nodemon" is required to use the script `npm run develop` instead of the usual `npm run start`

### SSL:

1. Execute `mkcert "*.dev-syniva.es"` to generate the SSL files required to avoid HTTPS problems.
1. Create an `/SSL` folder in the root of the project and put the SSL files inside
1. Check that `./index.js` file import correctly those files (check routes for example)
1. Configure your local DNS `etc/hosts` to work with custom domain **https://subdomain.dev-syniva.es** and take into account that **this step is required everytime we create a new subdomain/proxy**

# DIGITAL OCEAN README:

## Getting Started

We provide a sample app using Express that you can deploy on App Platform. 

**Note: Following these steps may need the use of a DigitalOcean services.**

### Requirements
1. Make sure to set the environment variables on the Digital Ocean service (take into account that booleans works as string because a bug)