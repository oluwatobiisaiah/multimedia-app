import { Request, Response } from 'express';
import {ffmpegController} from '../src/fluent-ffmpeg/fluent-ffmpeg.controller';
import ffmpeg from 'fluent-ffmpeg';
import { uploadVideoToCloudinary } from '../src/utils/helpers';

jest.mock('fluent-ffmpeg');
jest.mock('../src/utils/helpers');

describe('mergeVideos', () => {
    let mockRequest: Partial<Request>&{files: {path: string}[]};
    let mockResponse: Partial<Response>;
    const mockFiles = [
        { path: '/path/to/video1.mp4' },
        { path: '/path/to/video2.mp4' },
    ];

    beforeEach(() => {
        mockRequest = {
            files: mockFiles,
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should merge videos and upload to Cloudinary', async () => {
        const mockUrl = 'https://example.com/merged-video.mp4';
        (uploadVideoToCloudinary as jest.Mock).mockResolvedValueOnce(mockUrl);

        ffmpegController.mergeVideos(mockRequest as Request, mockResponse as Response);

        expect(ffmpeg).toHaveBeenCalledTimes(1);
        expect(ffmpeg().input).toHaveBeenCalledTimes(mockFiles.length);
        expect(ffmpeg().mergeToFile).toHaveBeenCalledTimes(1);
        expect(uploadVideoToCloudinary).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Videos merged successfully',
            data: { url: mockUrl },
        });
    });

    it('should handle errors during video merge', async () => {
        const mockError = new Error('Failed to merge videos');
        (ffmpeg().on as jest.Mock).mockImplementationOnce((event, callback) => {
            if (event === 'error') {
                callback(mockError);
            }
        });

        await ffmpegController.mergeVideos(mockRequest as Request, mockResponse as Response);

        expect(ffmpeg).toHaveBeenCalledTimes(1);
        expect(ffmpeg().input).toHaveBeenCalledTimes(mockFiles.length);
        expect(ffmpeg().mergeToFile).toHaveBeenCalledTimes(1);
        expect(uploadVideoToCloudinary).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: mockError.message,
        });
    });

    it('should handle errors during Cloudinary upload', async () => {
        const mockError = new Error('Failed to upload video');
        (uploadVideoToCloudinary as jest.Mock).mockRejectedValueOnce(mockError);

        await ffmpegController.mergeVideos(mockRequest as Request, mockResponse as Response);

        expect(ffmpeg).toHaveBeenCalledTimes(1);
        expect(ffmpeg().input).toHaveBeenCalledTimes(mockFiles.length);
        expect(ffmpeg().mergeToFile).toHaveBeenCalledTimes(1);
        expect(uploadVideoToCloudinary).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: mockError.message,
        });
    });
});
