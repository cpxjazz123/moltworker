import { Billboard, useTexture } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

// 荧光发光点着色器材质
const GlowPointMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color("#ffffff"),
    uOpacity: 1.0,
    uGlowIntensity: 1.0,
  },
  // 顶点着色器
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // 片段着色器
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uGlowIntensity;
    varying vec2 vUv;

    void main() {
      // 计算到中心的距离
      vec2 center = vec2(0.5);
      float dist = distance(vUv, center) * 2.0;

      // 创建柔和的发光效果
      float glow = 1.0 - smoothstep(0.0, 1.0, dist);

      // 添加脉冲动画
      float pulse = 0.8 + 0.2 * sin(uTime * 3.0);

      // 核心更亮，边缘渐变
      float core = pow(glow, 2.0) * pulse;
      float outer = pow(glow, 0.5) * 0.5;

      float finalGlow = (core + outer) * uGlowIntensity;

      // 边缘完全透明
      if (dist > 1.0) discard;

      gl_FragColor = vec4(uColor * (1.0 + core * 2.0), finalGlow * uOpacity);
    }
  `,
);

// 荧光光圈着色器材质（用于图片底部）
const GlowRingMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color("#ffffff"),
    uOpacity: 1.0,
    uInnerRadius: 0.7, // 内半径比例 (0-1)
    uOuterRadius: 1.0, // 外半径比例 (0-1)
  },
  // 顶点着色器
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // 片段着色器
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uInnerRadius;
    uniform float uOuterRadius;
    varying vec2 vUv;

    void main() {
      // 计算到中心的距离
      vec2 center = vec2(0.5);
      float dist = distance(vUv, center) * 2.0;

      // 计算环的中心位置和宽度
      float ringCenter = (uInnerRadius + uOuterRadius) / 2.0;
      float ringWidth = (uOuterRadius - uInnerRadius) / 2.0;

      // 计算到环中心的距离
      float distToRing = abs(dist - ringCenter);

      // 创建柔和的环形发光
      float glow = 1.0 - smoothstep(0.0, ringWidth * 1.5, distToRing);

      // 添加脉冲动画
      float pulse = 0.85 + 0.15 * sin(uTime * 3.0);

      // 核心更亮，边缘渐变
      float core = pow(glow, 1.5) * pulse;

      // 边缘完全透明
      if (dist > uOuterRadius * 1.3 || dist < uInnerRadius * 0.7) discard;

      float finalGlow = core * uOpacity;

      gl_FragColor = vec4(uColor * (1.0 + core), finalGlow);
    }
  `,
);

extend({ GlowPointMaterial, GlowRingMaterial });

import type { InteractionPoint, InteractionPointDisplayType } from "./types";

interface SinglePointProps {
  /** 地面Y坐标，用于光圈位置 */
  groundY?: number;
  /** 交互触发的最大角度（度） */
  maxAngle: number;
  /** 交互回调 */
  onInteract?: () => void;
  point: InteractionPoint;
  /** 交互触发的最大距离 */
  triggerDistance: number;
}

/**
 * 带图片的交互点组件（Billboard 始终面向相机）
 */
function ImageInteractionPoint({
  groundY,
  maxAngle,
  onInteract,
  point,
  triggerDistance,
}: SinglePointProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const { camera } = useThree();
  const [canInteract, setCanInteract] = useState(false);
  const wasInteractableRef = useRef(false);

  // 加载图片纹理
  const texture = useTexture(point.imageUrl!);

  // 计算图片尺寸（保持纵横比，基础高度1米，可选缩放）
  const dimensions = useMemo(() => {
    const scale = point.imageScale ?? 1;
    const baseHeight = 1 * scale;
    const img = texture.image as { width?: number; height?: number } | undefined;
    const aspectRatio = img?.width && img?.height ? img.width / img.height : 1;
    // 光圈的平面尺寸（需要足够大以容纳发光效果）
    const ringSize = 0.5 * scale;
    return { height: baseHeight, ringSize, width: baseHeight * aspectRatio };
  }, [texture, point.imageScale]);

  // 复用的向量对象
  const toPoint = useRef(new THREE.Vector3());
  const cameraDir = useRef(new THREE.Vector3());

  useFrame((state) => {
    if (!groupRef.current) return;

    // 更新光圈材质的时间
    if (ringMaterialRef.current) {
      ringMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }

    // 计算从相机到光点的向量
    toPoint.current.set(
      point.position[0] - camera.position.x,
      point.position[1] - camera.position.y,
      point.position[2] - camera.position.z,
    );

    const distance = toPoint.current.length();

    // 获取相机朝向
    camera.getWorldDirection(cameraDir.current);

    // 计算角度（弧度转度）
    const angle = cameraDir.current.angleTo(toPoint.current.normalize());
    const angleInDegrees = THREE.MathUtils.radToDeg(angle);

    // 判断是否可交互
    const nowInteractable = distance < triggerDistance && angleInDegrees < maxAngle;

    if (nowInteractable !== wasInteractableRef.current) {
      wasInteractableRef.current = nowInteractable;
      setCanInteract(nowInteractable);
    }
  });

  // E 键交互
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyE" && canInteract) {
        onInteract?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canInteract, onInteract]);

  return (
    <group ref={groupRef} position={point.position}>
      {/* Billboard 让图片始终面向相机 */}
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <mesh renderOrder={999}>
          <planeGeometry args={[dimensions.width, dimensions.height]} />
          <meshBasicMaterial
            map={texture}
            transparent
            alphaTest={0.5}
            side={THREE.DoubleSide}
            depthTest={false}
            toneMapped={false}
            color={canInteract ? "#ffffff" : "#888888"}
          />
        </mesh>
      </Billboard>
      {/* 可交互时在脚下显示荧光光圈 */}
      {canInteract && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, groundY !== undefined ? groundY - point.position[1] + 0.01 : -dimensions.height / 2 + 0.01, 0]}
          renderOrder={998}
        >
          <planeGeometry args={[dimensions.ringSize, dimensions.ringSize]} />
          {/* @ts-expect-error - GlowRingMaterial is extended */}
          <glowRingMaterial
            ref={ringMaterialRef}
            transparent
            depthTest={false}
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * 简单光点交互点组件（无图片）- 荧光发光效果
 */
