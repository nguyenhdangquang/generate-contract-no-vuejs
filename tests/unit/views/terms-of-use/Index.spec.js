import { assert } from 'chai'
import TermsOfUse from '@/views/terms-of-use/Index.vue'
import StorageHelper from '@/utils/storageHelper'
import sinon from 'sinon'
import { createAppLocalVue, shallowMountPage } from '../../utils'
import { createStore } from '../../store-utils'

const localVue = createAppLocalVue()

describe('Term Of Use', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  beforeEach(() => {
    sinon.stub(StorageHelper, 'getItem').returns('tka')
    sinon.stub(StorageHelper, 'setItem')
  })

  it('should render TERMS OF USE', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="headtitle"]').text()
    assert.equal(text, 'TERMS OF USE')
  })
  it('should render Terms and Conditions', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="termscondition"]').text()
    assert.equal(text, 'Terms and Conditions')
  })
  it('should render content of Terms and Conditions', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="content_termscondition"]').text()
    assert.equal(text, 'These terms and conditions ("Agreement") sets forth the general terms and conditions of your use of the ONE eCommerce Website and/or mobile application and/or any of its related products and services which requires registration on the ONE eCommerce Website ("Services"). This Agreement is legally binding between you ("User", "you" or "your") and Ocean Network Express Pte. Ltd. (“ONE", "we", "us" or "our"). By accessing and using our Services, you acknowledge that you have read, understood, and agree to be bound by the terms of this Agreement. If you are entering into this Agreement on behalf of a business or other legal entity, you represent that you have the authority to bind such entity to this Agreement, in which case the terms "User", "you" or "your" shall refer to such entity. If you do not have such authority, or if you do not agree with the terms of this Agreement, you must not accept this Agreement and may not download, access and use our Services. You acknowledge that this Agreement is a contract between you and us, Ocean Network Express Pte Ltd., even though it is electronic and is not physically signed by you, and it governs your use of our Services.')
  })
  it('should render Links to Other Resources', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="linksToOrtherResource"]').text()
    assert.equal(text, 'Links to Other Resources')
  })
  it('should render content of Links to Other Resources', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="content_linksToOrtherResource"]').text()
    assert.equal(text, 'Although the Services may link to other resources (such as websites, mobile applications, etc.), we are not, directly or indirectly, implying any approval, association, sponsorship, endorsement, or affiliation with any linked resource, unless specifically stated herein. We are not responsible for examining or evaluating, and we do not warrant the offerings of, any businesses or individuals or the content of their resources. We do not assume any responsibility or liability for the actions, products, services, and content of any other third parties. You should carefully review the legal statements and other conditions of use of any resource which you access through a link in our Services. Your linking to any other off-site resources is at your own risk.')
  })
  it('should render Prohibited Uses', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="prohibiteduses"]').text()
    assert.equal(text, 'Prohibited Uses')
  })
  it('should render content of Prohibited Uses', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="content_prohibiteduses"]').text()
    const texta = wrapper.find('[data-testid="content_a_prohibiteduses"]').text()
    const textb = wrapper.find('[data-testid="content_b_prohibiteduses"]').text()
    const textc = wrapper.find('[data-testid="content_c_prohibiteduses"]').text()
    const textd = wrapper.find('[data-testid="content_d_prohibiteduses"]').text()
    const texte = wrapper.find('[data-testid="content_e_prohibiteduses"]').text()
    const textf = wrapper.find('[data-testid="content_f_prohibiteduses"]').text()
    const textg = wrapper.find('[data-testid="content_g_prohibiteduses"]').text()
    const texth = wrapper.find('[data-testid="content_h_prohibiteduses"]').text()
    const texti = wrapper.find('[data-testid="content_i_prohibiteduses"]').text()
    const textj = wrapper.find('[data-testid="content_j_prohibiteduses"]').text()
    assert.equal(text, 'In addition to other terms as set forth in the Agreement, you are prohibited from using our Services or any information provided through the Services:')
    assert.equal(texta, '(a) for any unlawful purpose;')
    assert.equal(textb, '(b) to solicit others to perform or participate in any unlawful acts;')
    assert.equal(textc, '(c) to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances;')
    assert.equal(textd, '(d) to infringe upon or violate our intellectual property rights or the intellectual property rights of others;')
    assert.equal(texte, '(e) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability;')
    assert.equal(textf, '(f) to submit false or misleading information;')
    assert.equal(textg, '(g) to upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Services, third party products and services, or the Internet;')
    assert.equal(texth, '(h) to spam, phish, pharm, pretext, spider, crawl, or scrape;')
    assert.equal(texti, '(i) for any obscene or immoral purpose; or')
    assert.equal(textj, '(j) to interfere with or circumvent the security features of Services , third party products and services, or the Internet. We reserve the right to terminate your use of the Services for violating any of the prohibited uses.')
  })
  it('should render Intellectual Property Rights', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="intellectualpropertyrights"]').text()
    assert.equal(text, 'Intellectual Property Rights')
  })
  it('should render content of Intellectual Property Rights', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="content_intellectualpropertyrights"]').text()
    assert.equal(text, '"Intellectual Property Rights" means all present and future rights conferred by statute, common law or equity in or in relation to any copyright and related rights, trademarks, designs, patents, inventions, goodwill and the right to sue for passing off, rights to inventions, rights to use, and all other intellectual property rights, in each case whether registered or unregistered and including all applications and rights to apply for and be granted, rights to claim priority from, such rights and all similar or equivalent rights or forms of protection and any other results of intellectual activity which subsist or will subsist now or in the future in any part of the world. This Agreement does not transfer to you any Intellectual Property Rights owned, licensed to or controlled by us, our related corporations, licensors or service providers, and all rights, titles, and interests in and to such Intellectual Property Rights will remain (as between the parties) solely with ONE, our related corporations, licensors or service providers. All trademarks, service marks, graphics and logos used in connection with the Services, are trademarks or registered trademarks of Ocean Network Express Pte Ltd or third parties. Your use of Services grants you no right or license to reproduce or otherwise use any of the trademarks used in connection with the Services')
  })
  it('should render Personal Data and Cookies', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="personaldataandcookies"]').text()
    assert.equal(text, 'Personal Data and Cookies')
  })
  it('should render content of Personal Data and Cookies', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="content_personaldataandcookies"]').text()
    assert.equal(text, 'Please refer to detailed Privacy Policy of ONE in this link. By accessing Services, you agree that we can collect, use and disclose any personal data you provide to us in accordance with the Privacy Policy, as may be updated and/or amended by us from time to time.')
  })
  it('should render Error', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="error"]').text()
    assert.equal(text, 'Error')
  })
  it('should render content of Error', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="content_error"]').text()
    assert.equal(text, 'ONE makes no warranty that access to the Services will be uninterrupted, timely or error-free. Access to the Website or Application may be suspended or withdrawn to or from individual Users or all Users temporarily or permanently at any time and without notice. ONE may also impose restrictions on the length and manner of usage of any part of the App for any reasons. ONE shall not be liable if any such suspension, withdrawal or restrictions prevent you from accessing Services or any part of the Services. ONE does not warrant that the Services will be compatible with all hardware and software which users may use. ONE shall not be liable for damages to or viruses or other codes that may affect any equipment, including but not limited to your mobile device, software, data or other property as a result of User’s download or use of the Services . ONE will further not be liable for the actions of third parties.')
  })
  it('should render Trade Regulations', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="traderegulations"]').text()
    assert.equal(text, 'Trade Regulations')
  })
  it('should render content of Trade Regulations', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="content_traderegulations"]').text()
    assert.equal(text, 'All Users are responsible for and warrants its compliance with all applicable laws, rules and regulations, including, but not limited to, the export laws and government regulations of any country to, from, or through which the goods may be carried, including, without limitation the comprehensive economic and trade sanctions of the EU and the USA. To the extent applicable, Users warrants that it has obtained all necessary export, re-export, and/or import licenses or permits and ONE is not required to obtain any special license or permit in connection with ONE Carrier’s performance hereunder. The Users further warrants that it or any party that the User has endorsed for any documentation to is not a party identified on the U.S. Treasury Department’s list of Specially Designated Nationals and Blocked Persons or any other list of prohibited or denied parties maintained by the E.U., U.S.A. or any other country as applicable. The Users also warrants that the goods are not intended to be used in the design, development or production of nuclear, chemical or biological weapons. User shall indemnify and hold ONE Carrier harmless to the full extent of any loss, damage, cost, expense, or liability to the carrier including lost profits, attorney’s fees and court costs for any failure or alleged failure of Users to comply with applicable export and import laws and regulations of any country. ONE assumes no liability to Users or any other person for any loss or expense arising from User’s failure to comply with applicable laws.')
  })
  it('should render Indemnification', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="indemnification"]').text()
    assert.equal(text, 'Indemnification')
  })
  it('should render content of Indemnification', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="content_indemnification"]').text()
    assert.isTrue(text.includes('You agree to indemnify and hold ONE and its affiliates, directors, officers, employees, agents, suppliers and licensors harmless from and against any liabilities, losses, damages or costs, including reasonable attorneys'))
  })
  it('should render Limitation of Liability', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="limitationofliability"]').text()
    assert.equal(text, 'Limitation of Liability')
  })
  it('should render content of Limitation of Liability', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="content_limitationofliability"]').text()
    const texta = wrapper.find('[data-testid="content_a_limitationofliability"]').text()
    const textb = wrapper.find('[data-testid="content_b_limitationofliability"]').text()
    const textc = wrapper.find('[data-testid="content_c_limitationofliability"]').text()
    const textd = wrapper.find('[data-testid="content_d_limitationofliability"]').text()
    const texte = wrapper.find('[data-testid="content_e_limitationofliability"]').text()
    const textf = wrapper.find('[data-testid="content_f_limitationofliability"]').text()
    const textg = wrapper.find('[data-testid="content_g_limitationofliability"]').text()
    assert.equal(text, 'To the fullest extent permitted by applicable law, in no event will ONE, its affiliates, directors, officers, employees, agents, suppliers or licensors be liable to any person for any indirect, incidental, special, punitive, cover or consequential damages (including, without limitation, damages for lost profits, revenue, sales, goodwill, use of content, impact on business, business interruption, loss of anticipated savings, loss of business opportunity) however caused, under any theory of liability, including, without limitation, contract, tort, warranty, breach of statutory duty, negligence or otherwise, even if the liable party has been advised as to the possibility of such damages or could have foreseen such damages, arising directly or indirectly in connection with:')
    assert.equal(texta, '(a) any access, use and/or inability to use (including prohibitions, restrictions, interruptions and delays in the use of) the Services;')
    assert.equal(textb, '(b) any inaccuracies, error or omission, regardless of cause, in the content, data, information, functionalities, services or materials displayed, provided or made available on the Services (the “Materials”);')
    assert.equal(textc, '(c) any system, server or connection failure, error, omission, interruption, delay in transmission, computer virus or other malicious, destructive or corrupting code, agent program or macros;')
    assert.equal(textd, '(d) any use of or access to any other website or webpage linked to the Services;')
    assert.equal(texte, '(e) any services, products, information, data, software or other material obtained or downloaded through the Services and/or Materials or from any other website or webpage provided through the Service Platform, Services and/or Materials or from any other party referred through the Services and/or Materials, or through the use of the Services and/or Materials;')
    assert.equal(textf, '(f) your use or misuse of the Services and/or Materials; or')
    assert.equal(textg, '(g) any reliance on the Services and/or Materials.')
  })
  it('should render Dispute Resolution', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="disputeresolution"]').text()
    assert.equal(text, 'Dispute Resolution')
  })
  it('should render content of Dispute Resolution', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="content_disputeresolution"]').text()
    assert.equal(text, 'The formation, interpretation, and performance of this Agreement and any disputes arising out of it shall be governed by the substantive and procedural laws of Singapore without regard to its rules on conflicts or choice of law and, to the extent applicable, the laws of Singapore. The exclusive jurisdiction and venue for actions related to the subject matter hereof shall be the courts located in Singapore, and you hereby submit to the personal jurisdiction of such courts. You hereby waive any right to a jury trial in any proceeding arising out of or related to this Agreement. The United Nations Convention on Contracts for the International Sale of Goods does not apply to this Agreement.')
  })
  it('should render Severability', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="severability"]').text()
    assert.equal(text, 'Severability')
  })
  it('should render content of Severability', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="content_severability"]').text()
    assert.equal(text, 'All rights and restrictions contained in this Agreement may be exercised and shall be applicable and binding only to the extent that they do not violate any applicable laws and are intended to be limited to the extent necessary so that they will not render this Agreement illegal, invalid or unenforceable. If any provision or portion of any provision of this Agreement shall be held to be illegal, invalid or unenforceable by a court of competent jurisdiction, it is the intention of the parties that the remaining provisions or portions thereof shall constitute their agreement with respect to the subject matter hereof, and all such remaining provisions or portions thereof shall remain in full force and effect.')
  })
  it('should render Changes & Amendments', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="changeandamendments"]').text()
    assert.equal(text, 'Changes & Amendments')
  })
  it('should render content of Changes & Amendments', async () => {
    const wrapper = await shallowMountPage(TermsOfUse, { localVue, store: createStore() })
    const text = wrapper.find('[data-testid="content_changeandamendments"]').text()
    assert.equal(text, 'ONE reserves the right to modify this website or its terms or Agreement relating to any of their Services at any time. The information, products and services contained or referred to on this web site may change or be updated without notice.')
  })
})
