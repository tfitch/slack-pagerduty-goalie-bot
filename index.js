// load our Configuration
const env = require('node-env-file');
env(__dirname + '/.env');

// Import modules
const pdClient = require('node-pagerduty');
const jsonQuery = require('json-query');
const Slack = require('slack')

// PagerDuty vars
const pd_time_zone = process.env.PAGERDUTY_TIME_ZONE
const pd_escalation_policy_id = process.env.PAGERDUTY_ESCALATION_POLICY_ID
const pd_api_key = process.env.PAGERDUTY_READONLY_TOKEN;
const pd = new pdClient(pd_api_key);

// Slack vars
const slack_token = process.env.SLACK_TOKEN
const slack_channel_id = process.env.SLACK_CHANNEL_ID
const slack_channel_name = process.env.SLACK_CHANNEL_NAME
const bot = new Slack({slack_token})
// Test your Slack token by uncommenting this API
// bot.api.test({korben:'dallas'}).then(console.log)

bot.channels.join({token:slack_token, name:slack_channel_name}).then(console.log);
// bot.chat.postMessage({token:slack_token, channel:slack_channel_name, text:"slack-pagerduty-goalie-bot testing API"}).then(console.log);

// lookup parameters for PagerDuty
let myPDlookupParams = {
  time_zone: pd_time_zone,
  'escalation_policy_ids[]': pd_escalation_policy_id
};

let OnCalls = function(yourQs) {
  return pd.onCalls.listAllOnCalls(yourQs)
}

let SREonCall = function(SREid) {
  return pd.users.getUser(SREid);
}

let myOnCalls = OnCalls(myPDlookupParams);

myOnCalls.then(function(result) {
  // The user with the value of "escalation_level=1" is the first responder but not obj[0] in the reply.
  // numbers higher than 1 are probably management escalations. Uncomment the next line to see your values
  //  console.log(result.body)
  var SRE = jsonQuery('oncalls[escalation_level=1].user.id', {data: JSON.parse(result.body)})

  // now that we know the SRE on call, get their email
  let mySRE = SREonCall(SRE.value);

  mySRE.then(function(result) {
    // PageryDuty knows our email, Slack uses the username part
    // so parse out the On Call Eng's email ID from their email
    var sreOncallLDAPId = JSON.parse(result.body).user.email.split("@")[0];
    // if needed, uncomment below to verify the ID you've found
    // console.log(sreOncallLDAPId);

    // now that we know the on call Engineer's email, use it in Slack
    bot.channels.setTopic({token:slack_token, channel:slack_channel_id, topic:sreOncallLDAPId + " is the SRE on call."}).then(console.log);
  })
  
})


// Lambda "main": Execution begins here
exports.handler = function(event, context) {
  // but everything already happened above so...  
  return true;
}
