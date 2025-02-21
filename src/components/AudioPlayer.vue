<template>
  <div class="mini-audio-player" :style="{ width: '260px', height: '40px' }">
    <audio
      ref="audio"
      :src="src"
      @timeupdate="updateTime"
      @loadedmetadata="initPlayer"
      @ended="handleEnded"
    ></audio>

    <div class="controls">
      <!-- 播放按钮 -->
      <button class="play-btn" @click="togglePlay">
        <i :class="playIcon"></i>
      </button>

      <!-- 进度条+时间 -->
      <div class="progress-container" @click="seekByClick">
        <div class="progress-bar" :style="{ width: progressPercentage }"></div>
        <span class="time">{{ formatTime(currentTime) }}</span>
      </div>

      <!-- 右侧控制 -->
      <div class="right-controls">
        <!-- 静音按钮 -->
        <button class="icon-btn" @click="toggleMute">
          <i :class="muteIcon"></i>
        </button>

        <!-- 下载按钮 -->
        <a :href="src" download class="icon-btn">
          <i class="fas fa-download"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["src"],
  data() {
    return {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      isMuted: false,
    };
  },
  computed: {
    progressPercentage() {
      return `${(this.currentTime / this.duration) * 100}%`;
    },
    playIcon() {
      return this.isPlaying ? "fas fa-pause" : "fas fa-play";
    },
    muteIcon() {
      return this.isMuted ? "fas fa-volume-mute" : "fas fa-volume-up";
    },
  },
  methods: {
    togglePlay() {
      const audio = this.$refs.audio;
      this.isPlaying ? audio.pause() : audio.play();
      this.isPlaying = !this.isPlaying;
    },
    toggleMute() {
      this.isMuted = !this.isMuted;
      this.$refs.audio.muted = this.isMuted;
    },
    updateTime() {
      this.currentTime = this.$refs.audio.currentTime;
    },
    initPlayer() {
      this.duration = this.$refs.audio.duration;
    },
    handleEnded() {
      this.isPlaying = false;
    },
    formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    },
    seekByClick(e) {
      const rect = e.currentTarget.getBoundingClientRect();
      this.$refs.audio.currentTime =
        ((e.clientX - rect.left) / rect.width) * this.duration;
    },
  },
};
</script>

<style scoped>
.mini-audio-player {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 6px 10px;
  display: flex;
  align-items: center;
}

.controls {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
}

.play-btn {
  width: 24px;
  height: 24px;
  background: #1db954;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.play-btn i {
  font-size: 12px;
  margin-left: 1px; /* 视觉居中调整 */
}

.progress-container {
  flex-grow: 1;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  position: relative;
  cursor: pointer;
}

.progress-bar {
  height: 100%;
  background: #1db954;
  border-radius: 2px;
  transition: width 0.1s linear;
}

.time {
  position: absolute;
  right: 0;
  top: -18px;
  font-size: 10px;
  color: #666;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 4px;
  border-radius: 3px;
}

.right-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.icon-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
}

.icon-btn:hover {
  color: #1db954;
}

.fa-download {
  font-size: 12px;
}
</style>
