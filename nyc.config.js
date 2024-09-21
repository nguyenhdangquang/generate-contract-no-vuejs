// nyc.config.js
module.exports = {
  'check-coverage': true,
  'per-file': false,
  lines: 0,
  branches: 0,
  exclude: ['src/main.js'],
  include: ['src/**/*.{js,vue}'],
  reporter: ['lcov', 'text', 'text-summary', 'html'],
  extension: ['.js', '.vue'],
  cache: true,
  all: true
}
