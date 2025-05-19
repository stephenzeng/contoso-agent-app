# Contoso Agent App

This is a single page application created by Stephen Zeng with Angular standalone components. There is already the highly-customizable web-based client [Bot Framework Web Chat component](https://github.com/microsoft/BotFramework-WebChat). However, this project aims to demostrate how to connect to a Copilot Studio agent with user authentication only through http calls to the Direct Line API, which gives you more control from your client-side app implementation.

The goal is to keep the code clear, simple and intutive with only essentials. For example, it assumes you can already have a way to obtain, with a staightforward tutorial below to help you. 

## Prerequisite

To run the app locally and connect it to your Copilot Studio agent, ensure the following are in place:

- A Copilot Studio agent created and published. [[Microsoft Learn - Quickstart: Create and deploy an agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-get-started)]
- Manual authentication is configured for your Copilot Studio agent. [[Microsoft Learn - Configure user authentication with Microsoft Entra ID](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-authentication-azure-ad)]
- An app registration for this client app is created. [[Microsoft Learn - Create app registrations for your custom website](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configure-sso)]
- Be able to get the required user access token. [[Microsoft Learn - Tutorial: Add sign in and sign out in your Angular single-page application](https://learn.microsoft.com/en-us/entra/identity-platform/tutorial-single-page-apps-angular-sign-in-users-app)]

## Launch the app

- In your agent in Copilot Studio, go to Channels, click Direct Line Speech, copy the Token Endpoint
- Go to agent.service.ts file, paste the connection string to the variable agentTokenUrl
- Run from the app folder path in your terminal:

```bash
npm install
ng serve -o
```

Once the server is running, it should open your browser and navigate to `http://localhost:4200/`. 
