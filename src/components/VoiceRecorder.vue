<template>
  <div class="voice-recorder-container">
    <!-- 主录音控制区域 -->
    <div
      class="recorder-main"
      :class="{ recording: isRecording, disabled: disabled }"
    >
      <!-- 状态指示器 -->
      <div class="status-indicator">
        <div class="status-dot" :class="recordingStatus"></div>
        <span class="status-text">{{ statusText }}</span>
      </div>

      <!-- 波形可视化 -->
      <div class="waveform-visualization" v-if="isRecording || isStopped">
        <div
          v-for="(bar, index) in waveformBars"
          :key="index"
          class="wave-bar"
          :style="{
            height: `${bar.height}px`,
            backgroundColor: bar.active ? activeColor : inactiveColor,
          }"
        ></div>
      </div>

      <!-- 录音时间显示 -->
      <div class="time-display" v-if="isRecording || isStopped">
        <i class="el-icon-time"></i>
        <span>{{ formattedTime }}</span>
      </div>

      <!-- 主录音按钮 -->
      <button
        class="record-button"
        :class="{ recording: isRecording, stopped: isStopped }"
        @click="handleButtonClick"
        :disabled="disabled || loading"
      >
        <i :class="buttonIcon"></i>
        <span>{{ buttonText }}</span>
      </button>

      <!-- 发送按钮 -->
      <button
        class="send-button"
        v-if="isStopped"
        @click="handleSend"
        :disabled="loading"
      >
        <i class="el-icon-s-promotion"></i>
        <span>Send</span>
      </button>
    </div>

    <!-- 录音提示 -->
    <div class="recording-tips">
      <p v-if="!isRecording && !isStopped">
        <i class="el-icon-info"></i> Click reocrd button to record your answer
      </p>
      <p v-else-if="isRecording" class="recording-active">
        <i class="el-icon-mic"></i> Recording... Speak now
      </p>
      <p v-else class="recording-stopped">
        <i class="el-icon-check"></i> Ready to send or record again
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "VoiceRecorder",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    activeColor: {
      type: String,
      default: "#409EFF",
    },
    inactiveColor: {
      type: String,
      default: "#DCDFE6",
    },
    maxRecordingTime: {
      type: Number,
      default: 120, // 2 minutes in seconds
    },
  },
  data() {
    return {
      recordingStatus: "idle", // idle | recording | stopped | processing
      mediaRecorder: null,
      audioChunks: [],
      recordingStart: 0,
      currentTime: 0,
      loading: false,
      timer: null,
      audioBlob: null,
      waveformBars: Array(20)
        .fill()
        .map(() => ({
          height: 4,
          active: false,
        })),
      waveformInterval: null,
      audioContext: null,
      analyser: null,
      microphone: null,
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
        processing: "Processing",
      }[this.recordingStatus];
    },
    buttonIcon() {
      return {
        idle: "el-icon-microphone",
        recording: "el-icon-video-pause",
        stopped: "el-icon-refresh-right",
        processing: "el-icon-loading",
      }[this.recordingStatus];
    },
    statusText() {
      return {
        idle: "Ready",
        recording: "Recording",
        stopped: "Recorded",
        processing: "Processing",
      }[this.recordingStatus];
    },
    formattedTime() {
      const minutes = Math.floor(this.currentTime / 60);
      const seconds = this.currentTime % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    },
  },
  watch: {
    currentTime(newTime) {
      if (newTime >= this.maxRecordingTime && this.isRecording) {
        this.stopRecording();
        this.$emit("timeout");
      }
    },
  },
  methods: {
    async handleButtonClick() {
      try {
        switch (this.recordingStatus) {
          case "idle":
            await this.startRecording();
            break;
          case "recording":
            this.stopRecording();
            break;
          case "stopped":
            this.restartRecording();
            break;
        }
      } catch (error) {
        this.$emit("error", error);
        this.resetRecorder();
      }
    },

    async startRecording() {
      this.loading = true;

      try {
        // 初始化音频上下文和分析器
        this.audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();

        // 获取麦克风访问权限
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        this.microphone = this.audioContext.createMediaStreamSource(stream);
        this.microphone.connect(this.analyser);

        // 设置媒体录音器
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];

        // 设置录音数据处理器
        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };

        // 设置录音停止处理器
        this.mediaRecorder.onstop = () => {
          this.audioBlob = new Blob(this.audioChunks, { type: "audio/wav" });
          this.$emit("record-complete", this.audioBlob);
          stream.getTracks().forEach((track) => track.stop());
        };

        // 开始录音
        this.mediaRecorder.start();
        this.recordingStatus = "recording";
        this.recordingStart = Date.now();
        this.startTimer();
        this.startWaveformAnimation();
        this.$emit("record-start");
      } finally {
        this.loading = false;
      }
    },

    stopRecording() {
      if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
        this.mediaRecorder.stop();
      }

      if (this.audioContext && this.audioContext.state !== "closed") {
        this.audioContext.close();
      }

      this.recordingStatus = "stopped";
      this.stopTimer();
      this.stopWaveformAnimation();
      this.$emit("record-stop");
    },

    restartRecording() {
      this.audioChunks = [];
      this.currentTime = 0;
      this.startRecording();
    },

    handleSend() {
      if (this.audioBlob) {
        this.recordingStatus = "processing";
        this.loading = true;
        this.$emit("send", this.audioBlob);
        this.resetRecorder();
      }
    },

    startTimer() {
      this.currentTime = 0;
      this.timer = setInterval(() => {
        this.currentTime = Math.floor(
          (Date.now() - this.recordingStart) / 1000
        );
      }, 1000);
    },

    stopTimer() {
      clearInterval(this.timer);
    },

    startWaveformAnimation() {
      this.waveformInterval = setInterval(() => {
        if (this.analyser) {
          const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
          this.analyser.getByteFrequencyData(dataArray);

          // 更新波形条
          this.waveformBars = this.waveformBars.map((_, index) => {
            const dataIndex = Math.floor(
              (index * dataArray.length) / this.waveformBars.length
            );
            const height = Math.max(4, dataArray[dataIndex] / 4);
            return { height, active: height > 10 };
          });
        } else {
          // 如果没有分析器，使用随机高度
          this.waveformBars = this.waveformBars.map(() => ({
            height: Math.random() * 20 + 4,
            active: Math.random() > 0.7,
          }));
        }
      }, 100);
    },

    stopWaveformAnimation() {
      clearInterval(this.waveformInterval);
      // 重置波形为不活跃状态
      this.waveformBars = this.waveformBars.map((bar) => ({
        height: bar.height,
        active: false,
      }));
    },

    resetRecorder() {
      this.recordingStatus = "idle";
      this.audioChunks = [];
      this.currentTime = 0;
      this.audioBlob = null;
      this.stopTimer();
      this.stopWaveformAnimation();
    },
  },
  beforeDestroy() {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      this.mediaRecorder.stop();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.stopTimer();
    this.stopWaveformAnimation();
  },
};
</script>

