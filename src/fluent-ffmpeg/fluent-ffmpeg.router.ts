import express from 'express';
import { ffmpegController } from './fluent-ffmpeg.controller';

const router = express.Router();

router.post("/merge-videos",ffmpegController.mergeVideos);
router.post("/convert-video-to-audio",ffmpegController.convertVideoToAudio);
router.post("/generate-thumbnails",ffmpegController.generateThumbnails);
router.post("/split-video",ffmpegController.splitVideo);
export default router;

