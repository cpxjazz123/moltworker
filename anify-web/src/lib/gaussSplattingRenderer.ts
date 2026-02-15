import { PointerControls, SplatMesh } from "@sparkjsdev/spark";
import * as THREE from "three";

import { areAnimationsSettled, isQuaternionSettled } from "./sceneActivity";

interface RouteConfig {
  cameraZ?: number;
  enableCameraMovement?: boolean; // 是否启用鼠标/陀螺仪镜头晃动
  rotY: number;
}

const ROUTE_OFFSETS: Record<string, RouteConfig> = {
  "/": { enableCameraMovement: false, rotY: 0 },
  "/memories": { enableCameraMovement: false, rotY: 1.3 },
  "/me": { enableCameraMovement: false, rotY: 2.5 },
  "/settings": { enableCameraMovement: false, rotY: 4.45 },
};

// Chat mode camera config (used when chat mode is active on home page)
const CHAT_MODE_CONFIG: RouteConfig = {
  cameraZ: -1.5,
  enableCameraMovement: true,
  rotY: 0,
};

// 入场动画配置
const INTRO_ANIMATION = {
  duration: 3.5, // 总时长（秒）
  startZ: 2.5, // 起始 Z 位置（从远处）
  startY: 1, // 起始 Y 位置（从上方）
  startRotY: -Math.PI / 2, // 起始 Y 轴旋转（-90度）
  easeOutPower: 2.5, // 缓动曲线强度（越大末尾越平滑）
};

class GaussSplattingRenderer {
  private static instance: GaussSplattingRenderer | null = null;

  private baseQuaternion = new THREE.Quaternion();
  private boundOnDeviceOrientation: (e: DeviceOrientationEvent) => void;
  private boundOnGyroPermissionGranted: () => void;
  // Bound event handlers
  private boundOnMouseMove: (e: MouseEvent) => void;
  private boundOnResize: () => void;
  private boundOnScreenOrientationChange: () => void;

  private camera: null | THREE.PerspectiveCamera = null;
  private container: HTMLDivElement | null = null;
  private contentGroup: null | THREE.Group = null;
  private controls: null | PointerControls = null;

  private currentCameraZ = 0;
  private currentChatMode = false;

  private currentGyroQuaternion = new THREE.Quaternion();
  private currentPathname = "/";
  private currentRotY = 0;
  private currentUrl = "";
  private enableCameraMovement = false;
  // Gyro state
  private deviceQuaternion = new THREE.Quaternion();
  private hasBaseQuaternion = false;
  // 入场动画
  private introAnimationProgress = 0;
  private isPlayingIntro = false;
  // 可变帧率控制
  private isRendering = false; // 是否正在渲染（静止时完全停止）
  private isInitialized = false;
  // Performance
  private lastTime = 0;

