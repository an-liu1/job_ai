<template>
  <div class="audio-player-container" :style="containerStyle">
    <audio
      ref="audio"
      :src="src"
      @timeupdate="updateTime"
      @loadedmetadata="initPlayer"
      @ended="handleEnded"
      @waiting="onWaiting"
      @canplay="onCanPlay"
      @error="onError"
    ></audio>

    <div class="audio-player" :class="{ 'has-error': error }">
      <!-- 播放按钮 -->
      <button
        class="play-btn"
        @click="togglePlay"
        :disabled="!src || loading"
        :style="{ backgroundColor: color }"
      >
        <i v-if="loading" class="fas fa-spinner fa-spin"></i>
        <i v-else :class="playIcon"></i>
      </button>

      <!-- 进度条+时间 -->
      <div class="progress-container">
        <div
          class="progress-bar"
          :style="{ width: progressPercentage, backgroundColor: color }"
        ></div>
        <div class="time-display">
          <span>{{ formatTime(currentTime) }}</span>
          <span class="duration">{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- 右侧控制 -->
      <div class="right-controls">
        <!-- 音量控制 -->
        <div class="volume-control" v-if="showVolume">
          <button class="icon-btn" @click="toggleMute">
            <i :class="muteIcon"></i>
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model="volume"
            class="volume-slider"
            @input="updateVolume"
          />
        </div>

        <!-- 下载按钮 -->
        <a
          v-if="showDownload"
          :href="src"
          download
          class="icon-btn"
          :title="downloadText"
        >
          <i class="fas fa-download"></i>
        </a>

        <!-- 播放速率 -->
        <el-dropdown
          v-if="showPlaybackRate"
          trigger="click"
          placement="top"
          @command="changePlaybackRate"
        >
          <button class="icon-btn" :title="`Current: ${playbackRate}x`">
            <i class="fas fa-tachometer-alt"></i>
          </button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="rate in playbackRates"
              :key="rate"
              :command="rate"
              :class="{ active: playbackRate === rate }"
            >
              {{ rate }}x
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      <i class="fas fa-exclamation-circle"></i>
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "MiniAudioPlayer",
  props: {
    src: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: "#409EFF",
    },
    showVolume: {
      type: Boolean,
      default: true,
    },
    showDownload: {
      type: Boolean,
      default: true,
    },
    showPlaybackRate: {
      type: Boolean,
      default: true,
    },
    downloadText: {
      type: String,
      default: "Download audio",
    },
    autoPlay: {
      type: Boolean,
      default: false,
    },
    loop: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      isMuted: false,
      volume: 1,
      playbackRate: 1,
      playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
      loading: false,
      error: false,
      errorMessage: "",
    };
  },
  computed: {
    containerStyle() {
      return {
        "--main-color": this.color,
        "--hover-color": this.lightenColor(this.color, 20),
      };
    },
    progressPercentage() {
      return this.duration > 0 ? `${(this.currentTime / this.duration) * 100}%` : "0%";
    },
    playIcon() {
      return this.isPlaying ? "fas fa-pause" : "fas fa-play";
    },
    muteIcon() {
      return this.isMuted ? "fas fa-volume-mute" : "fas fa-volume-up";
    },
  },
  watch: {
    src(newSrc) {
      if (newSrc) {
        this.resetPlayer();
        this.loadAudio();
      }
    },
    loop(newVal) {
      if (this.$refs.audio) {
        this.$refs.audio.loop = newVal;
      }
    },
    autoPlay(newVal) {
      if (newVal && this.$refs.audio) {
        this.play();
      }
    },
  },
  mounted() {
    if (this.src) {
      this.loadAudio();
    }
  },
  beforeDestroy() {
    this.pause();
  },
  methods: {
    lightenColor(color, percent) {
      // 简单的颜色变亮函数
      const num = parseInt(color.replace("#", ""), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = ((num >> 8) & 0x00ff) + amt;
      const B = (num & 0x0000ff) + amt;
      return (
        "#" +
        (
          0x1000000 +
          (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
          (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
          (B < 255 ? (B < 1 ? 0 : B) : 255)
        )
          .toString(16)
          .slice(1)
      );
    },
    loadAudio() {
      this.loading = true;
      this.error = false;
      this.$refs.audio.load();
      
      if (this.autoPlay) {
        this.play().catch(error => {
          console.error("Autoplay failed:", error);
          this.$emit("autoplay-failed", error);
        });
      }
    },
    async play() {
      try {
        this.loading = true;
        await this.$refs.audio.play();
        this.isPlaying = true;
        this.loading = false;
        this.$emit("play");
      } catch (error) {
        console.error("Playback failed:", error);
        this.isPlaying = false;
        this.loading = false;
        this.error = true;
        this.errorMessage = "Playback failed";
        this.$emit("error", error);
      }
    },
    pause() {
      this.$refs.audio.pause();
      this.isPlaying = false;
      this.$emit("pause");
    },
    togglePlay() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    },
    toggleMute() {
      this.isMuted = !this.isMuted;
      this.$refs.audio.muted = this.isMuted;
      this.$emit("mute", this.isMuted);
    },
    updateVolume() {
      this.$refs.audio.volume = this.volume;
      this.$emit("volume-change", this.volume);
    },
    changePlaybackRate(rate) {
      this.playbackRate = rate;
      this.$refs.audio.playbackRate = rate;
      this.$emit("rate-change", rate);
    },
    updateTime() {
      this.currentTime = this.$refs.audio.currentTime;
      this.$emit("time-update", this.currentTime);
    },
    initPlayer() {
      this.duration = this.$refs.audio.duration;
      this.$refs.audio.volume = this.volume;
      this.$refs.audio.playbackRate = this.playbackRate;
      this.$refs.audio.loop = this.loop;
      this.$emit("loaded", this.duration);
    },
    handleEnded() {
      this.isPlaying = false;
      this.$emit("ended");
    },
    onWaiting() {
      this.loading = true;
    },
    onCanPlay() {
      this.loading = false;
    },
    onError() {
      this.loading = false;
      this.error = true;
      this.errorMessage = this.$refs.audio.error
        ? "Failed to load audio"
        : "Playback error";
      this.$emit("error", this.$refs.audio.error);
    },
    formatTime(time) {
      if (isNaN(time)) return "0:00";
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    },
    seekByClick(e) {
      if (!this.$refs.audio) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const seekTime = ((e.clientX - rect.left) / rect.width) * this.duration;
      this.$refs.audio.currentTime = seekTime;
      this.$emit("seek", seekTime);
    },
    resetPlayer() {
      this.pause();
      this.currentTime = 0;
      this.duration = 0;
      this.error = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.audio-player-container {
  --main-color: #409eff;
  --hover-color: #66b1ff;
  width: 100%;
  max-width: 400px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
}

.audio-player {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 8px 12px;
  transition: all 0.3s ease;
  position: relative;

  &.has-error {
    opacity: 0.7;
  }
}

.play-btn {
  width: 32px;
  height: 32px;
  background: var(--main-color);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: var(--hover-color);
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #dcdfe6;
  }

  i {
    font-size: 14px;
  }

  .fa-spinner {
    margin-left: 1px;
  }
}

.progress-container {
  flex-grow: 1;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  position: relative;
  margin: 0 12px;
  cursor: pointer;

  &:hover {
    height: 6px;
    margin-top: -1px;
    margin-bottom: -1px;
  }
}

.progress-bar {
  height: 100%;
  background: var(--main-color);
  border-radius: 2px;
  transition: width 0.1s linear;
}

.time-display {
  position: absolute;
  top: -20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #909399;

  .duration {
    color: #c0c4cc;
  }
}

.right-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 4px;

  .volume-slider {
    width: 60px;
    height: 4px;
    -webkit-appearance: none;
    background: #e0e0e0;
    border-radius: 2px;
    outline: none;
    opacity: 0;
    transition: opacity 0.2s ease, width 0.2s ease;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 12px;
      height: 12px;
      background: var(--main-color);
      border-radius: 50%;
      cursor: pointer;
    }

    &:hover {
      opacity: 1;
    }
  }

  &:hover .volume-slider {
    opacity: 1;
  }
}

.icon-btn {
  background: none;
  border: none;
  color: #909399;
  font-size: 14px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  transition: all 0.2s ease;
  border-radius: 4px;

  &:hover {
    color: var(--main-color);
    background: rgba(64, 158, 255, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.error-message {
  margin-top: 8px;
  font-size: 12px;
  color: #f56c6c;
  display: flex;
  align-items: center;
  gap: 4px;

  i {
    font-size: 14px;
  }
}

.active {
  color: var(--main-color);
  font-weight: bold;
}

@media (max-width: 480px) {
  .audio-player {
    padding: 6px 10px;
  }

  .play-btn {
    width: 28px;
    height: 28px;

    i {
      font-size: 12px;
    }
  }

  .volume-control .volume-slider {
    width: 40px;
  }
}
</style>