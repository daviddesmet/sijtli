<template>
  <div class="card-wrap" @mousemove="handleMouseMove" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" ref="card">
    <div class="card-body" :style="cardStyle">
      <div class="card-bg" :style="[cardBgTransform, cardBgImage]"></div>
      <div class="card-info">
        <slot name="header"></slot>
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    dataImage: String
  }
})
export default class Card extends Vue {
  dataImage!: string;
  width = 0;
  height = 0;
  mouseX = 0;
  mouseY = 0;
  mouseLeaveDelay?: number;

  get mousePX(): number {
    return this.mouseX / this.width;
  }

  get mousePY(): number {
    return this.mouseY / this.height;
  }

  get cardStyle(): { transform: string } {
    const rX = this.mousePX * 30;
    const rY = this.mousePY * -30;
    return {
      transform: `rotateY(${rX}deg) rotateX(${rY}deg)`
    };
  }

  get cardBgTransform(): { transform: string } {
    const tX = this.mousePX * -40;
    const tY = this.mousePY * -40;
    return {
      transform: `translateX(${tX}px) translateY(${tY}px)`
    };
  }

  get cardBgImage(): { backgroundImage: string } {
    return {
      backgroundImage: `url(${this.dataImage})`
    };
  }

  handleMouseMove(e: MouseEvent): void {
    this.mouseX = e.pageX - (this.$refs.card as HTMLElement).offsetLeft - this.width / 2;
    this.mouseY = e.pageY - (this.$refs.card as HTMLElement).offsetTop - this.height / 2;
  }

  handleMouseEnter(): void {
    clearTimeout(this.mouseLeaveDelay);
  }

  handleMouseLeave(): void {
    this.mouseLeaveDelay = window.setTimeout(() => {
      this.mouseX = 0;
      this.mouseY = 0;
    }, 1000);
  }

  mounted(): void {
    this.width = (this.$refs.card as HTMLElement).offsetWidth;
    this.height = (this.$refs.card as HTMLElement).offsetHeight;
  }
}
</script>

<style lang="scss">
$hover-easing: cubic-bezier(0.23, 1, 0.32, 1);
$return-easing: cubic-bezier(0.445, 0.05, 0.55, 0.95);

.card-wrap {
  cursor: pointer;
  margin: 10px;
  transform: perspective(800px);
  transform-style: preserve-3d;
  // background-color: #fff;

  &:hover {
    .card-info {
      transform: translateY(0);
    }
    .card-info p {
      opacity: 1;
    }
    .card-info,
    .card-info p {
      transition: 0.6s $hover-easing;
    }
    .card-info::after {
      opacity: 1;
      transform: translateY(0);
      transition: 5s $hover-easing;
    }
    .card-bg {
      opacity: 0.8;
      transition: 0.6s $hover-easing, opacity 5s $hover-easing;
    }
    .card-body {
      box-shadow: rgba(#fff, 0.2) 0 0 40px 5px, rgba(#fff, 1) 0 0 0 1px, rgba(#000, 0.66) 0 30px 60px 0, inset #333 0 0 0 5px, inset #fff 0 0 0 6px;
      transition: 0.6s $hover-easing, box-shadow 2s $hover-easing;
    }
  }
}

.card-body {
  background-color: #333;
  border-radius: 10px;
  box-shadow: rgba(#000, 0.66) 0 30px 60px 0, inset #333 0 0 0 5px, inset rgba(#fff, 0.5) 0 0 0 6px;
  flex: 0 0 240px;
  height: 320px;
  overflow: hidden;
  position: relative;
  transition: 1s $return-easing;
  width: 240px;
}

.card-bg {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  box-sizing: content-box;
  height: 100%;
  left: -20px;
  opacity: 0.5;
  padding: 20px;
  pointer-events: none;
  position: absolute;
  top: -20px;
  transition: 1s $return-easing, opacity 5s 1s $return-easing;
  width: 100%;
}

.card-info {
  bottom: 0;
  color: #fff;
  padding: 20px;
  position: absolute;
  transform: translateY(40%);
  transition: 0.6s 1.6s cubic-bezier(0.215, 0.61, 0.355, 1);

  p {
    opacity: 0;
    text-shadow: rgba(#000, 1) 0 2px 3px;
    transition: 0.6s 1.6s cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  * {
    position: relative;
    z-index: 1;
  }

  &::after {
    background-blend-mode: overlay;
    background-image: linear-gradient(to bottom, transparent 0%, rgba(#000, 0.6) 100%);
    content: "";
    height: 100%;
    left: 0;
    opacity: 0;
    position: absolute;
    top: 0;
    transform: translateY(100%);
    transition: 5s 1s $return-easing;
    width: 100%;
    z-index: 0;
  }
}

.card-info h1 {
  font-family: "Playfair Display";
  font-size: 36px;
  font-weight: 700;
  text-shadow: rgba(#000, 0.5) 0 10px 10px;
}
</style>
