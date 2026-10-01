"use client";

import React, {
  type ComponentRef,
  type ReactNode,
  type RefObject,
  Suspense,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  AdditiveBlending,
  type BufferAttribute,
  type Camera,
  type Group,
  type InterleavedBufferAttribute,
  LinearFilter,
  MathUtils,
  type Mesh,
  type MeshBasicMaterial,
  OrthographicCamera,
  type PlaneGeometry,
  SRGBColorSpace,
  Scene,
  type ShaderMaterial,
  type Texture,
  Vector2,
  VideoTexture,
} from "three";
import {
  advance,
  Canvas,
  type CanvasProps,
  createPortal,
  useFrame,
  useStore,
  useThree,
} from "@react-three/fiber";
import { useFBO, useTexture } from "@react-three/drei";
import { EffectComposer } from "@react-three/postprocessing";
import { cancelFrame, type FrameData, frame } from "motion";
import { cn } from "@/lib/utils";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type ObjectFitCrop = {
  repeatU: number;
  repeatV: number;
  fitScaleX: number;
  fitScaleY: number;
};

export function computeObjectFit(
  planeAspect: number,
  mediaAspect: number,
  objectFit: string,
): ObjectFitCrop {
  const crop: ObjectFitCrop = {
    repeatU: 1,
    repeatV: 1,
    fitScaleX: 1,
    fitScaleY: 1,
  };
  if (!Number.isFinite(mediaAspect) || mediaAspect <= 0) return crop;

  if (objectFit === "cover") {
    if (planeAspect > mediaAspect) {
      crop.repeatV = mediaAspect / planeAspect;
    } else {
      crop.repeatU = planeAspect / mediaAspect;
    }
  } else if (objectFit === "contain") {
    if (planeAspect > mediaAspect) {
      crop.fitScaleX = mediaAspect / planeAspect;
    } else {
      crop.fitScaleY = planeAspect / mediaAspect;
    }
  }

  return crop;
}

export function applyUvCrop(
  uvAttribute: BufferAttribute | InterleavedBufferAttribute,
  segments: number,
  repeatU: number,
  repeatV: number,
) {
  const offsetU = (1 - repeatU) / 2;
  const offsetV = (1 - repeatV) / 2;

  for (let iy = 0; iy <= segments; iy++) {
    for (let ix = 0; ix <= segments; ix++) {
      const index = iy * (segments + 1) + ix;
      const u = ix / segments;
      const v = 1 - iy / segments;
      uvAttribute.setXY(index, u * repeatU + offsetU, v * repeatV + offsetV);
    }
  }

  uvAttribute.needsUpdate = true;
}

export type Pointer = {
  uv: Vector2;
  texUv: Vector2;
  repeat: Vector2;
  fit: Vector2;
  hover: number;
};

export type PointerTarget = Pointer | RefObject<Pointer>;

export function getPointerTarget(target: PointerTarget): Pointer {
  if ("current" in target) {
    return target.current;
  }
  return target;
}

type UsePointerUvOptions = {
  enabled: boolean;
  getRect?: (el: HTMLElement) => DOMRect;
};

