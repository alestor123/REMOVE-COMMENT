#!/usr/bin/env node
'use strict'

const removeComment = require('./App')
const opts = require('./opt')
const options = require('minimist')(process.argv.slice(2))
const prompt = require('prompt-sync')()
const chalk = require('chalk')
try {
  const paths = opts(options)
  if (!yesNo(prompt(chalk.greenBright.bold('Are you sure (Y/n) : ')))) Abort()
  removeComment(paths)
  console.log(chalk.bold.greenBright('Done !!'))
} catch (e) {
  console.log(chalk.redBright.bold('Oops : ' + e.message))
  process.exit(1)
}
function yesNo (res) {
  return res.replace(' ', '').charAt(0).toLocaleLowerCase() === 'y'
}
function Abort (cs) {
  console.log(chalk.redBright.bold('Aborted' + (cs ? ' : ' + cs : ' !!')))
  process.exit(0)
}
