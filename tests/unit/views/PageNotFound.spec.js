import { assert } from 'chai'
import sinon from 'sinon'

import { createAppLocalVue, shallowMountPage } from '../utils'
import PageNotFoundPage from '@/views/PageNotFound.vue'

const localVue = createAppLocalVue()
describe('<PageNotFound />: General', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })
  it('should render <PageNotFound />', async () => {
    sinon.stub(window, 'scrollTo')
    const wrapper = await shallowMountPage(PageNotFoundPage, { localVue })

    const titleElement = wrapper.find('[data-testid="title"]')
    assert.isTrue(titleElement.isVisible())
    assert.equal(titleElement.text(), 'PAGE NOT FOUND')

    const titleSmElement = wrapper.find('[data-testid="title-sm"]')
    assert.isTrue(titleSmElement.isVisible())
    assert.equal(titleSmElement.text(), 'The page you requested could not be found')

    const buttonHomeElement = wrapper.find('[data-testid="button-home"]')
    assert.isTrue(buttonHomeElement.isVisible())
    assert.equal(buttonHomeElement.attributes('to'), '/sg')
  })
})
