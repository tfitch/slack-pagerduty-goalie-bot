# slack-pagerduty-goalie-bot

This bot will set the Topic in a Slack channel with the name of the on-call engineer for your PagerDuty escalation policy.

## Setting the necessary Environment Variables
Check out the `.env.EXAMPLE` file for the values you need to set as Environment Variables in the process that will execute this job.

This will vary depending on the method you use to run this script.

The `SLACK_TOKEN` value here is what Slack calls a Legacy Token and for me runs as a user, not a bot. This is because the APIs I'm trying to use - setting Channel topic and managing a User Group called "Goalie" are API calls a bot *cannot* make but a user can.  Slack is working to address this gap with Workspace Tokens, but Workspaces Tokens do not (as of Feb 2018) work with Enterprise Grid accounts and that is what I use at work.

## TODO: Automating the running on this bot
* Manage a Slack user group alias called "Goalie" so users on your team can ask for help by asking `@goalie` a question.
* I am expecting to run this as a Lambda function, but it could also just be a Jenkins job. It could change significantly depending on the requirements to run in those environments.  So far this just works in my terminal.
* There is no persistence to know if the On Call Engineer has changed. So running this every five minutes will basically spam your Slack channel.
* Schedule your running of the process based on when the average shift change occurs for your team.
* Make this an actual "bot" that could respond to the question "Who is on call?"
