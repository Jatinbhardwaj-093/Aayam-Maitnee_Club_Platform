import cv2
import os
from moviepy import VideoFileClip   # or from moviepy.editor import VideoFileClip if using MoviePy 1.x


def extract_frames(video_path, output_folder, interval=30):

    os.makedirs(output_folder, exist_ok=True)

    cap = cv2.VideoCapture(video_path)

    frame_count = 0
    saved = 0

    while True:

        success, frame = cap.read()

        if not success:
            break

        if frame_count % interval == 0:

            filename = os.path.join(
                output_folder,
                f"frame_{saved}.jpg"
            )

            cv2.imwrite(filename, frame)

            saved += 1

        frame_count += 1

    cap.release()

    return saved


def extract_audio(video_path, output_audio):

    os.makedirs(os.path.dirname(output_audio), exist_ok=True)

    clip = VideoFileClip(video_path)

    audio = clip.audio.subclipped(0, 60)

    audio.write_audiofile(
        output_audio,
        logger=None
    )

    return output_audio