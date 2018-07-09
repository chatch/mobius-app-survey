# Survey Opinion Rewards on Mobius

Create surveys and reward those who complete surveys with MOBI tokens. This operates something like Google Opinion Rewards but for the Mobius store.

A base fee of 10 MOBI is charged to create a survey. In addition 1 MOBI per completed survey must be provisioned to reward participants. On survey create you can specify how many survey completions you would like to target. So for example if you want 100 users to complete your survey then the cost of survey creation will be 100 MOBI (to be payed to 100 users as reward) plus 10 MOBI base fee for a total of 110 MOBI.

The 10 MOBI base fee is collected by the DApp and will be later exchanged for STEM tokens and donated to [STEMchain](https://stemchain.io) approved projects.

## Use

Go to the [Mobius App store](https://store.mobius.network/) and find the "Survey Rewards" app.

## Technology

[Mobius](https://mobius.network/) - leverages the Mobius platform to provide crypto payments and authentication 
[SurveyJS](https://surveyjs.io/) - uses the SurveyJS libraries and editor and this app based on the [SurveyJS demo app](https://github.com/surveyjs/surveyjs-nodejs)

## Setup

 * generate a DApp account. See [Mobius docs](https://docs.mobius.network/docs/installation) for more information.
 * copy and fill out one of the config files .env.public.example or .env.test.example to .env.
 * install docker and docker-compose
 * run "docker-compose up"