  // Mouse state for parallax
  private mouse = { x: 0, y: 0 };
  private q0 = new THREE.Quaternion();
  private q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));

  private renderer: null | THREE.WebGLRenderer = null;
  private scene: null | THREE.Scene = null;
  private screenOrientation = 0;
  private splatMesh: any = null;
  private targetCameraZ = 0;
  private targetGyroQuaternion = new THREE.Quaternion();

  // Camera state
  private targetRotY = 0;
  // Constants for gyro
  private zee = new THREE.Vector3(0, 0, 1);

  private constructor() {
    this.boundOnMouseMove = this.onMouseMove.bind(this);
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnDeviceOrientation = this.onDeviceOrientation.bind(this);
    this.boundOnScreenOrientationChange = this.onScreenOrientationChange.bind(this);
    this.boundOnGyroPermissionGranted = this.onGyroPermissionGranted.bind(this);
  }

  static getInstance(): GaussSplattingRenderer {
    if (!GaussSplattingRenderer.instance) {
      GaussSplattingRenderer.instance = new GaussSplattingRenderer();
    }

    return GaussSplattingRenderer.instance;
  }

  dispose(): void {
    // 停止渲染循环
    this.isRendering = false;
    this.isInitialized = false;

    window.removeEventListener("resize", this.boundOnResize);
    window.removeEventListener("mousemove", this.boundOnMouseMove);
    window.removeEventListener("deviceorientation", this.boundOnDeviceOrientation);
    window.removeEventListener("orientationchange", this.boundOnScreenOrientationChange);
    window.removeEventListener("gyro-permission-granted", this.boundOnGyroPermissionGranted);

    if (this.splatMesh?.dispose) {
      this.splatMesh.dispose();
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.controls) {
      (this.controls as any).dispose?.();
    }

    if (this.container) {
      this.container.innerHTML = "";
    }

    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.contentGroup = null;
    this.splatMesh = null;
    this.controls = null;
    this.container = null;
    this.hasBaseQuaternion = false;
  }

  initialize(
    container: HTMLDivElement,
    url = "https://oss.anify.ai/gs/3b5320a4-72b4-4eb4-98fe-13c78ae1c070_ceramic_500k.spz",
  ): void {
    // If already initialized with same URL and container, just attach
    if (this.isInitialized && this.currentUrl === url && this.renderer) {
      this.attachToContainer(container);

      return;
    }

    // Clean up if reinitializing with different URL
    if (this.isInitialized) {
      this.dispose();
    }

    this.container = container;
    this.currentUrl = url;

    // Performance settings for old iOS
    const isOldIOS =
      /iPhone\s*(X|XS|XR|[1-9]|1[0-2]|SE)/i.test(navigator.userAgent) ||
      (/iPhone/i.test(navigator.userAgent) && /OS\s*(1[0-5])_/i.test(navigator.userAgent));
    const targetPixelRatio = isOldIOS ? 1.0 : Math.min(window.devicePixelRatio, 1.5);
    const targetDownsample = isOldIOS ? 4 : 2;

    // Create Three.js scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: false,
      depth: true,
      powerPreference: "high-performance",
      precision: isOldIOS ? "lowp" : "mediump",
      stencil: false,
    });

    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setSize(window.innerWidth, this.getCanvasHeight());
    this.renderer.setPixelRatio(targetPixelRatio);

    this.controls = new PointerControls({
      canvas: this.renderer.domElement,
      rotateSpeed: 0.0001,
    });

    this.contentGroup = new THREE.Group();
    this.scene.add(this.contentGroup);

    this.splatMesh = new SplatMesh({
      downsample: targetDownsample,
      url,
      worker: true,
    } as any) as any;

    this.splatMesh.quaternion.set(1, 0, 0, 0);
    this.contentGroup.add(this.splatMesh);

    // Attach to container
    this.attachToContainer(container);

    // Add event listeners
    window.addEventListener("resize", this.boundOnResize);
    window.addEventListener("mousemove", this.boundOnMouseMove);
    window.addEventListener("orientationchange", this.boundOnScreenOrientationChange);
    // 陀螺仪权限请求改为由外部触发（点击立绘时），通过 gyro-permission-granted 事件通知
    window.addEventListener("gyro-permission-granted", this.boundOnGyroPermissionGranted);

    this.onScreenOrientationChange();

    // Log GPU info
    const gl = this.renderer.getContext();
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

    if (debugInfo) {
      console.log("GPU Vendor:", gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
      console.log("GPU Renderer:", gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
    }

    // 初始化时间并启动入场动画
    this.lastTime = performance.now();
    this.isInitialized = true;
    this.isPlayingIntro = true;
    this.introAnimationProgress = 0;
    this.startRendering();
  }

  setChatMode(chatMode: boolean): void {
    this.currentChatMode = chatMode;
    this.applyRouteConfig();
  }

  setPathname(pathname: string): void {
    this.currentPathname = pathname;
    this.applyRouteConfig();
  }

  private applyRouteConfig(): void {
    // Use chat mode config when on home page and chat mode is active
    const routeConfig =
      this.currentPathname === "/" && this.currentChatMode
        ? CHAT_MODE_CONFIG
        : (ROUTE_OFFSETS[this.currentPathname] ?? { rotY: 0 });

    const desiredRotY = routeConfig.rotY;
    const desiredCameraZ = routeConfig.cameraZ ?? 0;

    // 更新镜头晃动开关
    this.enableCameraMovement = routeConfig.enableCameraMovement ?? false;

    // Calculate shortest rotation path
    let diff = (desiredRotY - this.currentRotY) % (Math.PI * 2);

    if (diff > Math.PI) {
      diff -= Math.PI * 2;
    }

    if (diff < -Math.PI) {
      diff += Math.PI * 2;
    }

    const newTargetRotY = this.currentRotY + diff;
    const newTargetCameraZ = desiredCameraZ;

    // 设置目标值
    this.targetRotY = newTargetRotY;
    this.targetCameraZ = newTargetCameraZ;

    // 有动画需要播放时启动渲染
    const hasAnimation =
      Math.abs(newTargetRotY - this.currentRotY) > 0.001 || Math.abs(newTargetCameraZ - this.currentCameraZ) > 0.001;

    if (hasAnimation) {
      this.startRendering();
    }
  }

  private animate(): void {
    const time = performance.now();
    const deltaTime = (time - this.lastTime) / 1000;

    this.lastTime = time;

    // 处理入场动画
    if (this.isPlayingIntro) {
      this.introAnimationProgress += deltaTime / INTRO_ANIMATION.duration;

      if (this.introAnimationProgress >= 1) {
        this.introAnimationProgress = 1;
        this.isPlayingIntro = false;
      }

      // 计算入场动画的偏移（弧线轨迹 + 旋转）
      const { introZ, introY, introRotY } = this.calculateIntroOffset(this.introAnimationProgress);

      if (this.camera) {
        this.camera.position.z = this.targetCameraZ + introZ;
        this.camera.position.y = introY;
      }

      if (this.contentGroup) {
        this.contentGroup.rotation.y = this.currentRotY + introRotY;
      }
    }

    // Smooth camera transitions (lower values = slower, smoother motion)
    const rotLerpFactor = Math.min(1, 0.8 * deltaTime);

    this.currentRotY += (this.targetRotY - this.currentRotY) * rotLerpFactor;

    const zLerpFactor = Math.min(1, 0.8 * deltaTime);

    this.currentCameraZ += (this.targetCameraZ - this.currentCameraZ) * zLerpFactor;

    // Update controls
    if (this.controls && this.camera) {
      this.controls.update(deltaTime, this.camera);
    }

    if (this.camera) {
      if (this.enableCameraMovement) {
        // 只在启用镜头晃动的页面应用陀螺仪/鼠标效果
        if (this.hasBaseQuaternion) {
          this.currentGyroQuaternion.slerp(this.targetGyroQuaternion, Math.min(1, 8 * deltaTime));
          this.camera.quaternion.copy(this.currentGyroQuaternion);
        } else {
          const maxTiltX = Math.PI / 12;
          const maxTiltY = Math.PI / 10;

          const targetEuler = new THREE.Euler(
            this.mouse.y * maxTiltX * 0.3,
            this.mouse.x * maxTiltY * 0.3,
            0,
            "YXZ",
          );
          const targetHoverQ = new THREE.Quaternion().setFromEuler(targetEuler);

          this.camera.quaternion.slerp(targetHoverQ, Math.min(1, 4 * deltaTime));
        }
      } else {
        // 在禁用镜头晃动的页面平滑回到默认角度
        const identityQ = new THREE.Quaternion();

        this.camera.quaternion.slerp(identityQ, Math.min(1, 4 * deltaTime));
      }

      // 入场动画期间不更新位置（由入场动画控制）
      if (!this.isPlayingIntro) {
        this.camera.position.z = this.currentCameraZ;
        this.camera.position.y = 0;
      }
    }

    // 入场动画期间不更新旋转（由入场动画控制）
    if (this.contentGroup && !this.isPlayingIntro) {
      this.contentGroup.rotation.y = this.currentRotY;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }

    // 检测动画是否完成，决定是否停止渲染
    this.checkAndStopIfIdle();
  }

  // 计算入场动画的偏移（弧线轨迹：先朝下飞，再逐渐朝前推，同时旋转）
  private calculateIntroOffset(progress: number): { introRotY: number; introY: number; introZ: number } {
    const { startZ, startY, startRotY, easeOutPower } = INTRO_ANIMATION;

    // 使用 ease-out 缓动
    const eased = 1 - Math.pow(1 - progress, easeOutPower);

    // Y: 先快速下降（使用更强的缓动）
    const yEased = 1 - Math.pow(1 - progress, easeOutPower + 1.5);
    const introY = startY * (1 - yEased);

    // Z: 延迟开始，后期加速推进
    const zProgress = Math.pow(progress, 1.5); // 前慢后快
    const zEased = 1 - Math.pow(1 - zProgress, easeOutPower);
    const introZ = startZ * (1 - zEased);

    // RotY: 从起始角度旋转到目标位置
    const introRotY = startRotY * (1 - eased);

    return { introRotY, introY, introZ };
  }

  // 检测是否可以停止渲染
  private checkAndStopIfIdle(): void {
    // 入场动画播放中不停止
    if (this.isPlayingIntro) {
      return;
    }

    // 如果启用了镜头晃动，始终保持渲染
    if (this.enableCameraMovement) {
      return;
    }

    // 使用共享的活动检测函数检查动画是否完成
    const animationsSettled = areAnimationsSettled([
      { current: this.currentRotY, target: this.targetRotY },
      { current: this.currentCameraZ, target: this.targetCameraZ },
    ]);

    // 检查相机姿态是否稳定
    const cameraStable = this.camera
      ? isQuaternionSettled(this.camera.quaternion)
      : true;

    // 所有动画都完成了，停止渲染
    if (animationsSettled && cameraStable) {
      this.stopRendering();
    }
  }

  // 渲染循环
  private renderLoop(): void {
    if (!this.isRendering || !this.isInitialized) {return;}

    this.animate();
    requestAnimationFrame(() => this.renderLoop());
  }

  // 启动渲染
  private startRendering(): void {
    if (this.isRendering) {return;}

    this.isRendering = true;
    this.lastTime = performance.now(); // 重置时间，避免 deltaTime 过大
    this.renderLoop();
  }

  // 停止渲染
  private stopRendering(): void {
    if (!this.isRendering) {return;}

    this.isRendering = false;
  }

  private attachToContainer(container: HTMLDivElement): void {
    if (!this.renderer) {return;}

    // Remove from previous container if needed
    if (this.renderer.domElement.parentElement && this.renderer.domElement.parentElement !== container) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }

    // Clear container and attach
    container.innerHTML = "";
    container.appendChild(this.renderer.domElement);
    this.container = container;

    // Ensure proper size
    this.onResize();
  }

  private getCanvasHeight(): number {
    const styles = getComputedStyle(document.documentElement);
    const lvhFromVar = parseFloat(styles.getPropertyValue("--ios-lvh"));
    const blurFromVar = parseFloat(styles.getPropertyValue("--ios-blur-offset"));

    if (lvhFromVar && blurFromVar) {
      return lvhFromVar + blurFromVar;
    }

    return window.innerHeight;
  }

  private onDeviceOrientation(e: DeviceOrientationEvent): void {
    if (e.alpha === null || e.beta === null || e.gamma === null) {return;}

    const alpha = THREE.MathUtils.degToRad(e.alpha);
    const beta = THREE.MathUtils.degToRad(e.beta);
    const gamma = THREE.MathUtils.degToRad(e.gamma);
    const orient = THREE.MathUtils.degToRad(this.screenOrientation);

    this.setObjectQuaternion(this.deviceQuaternion, alpha, beta, gamma, orient);

    if (!this.hasBaseQuaternion) {
      this.baseQuaternion.copy(this.deviceQuaternion);
      this.hasBaseQuaternion = true;

      return;
    }

    const relativeQ = this.baseQuaternion.clone().invert().multiply(this.deviceQuaternion);
    const relativeEuler = new THREE.Euler().setFromQuaternion(relativeQ, "YXZ");
    const maxAngle = Math.PI / 4;

    relativeEuler.x = THREE.MathUtils.clamp(relativeEuler.x, -maxAngle, maxAngle);
    relativeEuler.y = THREE.MathUtils.clamp(relativeEuler.y, -maxAngle, maxAngle);
    relativeEuler.z = 0;

    this.targetGyroQuaternion.setFromEuler(relativeEuler);
  }

  private onGyroPermissionGranted(): void {
    console.log("Gyro permission granted externally, adding listener");
    window.addEventListener("deviceorientation", this.boundOnDeviceOrientation, true);
  }

  private onMouseMove(e: MouseEvent): void {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  }

  private onResize(): void {
    if (!this.camera || !this.renderer) {return;}

    this.camera.aspect = window.innerWidth / this.getCanvasHeight();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, this.getCanvasHeight());
  }

  private onScreenOrientationChange(): void {
     
    this.screenOrientation = (window as any).orientation || 0;
  }

  private setObjectQuaternion(
    quaternion: THREE.Quaternion,
    alpha: number,
    beta: number,
    gamma: number,
    orient: number,
  ): void {
    const euler = new THREE.Euler(beta, alpha, -gamma, "YXZ");

    quaternion.setFromEuler(euler);
    quaternion.multiply(this.q1);
    quaternion.multiply(this.q0.setFromAxisAngle(this.zee, -orient));
  }
}

export const gaussSplattingRenderer = GaussSplattingRenderer.getInstance();
