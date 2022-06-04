'use strict'

const { existsSync, readdirSync, statSync, writeFileSync, readFileSync } = require('fs')
const { resolve, join, extname } = require('path')
const supportedLangs = ['js', 'ts', 'html', '.c']
const files = []
// https://stackoverflow.com/questions/5989315/regex-for-match-replacing-javascript-comments-both-multiline-and-inline
const reg = /(?:((a&&[^a])(?:(?:\\\\)|\\\2|(?!\\\2)\\|(?!\2).|[\n\r])*\2)|(\/\*(?:(?!\*\/).|[\n\r])*\*\/)|(\/\/[^\n\r]*(?:[\n\r]+|$))|((?:=|:)\s*(?:\/(?:(?:(?!\\*\/).)|\\\\|\\\/|[^\\]\[(?:\\\\|\\\]|[^]])+\])+\/))|((?:\/(?:(?:(?!\\*\/).)|\\\\|\\\/|[^\\]\[(?:\\\\|\\\]|[^]])+\])+\/)[gimy]?\.(?:exec|test|match|search|replace|split)\()|(\.(?:exec|test|match|search|replace|split)\((?:\/(?:(?:(?!\\*\/).)|\\\\|\\\/|[^\\]\[(?:\\\\|\\\]|[^]])+\])+\/))|(<!--(?:(?!-->).)*-->))/gm

module.exports = paths => {
  if (!(paths && typeof paths === 'object' && paths.length > 0)) throw new Error('Please enter a valid path array')
  const validarr = [...new Set(paths.filter(element => element !== ''))]
  for (const pth of validarr) {
    if (existsSync(resolve(pth)) && statSync(resolve(pth)).isFile()) mainWrite(pth)
    else if (existsSync(resolve(pth)) && statSync(resolve(pth)).isDirectory()) filesDir(resolve(pth)).forEach(path => mainWrite(path))
    else if (!(pth && pth.length > 0 && existsSync(resolve(pth)))) throw new Error('Please enter a valid path array')
  }
// return filesDir()
}
function filesDir (dir) {
  readdirSync(dir).forEach(file => {
    const inn = join(dir, file)
    if (statSync(inn).isDirectory()) return filesDir(inn)
    else return extnameCheck(inn) ? files.push(resolve(inn)) : '' // add ts nd html files too
  })
  return files
}
function mainWrite (pth) {
  writeFileSync(resolve(pth), readFileSync(resolve(pth), 'utf8').replace(reg, ''))
}

function extnameCheck (pathn) {
  return supportedLangs.map(ext => '.' + ext).includes(extname(pathn))
}
