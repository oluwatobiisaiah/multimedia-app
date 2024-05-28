import { Request, Response } from 'express';
import speech, { protos } from '@google-cloud/speech';
import ffmpeg from 'fluent-ffmpeg'
import { uploadToCloudinary } from '../utils/helpers';
type IRecognitionConfig = protos.google.cloud.speech.v1.IRecognitionConfig

// Creates a client
const client = new speech.SpeechClient();

export const ffmpegController = {
  index: (req: Request, res: Response) => {
    res.send('Hello from fluent-ffmpeg controller!');
  },
  mergeVideos: (req: Request, res: Response) => {

    const video1Path = req['files']['video_one'].path;
    const video2Path = req['files']['video_two'].path;
    const outputPath = 'output/mergedVideo.mp4';

    ffmpeg()
      .input(video1Path)
      .input(video2Path)
      .on('end', () => {
        res.sendFile(outputPath, { root: __dirname });
        // uploadToCloudinary(outputPath,'mergedVideo')
      })
      .on('error', (err) => {
        console.log(err);
        res.status(500).json({message:'An error occurred while merging videos'});
      })
      .mergeToFile(outputPath, 'tempDir');
  },
  convertVideoToAudio: (req: Request, res: Response) => {
    const videoPath = req['file'].path;
    const audioOutputPath = 'output/audio.mp3';

    ffmpeg(videoPath)
      .output(audioOutputPath)
      .on('end', () => {
        res.sendFile(audioOutputPath, { root: __dirname });
      })
      .on('error', (err) => {
        console.error(err);
        res.status(500).send('An error occurred while converting video to audio');
      })
      .run();
  },
  generateThumbnails: (req: Request, res: Response) => {
    const videoPath = req['file'].path;
    const thumbnailOutputPath = 'output/thumbnail.png';

    ffmpeg(videoPath)
      .screenshots({
        timestamps: ['50%'],
        filename: 'thumbnail.png',
        folder: 'output',
        size: '320x240'
      })
      .on('end', () => {
        res.sendFile(thumbnailOutputPath, { root: __dirname });
      })
      .on('error', (err) => {
        console.error(err);
        res.status(500).send('An error occurred while generating the thumbnail');
      });
  },
  splitVideo: (req: Request, res: Response) => {
    const { startTime, duration } = req.body;
    const videoPath = req['file'].path;
    const splitOutputPath = 'output/splitVideo.mp4';

    ffmpeg(videoPath)
      .setStartTime(startTime)
      .setDuration(duration)
      .output(splitOutputPath)
      .on('end', () => {
        res.sendFile(splitOutputPath, { root: __dirname });
      })
      .on('error', (err) => {
        console.error(err);
        res.status(500).send('An error occurred while splitting the video');
      })
      .run();
  },
  transcribeVideo: async (req: Request, res: Response) => {
    const gcsUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
      uri: gcsUri,
    };
    const config: IRecognitionConfig = {
      encoding: "LINEAR16",
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    };
    const request = {
      audio: audio,
      config: config,
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const arrResponse = response.results ?? [];
    const transcription = arrResponse.map(result => {
      const alternatives = result.alternatives ?? [];
      return alternatives[0]?.transcript
    }).join('\n');
    res.send({ transcription })

  }
};