export function usePointerUv(
  el: RefObject<HTMLElement | null>,
  { enabled, getRect }: UsePointerUvOptions,
): RefObject<Pointer> {
  const pointerRef = useRef<Pointer>({
    uv: new Vector2(0.5, 0.5),
    texUv: new Vector2(0.5, 0.5),
    repeat: new Vector2(1, 1),
    fit: new Vector2(1, 1),
    hover: 0,
  });

  useEffect(() => {
    if (!enabled) return;
    const target = el.current;
    if (!target) return;
    const currentPointer = pointerRef.current;

    const onMove = (event: PointerEvent) => {
      const rect = getRect ? getRect(target) : target.getBoundingClientRect();
      const width = rect.width || 1;
      const height = rect.height || 1;
      const x = (event.clientX - rect.left) / width;
      const y = 1 - (event.clientY - rect.top) / height;
      currentPointer.uv.set(x, y);
      currentPointer.texUv.set(
        x * currentPointer.fit.x + (1 - currentPointer.fit.x) / 2,
        y * currentPointer.fit.y + (1 - currentPointer.fit.y) / 2,
      );
    };

    const onEnter = () => {
      currentPointer.hover = 1;
    };
    const onLeave = () => {
      currentPointer.hover = 0;
    };

    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerenter", onEnter);
    target.addEventListener("pointerleave", onLeave);

    if (typeof target.matches === "function" && target.matches(":hover")) {
      currentPointer.hover = 1;
    }

    return () => {
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerenter", onEnter);
      target.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, el, getRect]);

  return pointerRef;
}

function WebglTeleport() {
  const items = new Map<string, ReactNode>();
  const listeners = new Set<() => void>();
  let snapshot: [string, ReactNode][] = [];

  const emit = () => {
    snapshot = Array.from(items.entries());
    for (const listener of listeners) {
      listener();
    }
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };
  const getSnapshot = () => snapshot;

  function useItems() {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  }

  return {
    In({ children }: { children: ReactNode }) {
      const id = useId();

      useIsoLayoutEffect(() => {
        items.set(id, children);
        emit();
        return () => {
          items.delete(id);
          emit();
        };
      }, [id, children]);
      return null;
    },
    useItems,
    Out() {
      const list = useItems();
      return (
        <>
          {list.map(([id, node]) => (
            <Suspense key={id} fallback={null}>
              {node}
            </Suspense>
          ))}
        </>
      );
    },
  };
}

export const webglTeleport = WebglTeleport();
export const effectTeleport = WebglTeleport();

export function WebglPortal() {
  return <webglTeleport.Out />;
}

const WebglContext = React.createContext<boolean>(false);

type WebglProviderProps = Omit<CanvasProps, "children" | "eventSource"> & {
  children: ReactNode;
  className?: string;
  contained?: boolean;
};

type WebglReadyOptions = {
  scene?: Scene;
  camera?: Camera;
  enabled?: boolean;
  onReady?: () => void;
};

export function useWebglReady({
  scene,
  camera,
  enabled = true,
  onReady,
}: WebglReadyOptions = {}) {
  const [ready, setReady] = useState(false);
  const gl = useThree((state) => state.gl);
  const defaultScene = useThree((state) => state.scene);
  const defaultCamera = useThree((state) => state.camera);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  const targetScene = scene ?? defaultScene;
  const targetCamera = camera ?? defaultCamera;

  useEffect(() => {
    if (!enabled) return;
    let active = true;

    gl.compileAsync(targetScene, targetCamera).then(() => {
      if (!active) return;
      requestAnimationFrame(() => {
        if (!active) return;
        setReady(true);
        onReadyRef.current?.();
      });
    });

    return () => {
      active = false;
    };
  }, [gl, targetScene, targetCamera, enabled]);

  return ready;
}

type CanvasStore = ReturnType<typeof useStore>;
const canvasStores = new Set<CanvasStore>();
let clockStart: number | null = null;

function tick(data: FrameData) {
  if (clockStart === null) clockStart = data.timestamp;

  const elapsed = (data.timestamp - clockStart) / 1000;

  let runGlobalEffects = true;
  for (const store of canvasStores) {
    const state = store.getState();
    if (state.internal.active) {
      advance(elapsed, runGlobalEffects, state);
      runGlobalEffects = false;
    }
  }
}

function MotionFrameloop() {
  const store = useStore();

  useEffect(() => {
    canvasStores.add(store);
    if (canvasStores.size === 1) frame.postRender(tick, true);
    return () => {
      canvasStores.delete(store);
      if (canvasStores.size === 0) cancelFrame(tick);
    };
  }, [store]);

  return null;
}

function RootRender() {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);

  useFrame(() => gl.render(scene, camera), 1);

  return null;
}

function Effects() {
  const effects = effectTeleport.useItems();
  const gl = useThree((state) => state.gl);
  const mounted = effects.length > 0;

  useEffect(() => {
    if (!mounted) return;
    return () => {
      gl.autoClear = true;
    };
  }, [mounted, gl]);

  if (!mounted) return <RootRender />;

  return (
    <EffectComposer key={effects.length} multisampling={0}>
      <effectTeleport.Out />
    </EffectComposer>
  );
}

