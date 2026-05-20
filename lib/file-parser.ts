const mammoth = require('mammoth')
import { extractText as extractPdfText } from 'unpdf'

export async function extractText(buffer: Buffer, fileType: string): Promise<string> {
    if (fileType === 'pdf') {
        const uint8Array = new Uint8Array(buffer)
        const { text } = await extractPdfText(uint8Array, { mergePages: true })
        return text
    }
    if (fileType === 'docx') {
        const result = await mammoth.extractRawText({ buffer })
        return result.value
    }
    if (fileType === 'txt') {
        return buffer.toString('utf-8')
    }
    throw new Error("Unsupported file type")
}