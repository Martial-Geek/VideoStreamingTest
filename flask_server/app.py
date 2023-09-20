from flask import Flask, request
from flask_socketio import SocketIO, emit
import base64
import cv2
import numpy as np
import time  # Import the time module

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

frame_rate = 1  # Set the desired frame rate (e.g., 30 frames per second)


@socketio.on('connect')
def handle_connect():
    print('Client connected')


@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')


@socketio.on('upload_frame')
def upload_frame(base64_frame):
    try:
        # Decode the base64-encoded frame
        frame_bytes = base64.b64decode(base64_frame)

        # Check if the frame is empty
        if not frame_bytes:
            print("Received an empty frame")
            return

        # Decode the frame using OpenCV
        frame = cv2.imdecode(np.frombuffer(
            frame_bytes, dtype=np.uint8), cv2.IMREAD_COLOR)

        # Check if the frame is None (failed to decode)
        if frame is None:
            print("Failed to decode frame")
            return

        # Process the frame (e.g., convert to black and white)
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Encode the processed frame to base64
        _, encoded_frame = cv2.imencode(".jpg", gray_frame)

        # Check if the encoding was successful
        if encoded_frame is not None:
            base64_processed_frame = base64.b64encode(
                encoded_frame).decode("utf-8")

            # Send the processed frame back to the client via WebSocket
            emit('processed_frame', base64_processed_frame)

        # Introduce a delay to control the frame rate
        time.sleep(1 / frame_rate)

    except Exception as e:
        print(f"Error processing frame: {str(e)}")


if __name__ == '__main__':
    socketio.run(app, debug=True)