function SimpleInteractionPoint({
  maxAngle,
  onInteract,
  point,
  triggerDistance,
}: SinglePointProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [canInteract, setCanInteract] = useState(false);
  const wasInteractableRef = useRef(false);

  // 复用的向量对象
  const toPoint = useRef(new THREE.Vector3());
  const cameraDir = useRef(new THREE.Vector3());

  // 颜色配置
  const activeColor = useMemo(() => new THREE.Color("#ffffff"), []);
  const inactiveColor = useMemo(() => new THREE.Color("#aaaaaa"), []);

  useFrame((state) => {
    if (!groupRef.current || !materialRef.current) return;

    // 更新时间 uniform
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    // 计算从相机到光点的向量
    toPoint.current.set(
      point.position[0] - camera.position.x,
      point.position[1] - camera.position.y,
      point.position[2] - camera.position.z,
    );

    const distance = toPoint.current.length();

    // 获取相机朝向
    camera.getWorldDirection(cameraDir.current);

    // 计算角度（弧度转度）
    const angle = cameraDir.current.angleTo(toPoint.current.normalize());
    const angleInDegrees = THREE.MathUtils.radToDeg(angle);

    // 判断是否可交互
    const nowInteractable = distance < triggerDistance && angleInDegrees < maxAngle;

    // 根据交互状态更新材质
    if (nowInteractable) {
      materialRef.current.uniforms.uColor.value = activeColor;
      materialRef.current.uniforms.uGlowIntensity.value = 1.5;
      materialRef.current.uniforms.uOpacity.value = 1.0;
    } else {
      materialRef.current.uniforms.uColor.value = inactiveColor;
      materialRef.current.uniforms.uGlowIntensity.value = 0.8;
      materialRef.current.uniforms.uOpacity.value = 0.7;
    }

    if (nowInteractable !== wasInteractableRef.current) {
      wasInteractableRef.current = nowInteractable;
      setCanInteract(nowInteractable);
    }
  });

  // E 键交互
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyE" && canInteract) {
        onInteract?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canInteract, onInteract]);

  return (
    <group ref={groupRef} position={point.position}>
      {/* Billboard 让发光点始终面向相机 */}
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <mesh renderOrder={999}>
          <planeGeometry args={[0.3, 0.3]} />
          {/* @ts-expect-error - GlowPointMaterial is extended */}
          <glowPointMaterial
            ref={materialRef}
            transparent
            depthTest={false}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </Billboard>
    </group>
  );
}

const DISPLAY_TYPE_CONFIG: Record<
  'navigation' | 'treasure',
  { defaultEmoji: string; glowColor: string }
> = {
  navigation: { defaultEmoji: '🚪', glowColor: '#00e5ff' },
  treasure: { defaultEmoji: '✨', glowColor: '#ffd700' },
};

/**
 * 使用 Canvas 2D 将 emoji 渲染为 THREE.CanvasTexture
 */
function useEmojiTexture(emoji: string) {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, size, size);
    ctx.font = '96px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, size / 2, size / 2);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [emoji]);
}

interface EmojiPointProps extends SinglePointProps {
  displayType: 'navigation' | 'treasure';
}

