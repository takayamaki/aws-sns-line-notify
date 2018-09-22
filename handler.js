'use strict'
const axios = require('axios')
const qs = require('querystring')

const checkEnvironmentVariable = (context, name) => {
  if (!process.env[name]) {
    context.fail(`Set ${name} environment variable.`)
  }
}

const loadConfig = (context) => {
  checkEnvironmentVariable(context, 'notificationLevel')
  checkEnvironmentVariable(context, 'lineNotifyToken')

  return {
    notificationLevel: process.env['notificationLevel'],
    lineNotifyToken: process.env['lineNotifyToken']
  }
}

const buildRequestBody = (event, context, config) => {
  const record = event.Records[0].Sns

  if (!record.Message) {
    console.log('Message missing!')
    context.fail(event)
  }

  const notifyMessageBody = `[${config.notificationLevel}]\n${record.Subject}`
  console.log(`message:${notifyMessageBody}`)
  const request = {
    'message': notifyMessageBody
  }

  return qs.stringify(request)
}

const sendNotification = (context, config, requestBody) => {
  axios({
    method: 'post',
    url: 'https://notify-api.line.me/api/notify',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${config.lineNotifyToken}`
    },
    data: requestBody
  }).then((response) => {
    console.log('Request to LINE has succeed.')
    context.succeed()
  }).catch((e) => {
    if (e.response) {
      context.fail(`Request to LINE has failed:${e.response.status}\n${e.response.data}`)
    } else {
      context.fail(`Request to LINE has failed:${e}`)
    }
  })
}

exports.notify = (event, context) => {
  const config = loadConfig(context)
  const requestParam = buildRequestBody(event, context, config)
  sendNotification(context, config, requestParam)
}
