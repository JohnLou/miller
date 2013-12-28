assert = require 'assert'
chai = require 'chai' unless chai

describe 'First', ->
  first = 'first'

  describe 'Sec', ->
    second = 'second'

    it 'test body', ->
      chai.expect(first).to.equal 'first'