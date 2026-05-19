const pdfParse = require('pdf-parse')
const mammoth = require('mammoth')

export async function extractText(buffer:Buffer, fileType:string):Promise<string>{
    if(fileType === 'pdf'){
        const result = await pdfParse(buffer)
        return result.text
    }
    if(fileType === 'docx'){
        const result = await mammoth.extractRawText({ buffer })
        return result.value
        
    }
    if(fileType === 'txt'){
        return buffer.toString('utf-8')
    }
    throw new Error("Unsupported file type")
}