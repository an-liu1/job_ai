<template>
  <div class="audio-recorder">
    <!-- Conditionally render the buttons based on recording state -->
    <button v-if="!isRecording" @click="startRecording" class="btn btn-primary">
      Start Recording
    </button>
    <button v-else @click="stopRecording" class="btn btn-danger">
      Stop Recording
    </button>
  </div>
</template>

<script>
export default {
  props: {
    onRecordingComplete: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      isRecording: false,
      mediaRecorder: null,
      recordedChunks: [],
    };
  },
  methods: {
    async startRecording() {
      try {
        // Request access to the microphone.
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        // Create a new MediaRecorder instance.
        this.mediaRecorder = new MediaRecorder(stream);
        this.recordedChunks = [];

        // Collect data chunks.
        this.mediaRecorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        });

        // When recording stops, compile the audio blob and call the callback.
        this.mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(this.recordedChunks, {
            type: "audio/wav",
          });
          // Pass the audioBlob to the parent component.
          this.onRecordingComplete(audioBlob);
        });

        // Start recording.
        this.mediaRecorder.start();
        this.isRecording = true;
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    },
    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
        this.isRecording = false;
      }
    },
  },
};
</script>