<style lang="scss" scoped>
.voice-recorder-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.recorder-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &.recording {
    box-shadow: 0 2px 12px 0 rgba(64, 158, 255, 0.3);
  }

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

.status-indicator {
  display: flex;
  align-items: center;
  margin-right: 12px;

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;

    &.idle {
      background-color: #909399;
    }

    &.recording {
      background-color: #f56c6c;
      animation: pulse 1.5s infinite;
    }

    &.stopped {
      background-color: #67c23a;
    }

    &.processing {
      background-color: #e6a23c;
    }
  }

  .status-text {
    font-size: 12px;
    color: #606266;
    font-weight: 500;
  }
}

.waveform-visualization {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  margin: 0 12px;

  .wave-bar {
    width: 3px;
    min-height: 4px;
    border-radius: 3px;
    margin: 0 2px;
    transition: height 0.2s ease, background-color 0.3s ease;
  }
}

.time-display {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #606266;
  margin-right: 12px;

  i {
    margin-right: 4px;
    font-size: 16px;
  }
}

.record-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background-color: #409eff;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 90px;

  i {
    margin-right: 6px;
    font-size: 16px;
  }

  &:hover {
    background-color: mix(#409eff, #000, 85%);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.recording {
    background-color: #f56c6c;

    &:hover {
      background-color: mix(#f56c6c, #000, 85%);
    }
  }

  &.stopped {
    background-color: #e6a23c;

    &:hover {
      background-color: mix(#e6a23c, #000, 85%);
    }
  }
}

.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  margin-left: 12px;
  border: none;
  border-radius: 20px;
  background-color: #67c23a;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  i {
    margin-right: 6px;
    font-size: 16px;
  }

  &:hover {
    background-color: mix(#67c23a, #000, 85%);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.recording-tips {
  margin-top: 8px;
  text-align: center;
  font-size: 13px;
  color: #909399;

  p {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      margin-right: 6px;
    }
  }

  .recording-active {
    color: #f56c6c;
  }

  .recording-stopped {
    color: #67c23a;
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .recorder-main {
    padding: 10px 12px;
  }

  .status-text {
    display: none;
  }

  .record-button,
  .send-button {
    padding: 8px 12px;
    min-width: auto;

    span {
      display: none;
    }

    i {
      margin-right: 0;
    }
  }
}
</style>
