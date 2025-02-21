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
  props: ["practiceMode"],
  data() {
    return {
      isRecording: false,
      mediaRecorder: null,
      recordedChunks: [],
      inactivityTimer: null,
      newConversationFlag: false,
      conversation: [],
      selectedConversation: null,
      INACTIVITY_PERIOD: 600000, // 10 分钟
    };
  },
  methods: {
    resetInactivityTimer() {
      if (this.inactivityTimer) {
        clearTimeout(this.inactivityTimer);
      }
      this.inactivityTimer = setTimeout(() => {
        this.newConversationFlag = true;
        this.conversation = [];
        this.selectedConversation = null;
      }, this.INACTIVITY_PERIOD);
    },
    onRecordingComplete(audioBlob) {
      this.resetInactivityTimer();
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");
      formData.append("mode", this.practiceMode);
      formData.append("new_conversation", this.newConversationFlag);

      this.$store.commit("switchLoadingStatus", true);
      this.$store
        .dispatch("getChatInfo", formData)
        .then((response) => {
          this.$store.commit("switchLoadingStatus", false);

          this.newConversationFlag = false;

          // Destructure from the backend response
          let {
            user_audio_url,
            tts_audio_url,
            user_text,
            response_text,
            conversation_id,
            evaluation,
          } = response.data;

          // Fix up user_audio_url if it's relative
          if (user_audio_url?.startsWith("/")) {
            user_audio_url = `https://127.0.0.1:3000${user_audio_url}`;
          }

          // Fix up tts_audio_url if it's relative
          if (tts_audio_url?.startsWith("/")) {
            tts_audio_url = `https://127.0.0.1:3000${tts_audio_url}`;
          }

          console.log("User Audio URL:", user_audio_url);
          console.log("TTS Audio URL:", tts_audio_url);

          this.conversation = [
            ...this.conversation,
            {
              user: user_text,
              bot: response_text,
              userAudio: user_audio_url,
              botAudio: tts_audio_url,
              conversation_id: conversation_id,
              evaluation: evaluation, // Add evaluation data to conversation
            },
          ];
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
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

<style lang="scss" scoped>
.audio-recorder {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #222;
  /* Adjust background as needed */
  padding: 10px;
  z-index: 1000;
  /* Make sure it stays on top */
  text-align: center;
  border-top: 1px solid #444;
}
</style>
