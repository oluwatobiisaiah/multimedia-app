import { Request, Response } from 'express';
import ffmpeg from 'fluent-ffmpeg'
import { uploadAudioToCloudinary, uploadToCloudinary, uploadVideoToCloudinary } from '../utils/helpers';
import path from 'path';
const parentDirectory = path.resolve(__dirname, '../../');

export const ffmpegController = {
  mergeVideos: (req: Request, res: Response) => {
    const videoFiles = Object.values(req['files']);
    const mergedVideo = ffmpeg();

    for (const file of videoFiles) {
      if (typeof file === 'object' && file !== null && 'path' in file) {
        mergedVideo.input(file.path);
      }
    }
    
    const outputPath = parentDirectory + "/output/mergedVideo.mp4"

    mergedVideo
      .on('end', async () => {
        try {
          const url = await uploadVideoToCloudinary(outputPath, 'mergedVideo')
          res.status(200).json({ message: 'Videos merged successfully', data: { url } })
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      })
      .on('error', (err) => {
        res.status(500).json({ message: err.message });
      })
      .mergeToFile(outputPath, 'tempDir');
  },
  convertVideoToAudio: (req: Request, res: Response) => {
    const videoPath = req['files']['video'].path;
    const audioOutputPath = parentDirectory + "/output/audio.mp3"

    ffmpeg(videoPath)
      .output(audioOutputPath)
      .on('end', async () => {
        try {
          const url = await uploadAudioToCloudinary(audioOutputPath, 'convertedAudio')
          res.status(200).json({ message: 'Video converted to audio successfully', data: { url } })
        } catch (error) {
          console.log(error)
          res.status(500).json({ message: error.message });
        }
      })
      .on('error', (err) => {
        console.error(err);
        res.status(500).send('An error occurred while converting video to audio');
      })
      .run();
  },
  generateThumbnails: (req: Request, res: Response) => {
    const videoPath = req['files']['video'].path;
    const thumbnailOutputPath = parentDirectory + '/output/thumbnail.png';

    ffmpeg(videoPath)
      .screenshots({
        timestamps: ['50%'],
        filename: 'thumbnail.png',
        folder: 'output',
        size: '320x240'
      })
      .on('end', async () => {
        try {
          const url = await uploadToCloudinary(thumbnailOutputPath, 'thumbnail')
          res.status(200).json({ message: 'Thumbnail generated successfully', url });
        } catch (error) {
          console.log(error)
          res.status(500).json({ message: error.message });

        }

      })
      .on('error', (err) => {
        console.log(err);
        res.status(500).json({ message: 'An error occurred while merging videos', error: err.message });
      });
  },
  splitVideo: (req: Request, res: Response) => {
    const { chunkDuration } = req.body;
    const videoPath = req['files']['video'].path;
    const splittedVideosUrl: string[] = [];

    ffmpeg.ffprobe(videoPath, async (err, metadata) => {
      if (err) {
        res.status(500).json({ message: err.message });
        return;
      }

      const duration = metadata.format.duration;
      const numChunks = Math.ceil(duration / chunkDuration);
      const placeholderArray = new Array(numChunks).fill(0);
      const promises = placeholderArray.map(async (_, i) => {
        const startTime = i * chunkDuration;
        const endTime = Math.min((i + 1) * chunkDuration, duration);

        return new Promise((resolve, reject) => {
          ffmpeg(videoPath)
            .outputOptions([
              '-ss', startTime.toFixed(2),
              '-t', (endTime - startTime).toFixed(2),
              '-c', 'copy'
            ])
            .output(`output/chunk_${i}.mp4`)
            .on('end', () => {
              splittedVideosUrl.push(`output/chunk_${i}.mp4`);
              resolve(splittedVideosUrl);
            })
            .on('error', (err) => {
              console.error(`Error creating chunk ${i}:`, err);
              reject(err);
            })
            .run();
        });
      });

      try {
        await Promise.all(promises);
        res.status(200).json({ message: 'Video split successfully', data: { url: splittedVideosUrl } });
      } catch (err) {
        console.error('Error splitting video:', err);
        res.status(500).json({ message: 'Error splitting video' });
      }


    });
  }
};