export function WebglProvider({
  children,
  className,
  style,
  contained = false,
  ...canvasProps
}: WebglProviderProps) {
  const [eventSource, setEventSource] = useState<ComponentRef<"div"> | null>(
    null,
  );

  return (
    <WebglContext.Provider value={true}>
      <div
        ref={setEventSource}
        data-atelier-webgl=""
        className={className}
        style={contained ? { position: "relative" } : { display: "contents" }}
      >
        <Canvas
          eventPrefix="client"
          dpr={[1, 1.8]}
          {...canvasProps}
          frameloop="never"
          eventSource={eventSource ?? undefined}
          style={{
            position: contained ? "absolute" : "fixed",
            inset: 0,
            pointerEvents: "none",
            ...style,
          }}
        >
          <MotionFrameloop />
          <WebglPortal />
          <Effects />
        </Canvas>

        {children}
      </div>
    </WebglContext.Provider>
  );
}

type WebglImageProps = {
  src: string;
  alt: string;
  material?: (map: Texture, pointer: PointerTarget) => React.ReactNode;
  webglEnabled?: boolean;
  segments?: number;
  zIndex?: number;
  autoReflow?: boolean;
} & Omit<React.ComponentPropsWithoutRef<"img">, "children" | "src" | "alt">;

type ImagePlaneProps = {
  el: RefObject<HTMLImageElement | null>;
  src: string;
  segments: number;
  material?: (map: Texture, pointer: PointerTarget) => React.ReactNode;
  pointer: PointerTarget;
  zIndex: number;
  autoReflow: boolean;
};

