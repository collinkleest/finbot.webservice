import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { VectorStoreFile } from 'openai/resources/beta/vector-stores/files';
import { AssistantsService } from 'src/assistants/assistants.service';
import { env } from 'src/env';
import { OpenaiService } from 'src/openai/openai.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
    private openAi: OpenAI;
    
    constructor(private openAiService: OpenaiService, private assistantsService: AssistantsService){
        this.openAi = this.openAiService.getOpenAiClient()
    }

    async getVectorStoreId(): Promise<string>{
        const assistant  = await this.assistantsService.getAssistant(env.assistant_id)
        return assistant.tool_resources.file_search.vector_store_ids[0];
    }

    async getFileFromVectorStore(fileId: string): Promise<VectorStoreFile> {
        const vectorStoreId = await this.getVectorStoreId();
        return await this.openAi.beta.vectorStores.files.retrieve(vectorStoreId, fileId);
    }

    async getFile(fileId: string) {
        return await this.openAi.files.retrieve(fileId);
    }

    getFilePath(fileName: string): string {
        const filePath = path.join(__dirname, '../..', 'assets/docs', fileName);
        if (fs.existsSync(filePath)) {
            return filePath;
        } else {
            throw new HttpException("File not found", HttpStatus.NOT_FOUND);
        }
    }

}
