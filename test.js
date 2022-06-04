'use strict'
const removeComment = require('./App')
const tap = require('tap')
const { join, resolve } = require('path')
const { readFileSync, writeFileSync, readdirSync, existsSync } = require('fs')

const commentRegex = /(?:((a&&[^a])(?:(?:\\\\)|\\\2|(?!\\\2)\\|(?!\2).|[\n\r])*\2)|(\/\*(?:(?!\*\/).|[\n\r])*\*\/)|(\/\/[^\n\r]*(?:[\n\r]+|$))|((?:=|:)\s*(?:\/(?:(?:(?!\\*\/).)|\\\\|\\\/|[^\\]\[(?:\\\\|\\\]|[^]])+\])+\/))|((?:\/(?:(?:(?!\\*\/).)|\\\\|\\\/|[^\\]\[(?:\\\\|\\\]|[^]])+\])+\/)[gimy]?\.(?:exec|test|match|search|replace|split)\()|(\.(?:exec|test|match|search|replace|split)\((?:\/(?:(?:(?!\\*\/).)|\\\\|\\\/|[^\\]\[(?:\\\\|\\\]|[^]])+\])+\/))|(<!--(?:(?!-->).)*-->))/igm

// add arg test
tap.test('Error test', async ({ throws }) => {
  throws(() => removeComment(), new Error('Please enter a valid path array'))
  throws(() => removeComment([]), new Error('Please enter a valid path array'))
  throws(() => removeComment(['./twedwedest/']), new Error('Please enter a valid path array'))
  throws(() => removeComment(['./twedwedest.js']), new Error('Please enter a valid path array'))
})
tap.test('Output test', ({ equal, end }) => {
  const dirs = readdirSync('./test/tst')
  dirs.push('lol.ts')
  const readbf = dirs.map(cont => {
    const temppth = existsSync(join('./test/', cont)) ? join('./test/', cont) : join('./test/tst', cont)
    return {
      cnt: readFileSync(resolve(temppth), 'utf8'),
      path: resolve(temppth)
    }
  })
  removeComment(['./test/tst/', './test/lol.ts'])
  readbf.forEach(({ path, cnt }, index) => {
    equal(commentRegex.test(readFileSync(path, 'utf8')), false)
    writeFileSync(path, cnt)
  })

  end()
})