function ImagePlane({
  el,
  src,
  segments,
  material,
  pointer,
  zIndex,
  autoReflow,
}: ImagePlaneProps) {
  const mesh = useRef<Mesh>(null);
  const texture = useTexture(src);
  const fitScale = useRef({ x: 1, y: 1 });
  const size = useThree((state) => state.size);
  const viewport = useThree((state) => state.viewport);
  const gl = useThree((state) => state.gl);

  useLayoutEffect(() => {
    const target = el.current;
    if (!target) return;

    const measure = () => {
      const m = mesh.current;
      if (!m) return;
      const rect = target.getBoundingClientRect();
      if (!rect || rect.height <= 0) return;

      const image = texture.image as HTMLImageElement;
      if (!image || !image.height) return;

      const crop = computeObjectFit(
        rect.width / rect.height,
        image.width / image.height,
        getComputedStyle(target).objectFit,
      );

      fitScale.current.x = crop.fitScaleX;
      fitScale.current.y = crop.fitScaleY;
      const p = getPointerTarget(pointer);
      p.repeat.set(crop.repeatU, crop.repeatV);
      p.fit.set(
        crop.repeatU / crop.fitScaleX,
        crop.repeatV / crop.fitScaleY,
      );

      applyUvCrop(
        m.geometry.attributes.uv,
        segments,
        crop.repeatU,
        crop.repeatV,
      );
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(target);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, [el, texture, segments, pointer]);

  useFrame(() => {
    const m = mesh.current;
    if (!m || !el.current || size.height <= 0) return;
    const pxToWorld = viewport.height / size.height;
    const fit = fitScale.current;

    const canvasRect =
      gl.domElement && typeof gl.domElement.getBoundingClientRect === "function"
        ? gl.domElement.getBoundingClientRect()
        : { left: 0, top: 0 };

    if (autoReflow && el.current) {
      const rect = el.current.getBoundingClientRect();
      const relLeft = rect.left - canvasRect.left;
      const relTop = rect.top - canvasRect.top;

      m.position.x = (relLeft + rect.width / 2 - size.width / 2) * pxToWorld;
      m.position.y = -(relTop + rect.height / 2 - size.height / 2) * pxToWorld;
      m.scale.x = rect.width * pxToWorld * fit.x;
      m.scale.y = rect.height * pxToWorld * fit.y;
    }
  });

  return (
    <mesh ref={mesh} renderOrder={zIndex}>
      <planeGeometry args={[1, 1, segments, segments]} />
      {material ? (
        material(texture, pointer)
      ) : (
        <meshBasicMaterial map={texture} transparent />
      )}
    </mesh>
  );
}

export function WebglImage({
  src,
  alt,
  className,
  style,
  material,
  webglEnabled = true,
  segments = 1,
  zIndex = 0,
  autoReflow = true,
  ...rest
}: WebglImageProps) {
  const el = useRef<ComponentRef<"img">>(null);
  const pointer = usePointerUv(el, { enabled: webglEnabled });

  return (
    <>
      <img
        ref={el}
        src={src}
        alt={alt}
        className={className}
        style={webglEnabled ? { ...style, opacity: 0 } : style}
        {...rest}
      />

      {webglEnabled && (
        <webglTeleport.In>
          <ImagePlane
            el={el}
            src={src}
            segments={segments}
            material={material}
            pointer={pointer}
            zIndex={zIndex}
            autoReflow={autoReflow}
          />
        </webglTeleport.In>
      )}
    </>
  );
}

type WebglVideoProps = {
  src: string;
  material?: (map: Texture, pointer: PointerTarget) => React.ReactNode;
  webglEnabled?: boolean;
  segments?: number;
  zIndex?: number;
  autoReflow?: boolean;
} & Omit<React.ComponentPropsWithoutRef<"video">, "children" | "src">;

type VideoPlaneProps = {
  el: RefObject<HTMLVideoElement | null>;
  segments: number;
  material?: (map: Texture, pointer: PointerTarget) => React.ReactNode;
  pointer: PointerTarget;
  zIndex: number;
  autoReflow: boolean;
};

function VideoPlane({
  el,
  segments,
  material,
  pointer,
  zIndex,
  autoReflow,
}: VideoPlaneProps) {
  const mesh = useRef<Mesh>(null);
  const [texture, setTexture] = useState<VideoTexture | null>(null);
  const fitScale = useRef({ x: 1, y: 1 });
  const size = useThree((state) => state.size);
  const viewport = useThree((state) => state.viewport);
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const video = el.current;
    if (!video) return;

    const videoTexture = new VideoTexture(video);
    videoTexture.colorSpace = SRGBColorSpace;
    queueMicrotask(() => {
      setTexture(videoTexture);
    });
    return () => videoTexture.dispose();
  }, [el]);

  useLayoutEffect(() => {
    const target = el.current;
    if (!target || !texture) return;

    const measure = () => {
      const m = mesh.current;
      if (!m) return;
      const rect = target.getBoundingClientRect();
      if (!rect || rect.height <= 0) return;

      const video = texture.image as HTMLVideoElement;
      if (!video || !video.videoHeight) return;

      const crop = computeObjectFit(
        rect.width / rect.height,
        video.videoWidth / video.videoHeight,
        getComputedStyle(target).objectFit,
      );

      fitScale.current.x = crop.fitScaleX;
      fitScale.current.y = crop.fitScaleY;
      const p = getPointerTarget(pointer);
      p.repeat.set(crop.repeatU, crop.repeatV);
      p.fit.set(
        crop.repeatU / crop.fitScaleX,
        crop.repeatV / crop.fitScaleY,
      );

      applyUvCrop(
        m.geometry.attributes.uv,
        segments,
        crop.repeatU,
        crop.repeatV,
      );
    };

    measure();

    target.addEventListener("loadedmetadata", measure);
    target.addEventListener("resize", measure);

    const ro = new ResizeObserver(measure);
    ro.observe(target);
    ro.observe(document.body);
    return () => {
      ro.disconnect();
      target.removeEventListener("loadedmetadata", measure);
      target.removeEventListener("resize", measure);
    };
  }, [el, texture, segments, pointer]);

  useFrame(() => {
    texture?.update();
    const m = mesh.current;
    if (!m || !el.current || size.height <= 0) return;
    const pxToWorld = viewport.height / size.height;
    const fit = fitScale.current;

    const canvasRect =
      gl.domElement && typeof gl.domElement.getBoundingClientRect === "function"
        ? gl.domElement.getBoundingClientRect()
        : { left: 0, top: 0 };

    if (autoReflow && el.current) {
      const rect = el.current.getBoundingClientRect();
      const relLeft = rect.left - canvasRect.left;
      const relTop = rect.top - canvasRect.top;

      m.position.x = (relLeft + rect.width / 2 - size.width / 2) * pxToWorld;
      m.position.y = -(relTop + rect.height / 2 - size.height / 2) * pxToWorld;
      m.scale.x = rect.width * pxToWorld * fit.x;
      m.scale.y = rect.height * pxToWorld * fit.y;
    }
  });

  if (!texture) return null;

  return (
    <mesh ref={mesh} renderOrder={zIndex}>
      <planeGeometry args={[1, 1, segments, segments]} />
      {material ? (
        material(texture, pointer)
      ) : (
        <meshBasicMaterial map={texture} transparent />
      )}
    </mesh>
  );
}

