<template>
  <div class="voice-recorder" :style="{ '--main-color': '#409EFF' }">
    <div class="recorder-container" :class="{ recording: isRecording }">
      <!-- Left side content -->
      <div class="left-content">
        <!-- Pre-practice state -->
        <p v-if="!startPracticeFlag">
          Enter position and click "Start Interview"
        </p>

        <!-- Ready to record state -->
        <p v-else-if="recordingStatus === 'idle'">
          Click Record button to start recording your answer
        </p>

        <!-- Recording state -->
        <div v-else-if="isRecording" class="recording-controls">
          <div class="waveform">
            <div
              class="wave-bar"
              v-for="(bar, index) in waveformBars"
              :key="index"
              :style="{ height: bar.height + 'px', backgroundColor: '#409EFF' }"
            ></div>
          </div>
          <div class="time-display">
            {{ formattedTime }}
          </div>
        </div>

        <!-- Processing state --> 
        <p v-else-if="practiceRequestFlag && loading">
          Processing your answer...
        </p>

        <!-- Completed state -->
        <p v-else-if="practiceRequestFlag">
          Answer recorded! Review the feedback below
        </p>
      </div>

      <!-- Center button -->
      <button
        class="record-button"
        :class="{ recording: isRecording, stopped: isStopped }"
        @click="handleButtonClick"
        :disabled="loading || !startPracticeFlag"
      >
        <span v-if="loading">...</span>
        <template v-else>
          {{ buttonText }}
        </template>
      </button>

      <!-- Right side content -->
      <div class="right-content">
        <button v-if="isStopped" class="send-button" @click="handleSend">
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VoiceRecorder",
  props: {
    requestDone: {
      type: Boolean,
      default: false,
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
      waveformBars: Array(20)
        .fill()
        .map(() => ({ height: Math.random() * 20 + 5 })),
      waveformInterval: null,
    };
  },
  computed: {
    startPracticeFlag() {
      return this.$store.state.startPracticeFlag;
    },
    practiceRequestFlag() {
      return this.$store.state.practiceRequestFlag;
    },
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

    animateWaveform() {
      this.waveformInterval = setInterval(() => {
        this.waveformBars = this.waveformBars.map(() => ({
          height: Math.random() * 20 + 5,
        }));
      }, 200);
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
        this.animateWaveform();
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
      clearInterval(this.waveformInterval);
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
    clearInterval(this.waveformInterval);
  },
};
</script>

<style scoped>
.voice-recorder {
  --main-color: #3f86ff;
  --inactive-color: #f0f0f0;
  font-family: system-ui, -apple-system, sans-serif;
}

.recorder-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.recorder-container.recording {
  padding: 12px 16px;
}

.left-content {
  flex: 1;
  text-align: left;
  font-size: 14px;
  color: #666;
}

.left-content p {
  margin: 4px 0;
}

.record-button {
  border: none;
  border-radius: 20px;
  background: var(--main-color);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  min-width: 80px;
  transition: 0.3s;
}

.record-button:hover {
  opacity: 0.9;
}

.record-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.record-button.stopped {
  background: var(--inactive-color);
  color: #666;
}

.recording-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.waveform {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 30px;
}

.wave-bar {
  width: 3px;
  border-radius: 3px;
  transition: height 0.2s ease;
}

.time-display {
  font-size: 14px;
  color: #666;
  min-width: 40px;
  text-align: center;
}

.right-content {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.send-button {
  border: none;
  border-radius: 20px;
  background: var(--main-color);
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  transition: 0.3s;
}

.send-button:hover {
  opacity: 0.9;
}
</style>
