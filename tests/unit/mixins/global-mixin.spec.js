import { globalMixin } from '@/mixins/global-mixin'
import { assert } from 'chai'

describe('unit/mixins/global-mixin', () => {
  describe('numberFormatter', () => {
    it('amount do not have data', () => {
      const result = globalMixin.methods.numberFormatter(',', 2, 0)
      assert.equal(result, '0.00')
    })

    it('amount do not have data - decimal places is 0', () => {
      const result = globalMixin.methods.numberFormatter(',', 0, 0)
      assert.equal(result, '0')
    })

    it('amount is null', () => {
      const result = globalMixin.methods.numberFormatter(',', 2, null)
      assert.equal(result, '0.00')
    })

    it('amount is null - thousandSeparator is dot character', () => {
      const result = globalMixin.methods.numberFormatter('.', 1, null)
      assert.equal(result, '0,0')
    })

    it('amount is integer - less than 1000', () => {
      const result = globalMixin.methods.numberFormatter(',', 1, 123)
      assert.equal(result, '123.0')
    })

    it('amount is integer - geater than 1000', () => {
      const result = globalMixin.methods.numberFormatter(',', 1, 12345)
      assert.equal(result, '12,345.0')
    })

    it('amount is integer - geater than 1000 - decimal places is 0', () => {
      const result = globalMixin.methods.numberFormatter(',', 0, 12345)
      assert.equal(result, '12,345')
    })

    it('amount is integer - geater than 1000 - decimal places is 0 - thousandSeparator is dot character', async () => {
      const result = globalMixin.methods.numberFormatter('.', 0, 12345)
      assert.equal(result, '12.345')
    })

    it('amount is float - less than 1000', () => {
      const result = globalMixin.methods.numberFormatter(',', 2, 12.3)
      assert.equal(result, '12.30')
    })

    it('amount is float - geater than 1000', () => {
      const result = globalMixin.methods.numberFormatter(',', 1, 1234.5)
      assert.equal(result, '1,234.5')
    })

    it('amount is float - less than 1000 - thousandSeparator is dot character', () => {
      const result = globalMixin.methods.numberFormatter('.', 2, 12.3)
      assert.equal(result, '12,30')
    })

    it('amount is float - geater than 1000 - thousandSeparator is dot character', () => {
      const result = globalMixin.methods.numberFormatter('.', 1, 1234.5)
      assert.equal(result, '1.234,5')
    })

    it('amount is float - geater than 1000 - thousandSeparator is dot character', () => {
      const result = globalMixin.methods.numberFormatter('.', 1, 1234.5)
      assert.equal(result, '1.234,5')
    })
  })

  describe('numberUnFormatter', () => {
    it('amount is integer - less than 1000 - thousandSeparator is comma character', () => {
      const result = globalMixin.methods.numberUnFormatter(345, ',')
      assert.equal(result, '345')
    })

    it('amount is integer - greater than 1000 - thousandSeparator is comma character', () => {
      const result = globalMixin.methods.numberUnFormatter('3,456', ',')
      assert.equal(result, '3456')
    })

    it('amount is integer - greater than 1000 - thousandSeparator is dot character', () => {
      const result = globalMixin.methods.numberUnFormatter('3.456', '.')
      assert.equal(result, '3456')
    })

    it('amount is float - less than 1000 - thousandSeparator is comma character', () => {
      const result = globalMixin.methods.numberUnFormatter(345.2, ',')
      assert.equal(result, '345.2')
    })

    it('amount is float - greater than 1000 - thousandSeparator is comma character', () => {
      const result = globalMixin.methods.numberUnFormatter('3,456.55', ',')
      assert.equal(result, '3456.55')
    })

    it('amount is float - greater than 1000 - thousandSeparator is dot character', () => {
      const result = globalMixin.methods.numberUnFormatter('3.456,55', '.')
      assert.equal(result, '3456,55')
    })
  })
})
