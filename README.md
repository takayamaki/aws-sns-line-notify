# aws-sns-line-notify
This is a sample that is send notification to [LINE Notify](https://notify-bot.line.me/) when recived message's subject from AWS SNS topic.

## caution
**This sample is NOT crypt LINE Notify secret.**  
Because, [CloudFormation cannot create SecureString of SSM Parameter Store](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html).

If you want to use this in production, you should load secret with SecureString of SSM Parameter Store, KMS and IAMRole.

## How to use
1. Execute `yarn install`
1. Copy `config/config.yml.sample` to `config/(your any environment name).yml`
1. Issue token by [LINE Notify](https://notify-bot.line.me/).
1. Fill your environment YAML.
1. Execute `yarn run sls deploy -s {your environment name} -v`
1. Test created lambda by [test data](https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-sns).
1. You will see `{snsTopicName in YAML}_{your environment name}_sns_topic` in SNS topic page of AWS Web console.
1. Associate the topic to some data source by AWS Web console or any other tools.
