<template>
  <div class="voice-recorder" :style="{ '--main-color': mainColor }">
    <button
      class="record-button"
      :class="{ recording: isRecording, stopped: isStopped }"
      @click="handleButtonClick"
      :disabled="loading"
      :style="{
        width: buttonSize + 'px',
        height: buttonSize + 'px',
        color: textColor,
      }"
    >
      <span v-if="loading">...</span>
      <template v-else>
        {{ buttonText }}
        <div v-if="isRecording" class="recording-indicator"></div>
      </template>
    </button>

    <button
      v-if="isStopped"
      class="send-button"
      @click="handleSend"
      :style="{
        backgroundColor: mainColor,
        color: textColor,
      }"
    >
      Send
    </button>

    <div v-if="showTime" class="time-display">
      {{ formattedTime }}
    </div>
  </div>
</template>

<script>
export default {
  name: "VoiceRecorder",
  props: {
    mainColor: {
      type: String,
      default: "#f56c6c",
    },
    textColor: {
      type: String,
      default: "#fff",
    },
    buttonSize: {
      type: Number,
      default: 56,
    },
    showTime: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      recordingStatus: "idle", // idle | recording | stopped
      mediaRecorder: null,
      audioChunks: [],
      recordingStart: 0,
      currentTime: 0,
      loading: false,
      timer: null,
      audioBlob: null,
    };
  },
  computed: {
    isRecording() {
      return this.recordingStatus === "recording";
    },
    isStopped() {
      return this.recordingStatus === "stopped";
    },
    buttonText() {
      return {
        idle: "Record",
        recording: "Stop",
        stopped: "Retry",
      }[this.recordingStatus];
    },
    formattedTime() {
      const minutes = Math.floor(this.currentTime / 60);
      const seconds = this.currentTime % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    },
  },
  methods: {
    // 修复的核心：确保handleButtonClick方法存在
    handleButtonClick() {
      switch (this.recordingStatus) {
        case "idle":
          this.startRecording();
          break;
        case "recording":
          this.stopRecording();
          break;
        case "stopped":
          this.restartRecording();
          break;
      }
    },

    async startRecording() {
      try {
        this.loading = true;
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];

        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = () => {
          this.audioBlob = new Blob(this.audioChunks);
          this.$emit("record-complete", this.audioBlob);
          stream.getTracks().forEach((track) => track.stop());
        };

        this.recordingStatus = "recording";
        this.recordingStart = Date.now();
        this.startTimer();
        this.mediaRecorder.start();
        this.$emit("record-start");
      } catch (error) {
        this.$emit("error", error);
      } finally {
        this.loading = false;
      }
    },

    stopRecording() {
      this.mediaRecorder.stop();
      this.recordingStatus = "stopped";
      this.stopTimer();
      this.$emit("record-stop");
    },

    restartRecording() {
      this.audioChunks = [];
      this.currentTime = 0;
      this.startRecording();
    },

    handleSend() {
      if (this.audioBlob) {
        this.$emit("send", this.audioBlob);
        this.recordingStatus = "idle";
        this.currentTime = 0;
      }
    },

    startTimer() {
      this.timer = setInterval(() => {
        this.currentTime = Math.floor(
          (Date.now() - this.recordingStart) / 1000
        );
      }, 1000);
    },

    stopTimer() {
      clearInterval(this.timer);
    },
  },
  beforeDestroy() {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }
    this.stopTimer();
  },
};
</script>

<style scoped>
.voice-recorder {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.record-button {
  border: none;
  border-radius: 50%;
  background: var(--main-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: 0.3s;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.record-button:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

.record-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.recording-indicator {
  position: absolute;
  width: 60%;
  height: 60%;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.send-button {
  margin-top: 12px;
  padding: 8px 20px;
  border-radius: 24px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}

.send-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.time-display {
  font-size: 14px;
  color: #666;
}

.record-button.stopped {
  background: #ddd;
}
</style>
