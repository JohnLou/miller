module.exports = ->
  # Project configuration
  @initConfig
    pkg: @file.readJSON 'package.json'

    # CoffeeScript compilation
    coffee:
      src:
        expand: true
        cwd: 'src'
        src: ['**.coffee']
        dest: ''
        ext: '.js'
      repository:
        expand: true
        cwd: 'src/url-repository'
        src: ['**.coffee']
        dest: 'url-repository'
        ext: '.js'
      schedule:
        expand: true
        cwd: 'src/schedule'
        src: ['**.coffee']
        dest: 'schedule'
        ext: '.js'
      crawler:
        expand: true
        cwd: 'src/crawler'
        src: ['**.coffee']
        dest: 'crawler'
        ext: '.js'
      parser:
        options:
          bare: true
        expand: true
        cwd: 'src/parser'
        src: ['**.coffee']
        dest: 'parser'
        ext: '.js'

    # Unit tests
    nodeunit:
      all: ['test/*.coffee']

    # BDD tests on Node.js
    cafemocha:
      nodejs:
        src: ['spec/*.coffee']
        options:
          reporter: 'dot'

    # Coding standards
    coffeelint:
      src:
        files:
          src: ['src/*.coffee', 'src/**/*.coffee']
        options:
          max_line_length:
            value: 80
            level: 'warn'

  # Grunt plugins used for building
  @loadNpmTasks 'grunt-contrib-coffee'
  @loadNpmTasks 'grunt-component'
  @loadNpmTasks 'grunt-component-build'
  @loadNpmTasks 'grunt-contrib-uglify'

  # Grunt plugins used for testing
  @loadNpmTasks 'grunt-contrib-watch'
  @loadNpmTasks 'grunt-contrib-nodeunit'
  @loadNpmTasks 'grunt-cafe-mocha'
  @loadNpmTasks 'grunt-mocha-phantomjs'
  @loadNpmTasks 'grunt-coffeelint'

  # Grunt plugins used for release automation
  @loadNpmTasks 'grunt-bumpup'
  @loadNpmTasks 'grunt-tagrelease'
  @loadNpmTasks 'grunt-exec'

  # Our local tasks
  @registerTask 'build', 'Build Miller', (target = 'all') =>
    if target is 'all' or target is 'build'
      @task.run 'coffee'

  @registerTask 'test', 'Build Miller and run automated tests', (target = 'all') =>
    @task.run 'coffeelint'
    @task.run 'coffee'
    if target is 'all'
      @task.run 'nodeunit'
      @task.run 'cafemocha'

  # Our local tasks
  @registerTask 'default', ['build']