export function WebglVideo({
  src,
  className,
  style,
  material,
  webglEnabled = true,
  segments = 1,
  zIndex = 0,
  autoReflow = true,
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  ...rest
}: WebglVideoProps) {
  const el = useRef<ComponentRef<"video">>(null);
  const pointer = usePointerUv(el, { enabled: webglEnabled });

  return (
    <>
      <video
        ref={el}
        src={src}
        className={className}
        style={webglEnabled ? { ...style, opacity: 0 } : style}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        {...rest}
      />

      {webglEnabled && (
        <webglTeleport.In>
          <VideoPlane
            el={el}
            segments={segments}
            material={material}
            pointer={pointer}
            zIndex={zIndex}
            autoReflow={autoReflow}
          />
        </webglTeleport.In>
      )}
    </>
  );
}

const ROTATION_SPEED = 0.1;
const INITIAL_OPACITY = 0.22;
const DISPLACEMENT_DAMPING = 6.3;
const VELOCITY_DAMPING = 6.3;
const IDLE_VELOCITY_DAMPING = 0.3;
const SPAWN_SPACING = 0.2;
const MIN_SPAWN_INTERVAL = 1 / 60;
const MIN_SPAWN_DISTANCE = 0.005;
const MIN_VISIBLE_OPACITY = 0.002;

type Splat = Mesh<PlaneGeometry, MeshBasicMaterial>;

const RIPPLE_BRUSH =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAnFBMVEUAAAD////////////////////////////////////////////////////+/v7////9/f3////9/f39/f3////////////9/f3+/v79/f3////////+/v79/f3+/v7////////+/v7////+/v7////+/v7+/v7////////////+/v7////+/v7+/v7+/v7+/v7////////////////Clg1EAAAANHRSTlMACAwRBBUcICQZKDM4LEAwSjxGTml2XEOCUmRhh1eLcXpUbpl+Wo+1kqumsJafnKK+ucPKHu8hDAAADa9JREFUeNrslcl6olAUhJOWCCKDgDJeJkEEFBzy/u/Wda7na9PboK6sRRbJon7qVN18vPXWW2/9UspNH68Wm3/e9XoIcv9zFzG8EkJRyH42m31BM4gYXgjB9l+LxVxqISkY4gUM5I9vn6uqpum6rmmqCghmeAGC/HzYa7ppL0m2aeqaykGA4ZkI/PmzxVzT7aVhWUEQWJZjAAIMKjM8sZMc/0LVzaUTuJ4XRZHnrdzAMgwwAAIMHANTPMOfPt+wXC/1kySOE39XRh4zSAQeBpfysfbsv3Rcr/TjbU7arteJn0bIgW7BdfgxT+Wx54e/Cf9oF283RR1CdbEBRLJLcQvrXx1AwY14FMInn1/6l/46L0LRNG3bNFkYgmEdyxhwCbkLnucNQXnQ+rh+FvlvatFU4zgM41gdGxHWhJDsZBscAxTLWxZAeAiBwuvXTcNalcl6E2bH8dR3UH8axqrNgLBFCrvSW61cl/dpm5q6YIKp/jOuP/x96T/03WEPHQ5gGCmFAghIYZemZVqWkeyErTPBg+bH/jX5H/aXy/l8uYCh6zkE2sQ6juWPxC+9wFkSwWSA//3zWrRj35E/BAQQUAYZLeKmoqBtxH7kWiD4mkiAAPD8qtI/8mP0vzkOHQI4XyEQUAQDIhAYZU3bFBkk0IokXTm2PieCCQB8AOq/R/sPRVv1EuB88+cbNEQghGjaIwYyHltR53HpGrY27QgKv/94/j0MIC9oAQTwswOD9CdlbTXQPuh3WZ0nUWDQEfAeTQ3AsPgBDMlDEtxXQAcQMvxG9nNPXH2VFVt/5XAEEwOwjQANlAAwGQf6SJh3PduHNZpX42/Vqduf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";

