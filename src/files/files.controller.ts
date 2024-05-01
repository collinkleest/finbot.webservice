import { Controller, Get, Param, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { Response } from 'express';

@Controller('files')
export class FilesController {

    constructor(private fileService: FilesService){}

    @Get(':fileId')
    async getFile(@Param('fileId') fileId: string){
        return await this.fileService.getFile(fileId);
    }

    @Get('content/:fileName')
    async getFileContent(@Param('fileName') fileName: string, @Res() res: Response) {
        const filePath = this.fileService.getFilePath(fileName)
        res.sendFile(filePath);
    }

}
