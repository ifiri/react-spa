import RequestFactory from '../RequestFactory';
import RequestExecuter from '../RequestExecuter';

import CommonUtils from '../../Utils/Common';

export default class ChunkUploader {
    constructor(request, executer) {
        const data = request.params.body;

        this.request = request;
        this.executer = executer;

        this.file = (data && data.file) || null;

        if(this.file) {
            this.chunkSize = this.getChunkSize();
            this.total = this.getTotalChunksCountFor(this.file);

            this.fileSize = this.getFilesizeInKilobytes(this.file);
            this.fileName = this.generateFilename(this.file);
            this.fileExt = this.getExtensionByMimeFor(this.file);

            this.currentChunkIndex = 0;

            //this.progressbar = document.querySelector('[data-progress-for="' + request.progressbar + '"]');
            //this.submitButton = this.progressbar.closest('form').querySelector('[type="submit"]');
        }
    }

    apply() {
        if(!this.file) {
            return this.request;
        }

        this.updateProgress(0);

        const RequestFactoryInstance = new RequestFactory;

        const Request = this.request;
        const type = Request.type;

        let MutatedRequest;

        switch(type) {
            case 'chunkuploader/init':
                MutatedRequest = RequestFactoryInstance.createRequestWith(Request.alias, Request.data, Request.params);

                MutatedRequest.setBody({
                    ...Request.body,
                    
                    'chunks': this.total,
                    'extention': this.fileExt,
                    'filename': this.fileName,
                });
                break;

            case 'chunkuploader/upload':
                const initResponse = Request.currentResponse.responses['chunkuploader/init'];

                this.uploadQueueFor(initResponse.id);

                // this.executer.requests[this.executer.requests.length - 1].canExecuting = false;

                // Return dummy request
                MutatedRequest = RequestFactoryInstance.createRequestWith(Request.alias, Request.data, Request.params);
                MutatedRequest.setBody(null);

                break;

            case 'chunkuploader/chunk':
                //
                
                break;
        }

        return MutatedRequest || Request;
    }

    uploadQueueFor(uploadId) {
        const Request = this.request;
        const RequestFactoryInstance = new RequestFactory;
        const offset = this.request.offset;
        
        for(let i = 0; i < this.total; i++) {
            const UploadRequest = RequestFactoryInstance.createRequestWith(Request.alias, Request.data, {
                ...Request.params,

                map: {
                    video: uploadId,
                    current: this.currentChunkIndex,
                }
            });
            delete UploadRequest.middleware;
            delete UploadRequest.type;
            delete UploadRequest.data.type;
            delete UploadRequest.data.middleware;

            UploadRequest.onComplete = this.updateProgress.bind(this, this.currentChunkIndex);
            // UploadRequest.data.type = 'chunkuploader/chunk';

            UploadRequest.setBody({
                blob: this.getCurrentChunkBy(this.currentChunkIndex)
            });

            // console.log('uploadddd');
            // console.log(UploadRequest);

            this.executer.requests.splice(this.executer.requests.length - offset, 0, UploadRequest);

            this.currentChunkIndex = i + 1;
        }

        this.executer.requests.splice(this.executer.requestIndex, 0);
        // this.executer.requestIndex--;
        
        console.log(':: REQUEEEEEEEEEEEEEEEEEEESTS');
        console.log(this.executer.requests);
        // this.uploadChunkWith(UploadRequest);
        
        // if(!this.submitButton.disabled) {
        //     CommonUtils.toggleSubmitButton(this.submitButton, true);
        // } else {
        //     CommonUtils.lockSubmitButton(this.submitButton);
        // }
    } 

    uploadChunkWith(Request) {
        const RequestExecuterInstance = new RequestExecuter;

        Request.setBody({
            blob: this.getCurrentChunkBy(this.currentChunkIndex)
        });

        RequestExecuterInstance.execute(Request).then(response => {
            if(response.successfull || response.video_url) { // if media upload or company model
                // if(request.success) {
                //     this._ApiHandler[request.success](response, form, this._type);
                // }

                this.resetProgress();
                //CommonUtils.toggleSubmitButton(this.submitButton, true);
            } else {
                this.currentChunkIndex++;

                if(this.currentChunkIndex < this.total) {
                    this.uploadChunkWith(Request);

                    if(this.currentChunkIndex + 1 !== this.total) {
                        this.updateProgress(this.currentChunkIndex, this.total);
                    } else {
                        this.updateProgressFieldWith('Видео загружено, идет обработка...');
                    }
                }
            }
        });
    }

    getChunksQueue() {
        const total_chunks = this.total;

        const queue = [];
        for(let chunkNumber = 0; chunkNumber < total_chunks; chunkNumber++) {
            const chunk = this.getCurrentChunkBy(chunkNumber);

            queue.push({
                blob: chunk
            });
        }

        return queue;
    }

    getCurrentChunkBy(chunkNumber) {
        const total_chunks = this.total;
        const chunk_size = this.getChunkSize();

        const chunk_start_at = chunkNumber * chunk_size;
        const chunk_end_at = chunk_start_at + chunk_size;
        const current_chunk = this.file.slice(chunk_start_at, chunk_end_at, this.file.type);

        return current_chunk;
    }

    getChunkSize() {
        return 1024 * (1024 / 8);
    }

    getTotalChunksCountFor(file) {
        const chunkSize = this.getChunkSize(); // in bytes
        const totalChunks = Math.ceil(file.size / chunkSize);

        return totalChunks - 1;
    }

    getFilesizeInKilobytes(file) {
        let filesize = file.size / 1024; // in kb

        return filesize;
    }

    getExtensionByMimeFor(file) {
        let extension = null;

        switch(file.type) {
            case 'video/mp4':
                extension = 'mp4';
                break;

            case 'image/jpeg':
            case 'image/jpg':
                extension = 'jpg';
                break;

            case 'image/png':
                extension = 'png';
                break;
        }

        return extension;
    }

    generateFilename() {
        const letters = 'qwertyuiopasdfghjklzxcvbnm1234567890';

        let filename = '';
        while(filename.length < 50) {
            const letter = Math.floor(Math.random() * letters.length - 1) + 1;

            filename += letters[letter];
        }

        return filename;
    }

    resetProgress() {
        this.updateProgressFieldWith('');
    }

    updateProgress(chunkIndex, response = null) {
        // console.log('::: ON COMPLETE');
        // console.log(response);
        // console.log(chunkIndex);


        let current_progress = 0;

        if(chunkIndex) {
            const total_chunks = this.total;

            current_progress = Math.floor((chunkIndex / (total_chunks - 1)) * 100);
        }

        this.updateProgressFieldWith(current_progress + '%');
    }

    updateProgressFieldWith(value) {
        //const progress_field = this.progressbar;
        
        const progress_field = $('#uploadLine');

        // console.log('::: PROGREEEEEEEEEEEEEES FIELD');

        if(progress_field) {
            $('#uploadPlaceholder').hide();
            $('#uploadLine').show();
            $('#uploadInfo').text(value);
            $('#uploadLine').find('.ready').css('width',value);
        }
    }
}