const vertexShader = `
varying vec2 vUv;
varying vec2 vScreenUv;

void main() {
    vUv = uv;
    vec4 pos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vScreenUv = pos.xy / pos.w * 0.5 + 0.5;
    gl_Position = pos;
}`;

const fragmentShader = `
precision highp float;
uniform sampler2D uTexture;
uniform sampler2D uDisplacement;
uniform float uDisplacementIntensity;
varying vec2 vUv;
varying vec2 vScreenUv;

#define PI 3.14159265

void main() {
    vec4 displacement = texture2D(uDisplacement, vScreenUv);
    float theta = displacement.r * 2.0 * PI;
    vec2 direction = vec2(sin(theta), cos(theta));
    vec2 displacedUv = vUv + direction * displacement.r * uDisplacementIntensity;
    vec4 color = texture2D(uTexture, displacedUv);
    gl_FragColor = color;
}`;

type LiquidMediaMaterialProps = {
  map: Texture;
  pointer: PointerTarget;
} & Pick<
  LiquidEffectProps,
  "rippleMap" | "intensity" | "radius" | "expandRate" | "decayRate"
>;

type Uniforms = {
  uTexture: { value: Texture | null };
  uDisplacement: { value: Texture | null };
  uDisplacementIntensity: { value: number };
};

export type LiquidEffectProps = {
  rippleMap?: Texture;
  intensity?: number;
  radius?: number;
  expandRate?: number;
  decayRate?: number;
  segments?: number;
  webglEnabled?: boolean;
};

type LiquidMediaImageProps = LiquidEffectProps & {
  type?: "image";
  src: string;
  alt: string;
} & Omit<React.ComponentPropsWithoutRef<"img">, "src" | "alt">;

type LiquidMediaVideoProps = LiquidEffectProps & {
  type: "video";
  src: string;
} & Omit<React.ComponentPropsWithoutRef<"video">, "src">;

export type LiquidMediaProps = LiquidMediaImageProps | LiquidMediaVideoProps;

