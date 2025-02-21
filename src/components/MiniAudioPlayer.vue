<template>
  <button
    class="audio-player"
    :class="{ playing: isPlaying }"
    @click="togglePlay"
  >
    <!-- 播放图标 -->
    <svg v-show="!isPlaying" class="icon play" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>

    <!-- 停止图标 -->
    <svg v-show="isPlaying" class="icon stop" viewBox="0 0 24 24">
      <path d="M6 6h12v12H6z" />
    </svg>

    <audio ref="audio" :src="audioSrc" @ended="onEnded"></audio>
  </button>
</template>

<script>
export default {
  name: "AudioPlayer",
  props: {
    audioSrc: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isPlaying: false,
      audioElement: null,
    };
  },
  mounted() {
    this.initializeAudio();
    this.autoPlay();
  },
  methods: {
    initializeAudio() {
      this.audioElement = this.$refs.audio;
      this.audioElement.addEventListener("canplay", this.autoPlay);
    },
    togglePlay() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    },
    play() {
      this.audioElement.play();
      this.isPlaying = true;
    },
    pause() {
      this.audioElement.pause();
      this.isPlaying = false;
    },
    onEnded() {
      this.isPlaying = false; // 播放结束自动切回播放图标
    },
    autoPlay() {
      const promise = this.audioElement.play();
      if (promise !== undefined) {
        promise
          .catch(() => {
            this.isPlaying = false;
          })
          .then(() => {
            this.isPlaying = true;
          });
      }
    },
  },
  watch: {
    audioSrc() {
      this.audioElement.load();
      this.autoPlay();
    },
  },
  beforeDestroy() {
    this.audioElement.removeEventListener("canplay", this.autoPlay);
  },
};
</script>

<style scoped>
.audio-player {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #2196f3;
  cursor: pointer;
  position: relative;
  padding: 0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.audio-player:hover {
  background: #1976d2;
  transform: scale(1.1);
}

.icon {
  width: 60%;
  height: 60%;
  fill: white;
  transition: opacity 0.3s ease;
}

.play {
  opacity: 1;
  margin-left: 2px; /* 视觉居中调整 */
}

.stop {
  opacity: 0;
}

.playing .play {
  opacity: 0;
}

.playing .stop {
  opacity: 1;
}
</style>
