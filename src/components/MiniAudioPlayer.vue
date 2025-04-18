<template>
  <div class="audio-player-container">
    <!-- 播放按钮 -->
    <button
      class="audio-player"
      :class="{ playing: isPlaying, loading: isLoading }"
      @click="togglePlay"
      :disabled="!audioSrc"
      :aria-label="isPlaying ? 'Pause audio' : 'Play audio'"
    >
      <!-- 加载状态 -->
      <svg v-if="isLoading" class="icon loading" viewBox="0 0 24 24">
        <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
      </svg>

      <!-- 播放图标 -->
      <svg
        v-if="!isPlaying && !isLoading"
        class="icon play"
        viewBox="0 0 24 24"
      >
        <path d="M8 5v14l11-7z" />
      </svg>

      <!-- 暂停图标 -->
      <svg
        v-if="isPlaying && !isLoading"
        class="icon pause"
        viewBox="0 0 24 24"
      >
        <path d="M14,19H18V5H14M6,19H10V5H6V19Z" />
      </svg>
    </button>

    <!-- 进度条 -->
    <div class="progress-container" v-if="showProgress">
      <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      <span class="time-display">{{ formattedTime }}</span>
    </div>

    <!-- 音频元素 -->
    <audio
      ref="audio"
      :src="audioSrc"
      @ended="onEnded"
      @timeupdate="updateProgress"
      @loadedmetadata="onLoadedMetadata"
      @waiting="onWaiting"
      @canplay="onCanPlay"
      @error="onError"
    ></audio>
  </div>
</template>

<script>
export default {
  name: "MiniAudioPlayer",
  props: {
    audioSrc: {
      type: String,
      default: null,
    },
    autoPlay: {
      type: Boolean,
      default: false,
    },
    showProgress: {
      type: Boolean,
      default: false,
    },
    loop: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "#409EFF",
    },
  },
  data() {
    return {
      isPlaying: false,
      isLoading: false,
      progress: 0,
      duration: 0,
      currentTime: 0,
      audioElement: null,
    };
  },
  computed: {
    formattedTime() {
      const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
      };

      return `${formatTime(this.currentTime)} / ${formatTime(this.duration)}`;
    },
  },
  watch: {
    audioSrc(newSrc) {
      if (newSrc) {
        this.resetPlayer();
        this.loadAudio();
      }
    },
    loop(newVal) {
      if (this.audioElement) {
        this.audioElement.loop = newVal;
      }
    },
  },
  mounted() {
    this.audioElement = this.$refs.audio;
    this.audioElement.loop = this.loop;

    if (this.audioSrc) {
      this.loadAudio();
    }
  },
  beforeDestroy() {
    this.pause();
    this.audioElement.removeEventListener("timeupdate", this.updateProgress);
  },
  methods: {
    loadAudio() {
      this.isLoading = true;
      this.audioElement.load();

      if (this.autoPlay) {
        this.play().catch((error) => {
          console.error("Autoplay failed:", error);
          this.$emit("autoplay-failed", error);
        });
      }
    },
    togglePlay() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    },
    async play() {
      try {
        this.isLoading = true;
        await this.audioElement.play();
        this.isPlaying = true;
        this.isLoading = false;
        this.$emit("play");
      } catch (error) {
        console.error("Playback failed:", error);
        this.isPlaying = false;
        this.isLoading = false;
        this.$emit("error", error);
        throw error;
      }
    },
    pause() {
      this.audioElement.pause();
      this.isPlaying = false;
      this.$emit("pause");
    },
    resetPlayer() {
      this.pause();
      this.progress = 0;
      this.currentTime = 0;
      this.duration = 0;
    },
    onEnded() {
      this.isPlaying = false;
      this.progress = 0;
      this.currentTime = 0;
      this.$emit("ended");
    },
    updateProgress() {
      this.currentTime = this.audioElement.currentTime;
      this.progress = (this.currentTime / this.duration) * 100 || 0;
    },
    onLoadedMetadata() {
      this.duration = this.audioElement.duration;
      this.$emit("loaded");
    },
    onWaiting() {
      this.isLoading = true;
    },
    onCanPlay() {
      this.isLoading = false;
    },
    onError() {
      this.isLoading = false;
      this.isPlaying = false;
      this.$emit("error", this.audioElement.error);
    },
    seekTo(percent) {
      if (!this.audioElement) return;
      this.audioElement.currentTime = (percent / 100) * this.duration;
    },
  },
};
</script>

<style lang="scss" scoped>
.audio-player-container {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
}

.audio-player {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: v-bind(color);
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #dcdfe6;
  }

  &.playing {
    background-color: v-bind(color);
  }

  &.loading {
    .icon {
      animation: spin 1s linear infinite;
    }
  }
}

.icon {
  width: 60%;
  height: 60%;
  fill: white;
  transition: opacity 0.2s ease;

  &.play {
    margin-left: 2px; /* 视觉居中调整 */
  }

  &.loading {
    width: 50%;
    height: 50%;
  }
}

.progress-container {
  flex: 1;
  height: 4px;
  background-color: #ebeef5;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
  min-width: 80px;

  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: v-bind(color);
    border-radius: 2px;
    transition: width 0.1s linear;
  }

  .time-display {
    position: absolute;
    right: 0;
    top: 8px;
    font-size: 11px;
    color: #909399;
    white-space: nowrap;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 480px) {
  .progress-container .time-display {
    display: none;
  }
}
</style>
