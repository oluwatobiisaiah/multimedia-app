import express from 'express';
import { ffmpegController } from './fluent-ffmpeg.controller';

const router = express.Router();

router.get('/', ffmpegController.index);
router.post("/transcribe",ffmpegController.transcribeVideo)
router.post("/merge-videos",ffmpegController.mergeVideos)

export default router;