function LiquidMediaMaterial({
  map,
  pointer,
  rippleMap,
  intensity = 0.2,
  radius = 12,
  expandRate = 11,
  decayRate = 3,
}: LiquidMediaMaterialProps) {
  const { viewport, size, gl } = useThree();

  const defaultBrush = useTexture(RIPPLE_BRUSH);
  const brush = rippleMap ?? defaultBrush;
  const anchorRef = useRef<Group>(null);
  const splatIndex = useRef(0);
  const spriteRefs = useRef<Splat[]>([]);
  const spriteScene = useMemo(() => new Scene(), []);
  const spriteCamera = useMemo(() => {
    const cam = new OrthographicCamera(
      -viewport.width / 2,
      viewport.width / 2,
      viewport.height / 2,
      -viewport.height / 2,
      0,
      1,
    );
    cam.updateProjectionMatrix();
    return cam;
  }, [viewport.width, viewport.height]);

  const materialRef = useRef<ShaderMaterial>(null);
  const mouse = useRef({
    x: 0,
    y: 0,
    velocity: 0,
    spawnX: Infinity,
    spawnY: Infinity,
    spawnElapsed: Infinity,
  });

  const uniforms = useMemo<Uniforms>(
    () => ({
      uTexture: { value: map },
      uDisplacement: { value: null },
      uDisplacementIntensity: { value: 0 },
    }),
    [map],
  );

  const safeWidth = Math.max(1, size.width);
  const safeHeight = Math.max(1, size.height);

  const FBO = useFBO(safeWidth, safeHeight, {
    minFilter: LinearFilter,
    magFilter: LinearFilter,
  });

  useFrame((_, delta) => {
    const parent = anchorRef.current?.parent as Mesh | null;
    const mat = materialRef.current;
    if (!parent || !mat || delta <= 0) return;

    const sprites = spriteRefs.current;
    const _mouse = mouse.current;
    const p = getPointerTarget(pointer);
    const hovering = p.hover > 0.5;

    const pointerX = parent.position.x + (p.uv.x - 0.5) * parent.scale.x;
    const pointerY = parent.position.y + (p.uv.y - 0.5) * parent.scale.y;

    if (_mouse.spawnX === Infinity && hovering) {
      _mouse.x = pointerX;
      _mouse.y = pointerY;
      _mouse.spawnX = pointerX;
      _mouse.spawnY = pointerY;
    }

    const dx = pointerX - _mouse.x;
    const dy = pointerY - _mouse.y;

    const speed = Math.sqrt(dx * dx + dy * dy) / (delta * 60);

    _mouse.x = pointerX;
    _mouse.y = pointerY;

    if (hovering) {
      _mouse.velocity = MathUtils.damp(
        _mouse.velocity,
        speed,
        VELOCITY_DAMPING,
        delta,
      );
    } else {
      _mouse.velocity = MathUtils.damp(
        _mouse.velocity,
        0,
        IDLE_VELOCITY_DAMPING,
        delta,
      );
    }

    const scale = (radius * Math.min(viewport.width, viewport.height)) / 100;
    const spacing = Math.max(scale * SPAWN_SPACING, MIN_SPAWN_DISTANCE);
    const spawnDx = pointerX - _mouse.spawnX;
    const spawnDy = pointerY - _mouse.spawnY;
    const spawnDist = Math.sqrt(spawnDx * spawnDx + spawnDy * spawnDy);

    _mouse.spawnElapsed += delta;

    if (
      hovering &&
      spawnDist > spacing &&
      _mouse.spawnElapsed > MIN_SPAWN_INTERVAL
    ) {
      const sprite = sprites[splatIndex.current];

      if (sprite) {
        sprite.visible = true;
        sprite.position.set(pointerX, pointerY, 0);
        sprite.scale.set(scale, scale, 1);
        sprite.material.opacity = INITIAL_OPACITY;
      }

      splatIndex.current = (splatIndex.current + 1) % 100;
      _mouse.spawnX = pointerX;
      _mouse.spawnY = pointerY;
      _mouse.spawnElapsed = 0;
    }

    for (const sprite of sprites) {
      if (sprite.visible) {
        sprite.rotation.z += 2 * delta * ROTATION_SPEED;
        sprite.material.opacity = MathUtils.damp(
          sprite.material.opacity,
          0,
          MathUtils.clamp(decayRate, 3, 10),
          delta,
        );
        sprite.scale.x += delta * expandRate * scale;
        sprite.scale.y = sprite.scale.x;
        if (sprite.material.opacity < MIN_VISIBLE_OPACITY)
          sprite.visible = false;
      }
    }

    gl.setRenderTarget(FBO);
    gl.render(spriteScene, spriteCamera);
    gl.setRenderTarget(null);

    mat.uniforms.uDisplacement.value = FBO.texture;
    mat.uniforms.uDisplacementIntensity.value = MathUtils.damp(
      mat.uniforms.uDisplacementIntensity.value,
      intensity * _mouse.velocity * 5,
      DISPLACEMENT_DAMPING,
      delta,
    );
  });

  const portal = useMemo(
    () =>
      createPortal(
        <group>
          {Array.from({ length: 100 }, (_, i) => (
            <mesh
              key={i}
              ref={(mesh) => {
                if (mesh) spriteRefs.current[i] = mesh as Splat;
              }}
              visible={false}
              rotation-z={(i * 0.628318) % (Math.PI * 2)}
            >
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial
                map={brush}
                transparent
                blending={AdditiveBlending}
                depthTest={false}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>,
        spriteScene,
      ),
    [brush, spriteScene],
  );

  return (
    <>
      <group ref={anchorRef} />

      <shaderMaterial
        ref={materialRef}
        attach="material"
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />

      {portal}
    </>
  );
}

function LiquidMediaInner(props: LiquidMediaProps) {
  const {
    rippleMap,
    intensity,
    radius,
    expandRate,
    decayRate,
    segments,
    webglEnabled,
    ...rest
  } = props;

  const material = (map: Texture, pointer: PointerTarget) => (
    <LiquidMediaMaterial
      map={map}
      pointer={pointer}
      rippleMap={rippleMap}
      intensity={intensity}
      radius={radius}
      expandRate={expandRate}
      decayRate={decayRate}
    />
  );

  if (rest.type === "video") {
    const { type: _type, ...videoProps } = rest;
    return (
      <WebglVideo
        segments={segments}
        webglEnabled={webglEnabled}
        material={material}
        {...videoProps}
      />
    );
  }

  const { type: _type, ...imageProps } = rest;
  return (
    <WebglImage
      segments={segments}
      webglEnabled={webglEnabled}
      material={material}
      {...imageProps}
    />
  );
}

export function LiquidMedia(
  props: LiquidMediaProps & { containerClassName?: string },
) {
  const hasProvider = React.useContext(WebglContext);
  const { containerClassName, ...mediaProps } = props;

  if (!hasProvider) {
    return (
      <WebglProvider
        contained
        className={cn("relative w-full h-full", containerClassName)}
      >
        <LiquidMediaInner {...mediaProps} />
      </WebglProvider>
    );
  }

  return <LiquidMediaInner {...mediaProps} />;
}

export type LiquidMediaShowcaseProps = {
  src?: string;
  alt?: string;
  caption?: string;
  className?: string;
  intensity?: number;
  radius?: number;
  expandRate?: number;
  decayRate?: number;
  segments?: number;
  webglEnabled?: boolean;
};

export function LiquidMediaShowcase({
  src = "/liquid-media-demo.jpg",
  alt = "Editorial portrait",
  caption = "Hover anywhere!",
  className,
  intensity,
  radius,
  expandRate,
  decayRate,
  segments,
  webglEnabled = true,
}: LiquidMediaShowcaseProps) {
  return (
    <div
      className={cn(
        "group relative w-full max-w-4xl overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-950 shadow-2xl dark:border-white/10 select-none",
        className,
      )}
    >
      <LiquidMedia
        src={src}
        alt={alt}
        intensity={intensity}
        radius={radius}
        expandRate={expandRate}
        decayRate={decayRate}
        segments={segments}
        webglEnabled={webglEnabled}
        className="w-full h-auto aspect-16/10 object-cover"
      />
      {caption ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
          <span className="font-serif text-lg sm:text-2xl md:text-3xl font-normal tracking-wide text-white/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            {caption}
          </span>
        </div>
      ) : null}
    </div>
  );
}

export type LiquidMediaPresetId =
  | "silk"
  | "glass"
  | "ripple"
  | "tidal"
  | "custom";

export type LiquidMediaImageId = "portrait" | "architecture" | "ocean";

export interface LiquidMediaPreset {
  id: LiquidMediaPresetId;
  label: string;
  intensity: number;
  radius: number;
  expandRate: number;
  decayRate: number;
}

export const LIQUID_MEDIA_PRESETS: readonly LiquidMediaPreset[] = [
  {
    id: "silk",
    label: "Silk Flow",
    intensity: 0.12,
    radius: 9,
    expandRate: 7,
    decayRate: 2.2,
  },
  {
    id: "glass",
    label: "Liquid Glass",
    intensity: 0.22,
    radius: 12,
    expandRate: 11,
    decayRate: 3.0,
  },
  {
    id: "ripple",
    label: "Deep Ripple",
    intensity: 0.42,
    radius: 18,
    expandRate: 16,
    decayRate: 2.6,
  },
  {
    id: "tidal",
    label: "Tidal Surge",
    intensity: 0.68,
    radius: 24,
    expandRate: 22,
    decayRate: 3.4,
  },
] as const;

export const LIQUID_MEDIA_IMAGES: Record<
  LiquidMediaImageId,
  { label: string; src: string; caption: string }
> = {
  portrait: {
    label: "Portrait",
    src: "/liquid-media-demo.jpg",
    caption: "Hover anywhere!",
  },
  architecture: {
    label: "Architecture",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80",
    caption: "Modernist Villa",
  },
  ocean: {
    label: "Ocean",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80",
    caption: "Calm Horizon",
  },
};

export default LiquidMedia;