/**
 * Emoji 交互点组件（Billboard + 浮动动画）
 */
function EmojiInteractionPoint({
  displayType,
  groundY,
  maxAngle,
  onInteract,
  point,
  triggerDistance,
}: EmojiPointProps) {
  const config = DISPLAY_TYPE_CONFIG[displayType];
  const emoji = point.icon || config.defaultEmoji;
  const texture = useEmojiTexture(emoji);

  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const ringMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const { camera } = useThree();
  const [canInteract, setCanInteract] = useState(false);
  const wasInteractableRef = useRef(false);

  const glowColor = useMemo(() => new THREE.Color(config.glowColor), [config.glowColor]);

  const toPoint = useRef(new THREE.Vector3());
  const cameraDir = useRef(new THREE.Vector3());

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime;

    // 浮动动画：Y 轴 ±0.05m
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(t * 2) * 0.05;
      // treasure 类型额外加 Y 轴旋转
      if (displayType === 'treasure') {
        meshRef.current.rotation.y = t * 0.5;
      }
    }

    // 更新光圈材质时间
    if (ringMaterialRef.current) {
      ringMaterialRef.current.uniforms.uTime.value = t;
    }

    // 距离+角度判断
    toPoint.current.set(
      point.position[0] - camera.position.x,
      point.position[1] - camera.position.y,
      point.position[2] - camera.position.z,
    );

    const distance = toPoint.current.length();
    camera.getWorldDirection(cameraDir.current);
    const angle = cameraDir.current.angleTo(toPoint.current.normalize());
    const angleInDegrees = THREE.MathUtils.radToDeg(angle);
    const nowInteractable = distance < triggerDistance && angleInDegrees < maxAngle;

    if (nowInteractable !== wasInteractableRef.current) {
      wasInteractableRef.current = nowInteractable;
      setCanInteract(nowInteractable);
    }
  });

  // E 键交互
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyE" && canInteract) {
        onInteract?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canInteract, onInteract]);

  const emojiSize = 0.4;
  const ringSize = 0.5;

  return (
    <group ref={groupRef} position={point.position}>
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <mesh ref={meshRef} renderOrder={999}>
          <planeGeometry args={[emojiSize, emojiSize]} />
          <meshBasicMaterial
            map={texture}
            transparent
            depthTest={false}
            toneMapped={false}
            opacity={canInteract ? 1.0 : 0.7}
          />
        </mesh>
      </Billboard>
      {/* 可交互时在脚下显示发光光圈 */}
      {canInteract && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, groundY !== undefined ? groundY - point.position[1] + 0.01 : -emojiSize / 2 + 0.01, 0]}
          renderOrder={998}
        >
          <planeGeometry args={[ringSize, ringSize]} />
          {/* @ts-expect-error - GlowRingMaterial is extended */}
          <glowRingMaterial
            ref={ringMaterialRef}
            uColor={glowColor}
            transparent
            depthTest={false}
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * 单个交互点组件（根据 displayType 选择渲染方式）
 */
function SingleInteractionPoint(props: SinglePointProps) {
  const displayType: InteractionPointDisplayType = props.point.displayType
    ?? (props.point.imageUrl ? 'portrait' : 'default');

  switch (displayType) {
    case 'portrait':
      return <ImageInteractionPoint {...props} />;
    case 'navigation':
    case 'treasure':
      return <EmojiInteractionPoint {...props} displayType={displayType} />;
    default:
      return <SimpleInteractionPoint {...props} />;
  }
}

interface InteractionPointDisplayProps {
  /** 地面Y坐标，用于光圈位置 */
  groundY?: number;
  /** 交互触发的最大角度（度），默认45度 */
  maxAngle?: number;
  /** 交互回调，传递点ID和完整的交互点数据 */
  onInteract?: (pointId: string, point: InteractionPoint) => void;
  /** 要显示的交互点列表 */
  points: InteractionPoint[];
  /** 全局交互触发的最大距离，默认1米，可被每个点的triggerDistance覆盖 */
  triggerDistance?: number;
}

/**
 * 交互点显示组件
 * 显示已保存的交互点，并在玩家靠近且面向时高亮
 */
export function InteractionPointDisplay({
  groundY,
  maxAngle = 45,
  onInteract,
  points,
  triggerDistance: defaultTriggerDistance = 1,
}: InteractionPointDisplayProps) {
  return (
    <group>
      {points.map((point) => (
        <SingleInteractionPoint
          key={point.id}
          groundY={groundY}
          maxAngle={maxAngle}
          onInteract={() => onInteract?.(point.id, point)}
          point={point}
          triggerDistance={point.triggerDistance ?? defaultTriggerDistance}
        />
      ))}
    </group>
  );
}
