# split2mixpanelNodejs

## Integrate Split impressions with MixPanel by way of a node.js lambda

This is a node.js lambda that acts as a Split impressions webhook: parse the impressions to create MixPanel events, base64 encode them, and send them to the MixPanel events endpoint. Available elsewhere as an AWS Java Lambda or Google Cloud Function.

## Pre-requisites

These instructions expect a reader that is adept with AWS lambdas and AWS API gateway. You must also have the node.js package manager, 'npm', installed.  If you have never used npm or git, you can 

```
brew install npm
brew install git
```
... on any OSX terminal.

You will be cloning the node.js repository locally, installing its dependencies, and creating a ZIP archive for upload to AWS.  On AWS, you'll make a new lambda and upload your zip to define it.  Then you'll create an API in the AWS API Gateway to expose your lambda.  Finally, you'll base64 encode your Mixpanel secret and provide it in the URL to Split's impressions webhook.

## Installing

From the OSX command line (other platforms will be virtually the same), make a new directory and 

```bash
git clone https://github.com/dbmartin00/split2mixpanelNodejs.git
cd split2mixpanelNodejs
npm install 
zip -r split2mixpanel.zip .
```

In AWS, create a new lambda called split2mixpanel.  Using the code interface, upload the split2mixpanel.zip you just created.

Your lambda is ready for action, but needs an REST API gateway.  In AWS, build a new REST API.  Give it a POST method and link it to your lambda.  Check the box 'Use Lambda Proxy Integration'.

<img src="http://www.cortazar-split.org/lambda_proxy.png"/>

Deploy the POST method and copy the URL, which will look something like this:

https://ygp1r7dssxx.execute-api.us-west-2.amazonaws.com/prod
 
## Base64 encode your MixPanel secret

Go to https://codebeautify.org/base64-encode

Put your Mixpanel secret into the Base64 Encode entry area and hit the button to Base64 encode.

Now create a url.  Start with the API gateway url from the next step, and add a query parameter with your encoded secret:

```
https://ygp1r7cna6.execute-api.us-west-2.amazonaws.com/prod?m=MjI0OTc5YThmY2MyM2MyNjI0OTAyNjgxYmY5YzIwNmU=
```

## Configure a Split Impressions webhook

From Split's Admin Settings and Integrations, find and create an Impressions webhook for the workspace and environments you want to integrate.

For the URL, use the URL you just created.

The test button should come back a success.  If not, consult the author.

## Author

david.martin@split.io
