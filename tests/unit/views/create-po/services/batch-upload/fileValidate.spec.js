import { assert } from 'chai'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import * as fileValidate from '@/views/create-po/services/batch-upload/fileValidate.js'
import { ErrorMessage } from '@/repositories/ErrorMessage'
import xlsx from 'xlsx'
import { getTextByCountry } from '@/utils/displayTextResources'

const promisifyReadFile = promisify(fs.readFile)

function resolveFilePath (fileName) {
  return path.resolve(
    process.cwd(),
    `tests/unit/views/create-po/services/batch-upload/dummy_files/${fileName}`
  )
}

async function createFileObject (filePath, fileName) {
  const type = 'application/vnd.ms-excel'
  const result = await promisifyReadFile(filePath, 'utf-8')
  const blob = new Blob([result], { type })
  const file = new File([blob], fileName, { type })

  return file
}

describe('views/create-po/services/batch-upload/filevalidations.tests', function () {
  it('failed - file type is not supported', async () => {
    const filePath = resolveFilePath('Batch Upload Template_HKD.xls')
    const file = await createFileObject(filePath, 'Batch Upload Template_HKD.xlsaaa')

    assert.throws(fileValidate.validateExcelFile.bind(null, file, 'SGD'), ErrorMessage.EXCEL_FILE_DOES_NOT_SUPPORT)
  })

  it('failed - file size is over 300Kb', async () => {
    const filePath = resolveFilePath('Development Test_Over300Kb.xlsx')
    const file = await createFileObject(filePath, 'Development Test_Over300Kb.xlsx')

    assert.throws(fileValidate.validateExcelFile.bind(null, file, 'SGD'), ErrorMessage.EXCEL_MAX_SIZE_ERROR)
  })

  it('failed - file missing header', async () => {
    const filePath = resolveFilePath('Batch Upload Template_HKD_missing_header.xls')
    const workbook = xlsx.readFile(filePath)

    assert.throws(
      fileValidate.validateExcelContent.bind(null, workbook, 'SGD'),
      ErrorMessage.EXCEL_FILE_INCORRECT_FORMAT
    )
  })

  it('failed - file contain wrong currency', async () => {
    const filePath = resolveFilePath('Batch Upload Template_HKD_wrong_currency.xls')
    const workbook = xlsx.readFile(filePath)

    assert.throws(
      fileValidate.validateExcelContent.bind(null, workbook, 'SGD'),
      ErrorMessage.CURRENCY_NOT_SUPPORTED
    )
  })

  it('failed - file contain incorrect header format', () => {
    const filePath = resolveFilePath('Batch Upload Template_HKD_incorrect_header_format.xls')
    const workbook = xlsx.readFile(filePath)

    assert.throws(
      fileValidate.validateExcelContent.bind(null, workbook, 'SGD'),
      ErrorMessage.EXCEL_FILE_INCORRECT_FORMAT
    )
  })

  it('failed - first row contains too many cells', () => {
    const filePath = resolveFilePath('Batch_Upload_Template_SGD_First_Header_Too_Many_Cells.xlsx')
    const workbook = xlsx.readFile(filePath)

    assert.throws(
      fileValidate.validateExcelContent.bind(null, workbook, 'SGD'),
      ErrorMessage.EXCEL_FILE_INCORRECT_FORMAT
    )
  })

  it('failed - file contain incorrect header format 2', async () => {
    const filePath = resolveFilePath('Batch Upload Template_HKD_incorrect_header_format_2.xls')
    const workbook = xlsx.readFile(filePath)

    assert.throws(
      fileValidate.validateExcelContent.bind(null, workbook, 'SGD'),
      ErrorMessage.EXCEL_FILE_INCORRECT_FORMAT
    )
  })

  it('failed - file contain incorrect header format 3', () => {
    const filePath = resolveFilePath('Batch Upload Template_HKD_incorrect_header_format_3.xls')
    const workbook = xlsx.readFile(filePath)

    assert.throws(fileValidate.validateExcelContent.bind(null, workbook, 'SGD'), ErrorMessage.EXCEL_FILE_INCORRECT_FORMAT)
  })

  it('failed - file empty', async () => {
    const filePath = resolveFilePath('Batch Upload Template_HKD.xls')
    const workbook = xlsx.readFile(filePath)

    assert.throws(
      fileValidate.validateExcelContent.bind(null, workbook, 'SGD'),
      ErrorMessage.EMPTY_FILE_UPLOAD
    )
  })

  it('Success - file contain negative number', () => {
    const filePath = resolveFilePath('Batch Upload Template_SGD_1.xlsx')
    const workbook = xlsx.readFile(filePath)

    const result = fileValidate.validateExcelContent(workbook, 'SGD')
    assert.equal(2, result.data.length)
    assert.equal('a', result.data[0].number)
    assert.equal('SGD', result.data[0].currency)
    assert.equal(-1, result.data[0].amount)
    assert.equal('', result.data[0].error)
    assert.equal('', result.data[0].remark)
    assert.equal(null, result.data[0].numberError)
    assert.equal(null, result.data[0].amountError)
    assert.equal('', result.data[0].remarkError)
  })

  it('Success - file contain 50 Bls', () => {
    const filePath = resolveFilePath('Batch Upload Template_SGD_50.xlsx')
    const result = fileValidate.validateExcelContent(xlsx.readFile(filePath), 'SGD')
    assert.equal(50, result.data.length)
  })

  it('Failed - file contain 451 Bls', async () => {
    const filePath = resolveFilePath('Batch Upload Template_SGD_451.xlsx')
    assert.throws(
      fileValidate.validateExcelContent.bind(null, xlsx.readFile(filePath), 'SGD', 'SG'),
      getTextByCountry('SG', 'createPOPage_totalBLRecords_uploadFile_errorMsg_reachedMax')
    )
  })

  it('Success - should convert bl number to string', () => {
    const filePath = resolveFilePath('Batch Upload Template_SGD_number_in_number_type.xls')
    const result = fileValidate.validateExcelContent(xlsx.readFile(filePath), 'SGD')
    assert.equal(result.data.length, 4)
    assert.equal(result.data[0].number, '12312312')
    assert.equal(result.data[1].number, '123123123')
    assert.equal(result.data[2].number, '12312314')
    assert.equal(result.data[3].number, '12312315')
  })
})
