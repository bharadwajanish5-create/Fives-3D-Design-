import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import { useMemo, useRef, type ReactNode } from 'react';
import * as THREE from 'three';
import { elements } from '../data/site';

type Props = { active: number; running: boolean };

/** Scales an element in and out as the selection changes. */
function Present({ show, children }: { show: boolean; children: ReactNode }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!g.current) return;
    const s = THREE.MathUtils.damp(g.current.scale.x, show ? 1 : 0, 5, dt);
    g.current.scale.setScalar(s); g.current.visible = s > 0.02;
  });
  return <group ref={g} scale={0}>{children}</group>;
}
const spin = (r: React.RefObject<THREE.Object3D>, dt: number, v: number) => { if (r.current) r.current.rotation.y += dt * v; };

/** Earth: a low-poly planet with seas, grassland, rock and snow. */
function Earth() {
  const g = useRef<THREE.Group>(null);
  const geo = useMemo(() => {
    const m = new THREE.IcosahedronGeometry(1.3, 4);
    const pos = m.attributes.position, col = new Float32Array(pos.count * 3);
    const v = new THREE.Vector3(), c = new THREE.Color();
    const h = (x: number, y: number, z: number) => Math.sin(x * 2.1 + 1.3) * Math.cos(y * 2.3) + Math.sin(z * 2.7 + y * 1.1) * 0.7 + Math.sin((x + y + z) * 4.2) * 0.25;
    const H = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i).normalize(); H[i] = h(v.x, v.y, v.z); pos.setXYZ(i, v.x * 1.3 * (1 + Math.max(H[i], 0.05) * 0.1), v.y * 1.3 * (1 + Math.max(H[i], 0.05) * 0.1), v.z * 1.3 * (1 + Math.max(H[i], 0.05) * 0.1)); }
    for (let i = 0; i < pos.count; i += 3) {
      const a = (H[i] + H[i + 1] + H[i + 2]) / 3;
      c.set(a < 0.05 ? '#2F7FD0' : a < 0.55 ? '#5FA85A' : a < 1.05 ? '#B08A5A' : '#F2F5F8');
      if (a < 0.05) c.offsetHSL(0, 0, (a + 0.6) * 0.04);
      for (let k = 0; k < 3; k++) col.set([c.r, c.g, c.b], (i + k) * 3);
    }
    m.setAttribute('color', new THREE.BufferAttribute(col, 3)); m.computeVertexNormals();
    return m;
  }, []);
  useFrame((_, dt) => spin(g, dt, 0.35));
  return <group ref={g} rotation={[0.35, 0, 0.3]}><mesh geometry={geo}><meshStandardMaterial vertexColors flatShading roughness={0.85} /></mesh></group>;
}

/** Water: a living, rippling sphere with droplets in orbit. */
function Water() {
  const d = useRef<THREE.Group>(null);
  useFrame((_, dt) => spin(d, dt, 0.9));
  return (
    <group>
      <mesh><sphereGeometry args={[1.2, 96, 96]} /><MeshDistortMaterial color="#2F9BFF" distort={0.34} speed={2.2} roughness={0.04} metalness={0.1} /></mesh>
      <mesh><sphereGeometry args={[1.34, 48, 48]} /><meshPhysicalMaterial color="#9FD8FF" transparent opacity={0.14} roughness={0} depthWrite={false} /></mesh>
      <group ref={d}>{[0, 1, 2, 3, 4].map((i) => { const a = (i / 5) * Math.PI * 2; return <mesh key={i} position={[Math.cos(a) * 1.85, Math.sin(a * 2) * 0.5, Math.sin(a) * 1.85]}><sphereGeometry args={[0.1 + (i % 3) * 0.04, 24, 24]} /><meshPhysicalMaterial color="#7CC6FF" roughness={0.05} clearcoat={1} /></mesh>; })}</group>
    </group>
  );
}

/** Air: a tornado of light ribbons. */
function Air() {
  const g = useRef<THREE.Group>(null);
  const tubes = useMemo(() => [0, 1, 2, 3, 4].map((i) => {
    const pts: THREE.Vector3[] = [];
    for (let k = 0; k <= 90; k++) { const t = k / 90, a = t * Math.PI * 4.2 + i * 1.26, r = 0.3 + t * 1.0 + (i % 2) * 0.12; pts.push(new THREE.Vector3(Math.cos(a) * r, -1.25 + t * 2.5, Math.sin(a) * r)); }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, 0.028 + (i % 2) * 0.012, 8, false);
  }), []);
  useFrame((_, dt) => spin(g, dt, 1.5));
  return <group ref={g}>{tubes.map((t, i) => <mesh key={i} geometry={t}><meshStandardMaterial color={i % 2 ? '#BFE6FF' : '#FFFFFF'} emissive="#8FD0FF" emissiveIntensity={0.7} roughness={0.2} /></mesh>)}</group>;
}

/** Fire: a cluster of layered, flickering flame tongues. */
function Tongue({ x, sc, rot, ph }: { x: number; sc: number; rot: number; ph: number }) {
  const g = useRef<THREE.Group>(null);
  const geo = useMemo(() => {
    const m = new THREE.LatheGeometry(Array.from({ length: 48 }, (_, i) => { const t = i / 47; return new THREE.Vector2(Math.max(0, Math.sin(Math.PI * Math.pow(t, 0.72)) * 0.8 * (1 - t * 0.5)), -1.2 + t * 2.9); }), 36);
    const pos = m.attributes.position;
    for (let i = 0; i < pos.count; i++) { const t = (pos.getY(i) + 1.2) / 2.9; pos.setX(i, pos.getX(i) + Math.pow(t, 2.2) * 0.5 * Math.sign(rot || 1)); }
    return m;
  }, [rot]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + ph;
    if (g.current) { g.current.scale.set(sc * (1 + Math.sin(t * 6) * 0.05), sc * (1 + Math.sin(t * 4.3) * 0.09), sc * (1 + Math.sin(t * 6) * 0.05)); g.current.rotation.z = rot + Math.sin(t * 3) * 0.06; }
  });
  const layers: [string, number, number][] = [['#FF3D0D', 1, 0.5], ['#FF8A1F', 0.74, 0.7], ['#FFD25E', 0.5, 0.9], ['#FFF6D0', 0.28, 1]];
  return (
    <group ref={g} position={[x, -0.15 - (1 - sc) * 0.4, 0]}>
      {layers.map(([c, k, o], i) => <mesh key={i} geometry={geo} scale={[k, k * 0.96 + 0.04, k]} position={[0, i * 0.04, 0]}><meshBasicMaterial color={c} transparent opacity={o} depthWrite={false} toneMapped={false} /></mesh>)}
    </group>
  );
}
function Fire() {
  return (
    <group>
      <Tongue x={0} sc={1} rot={0.08} ph={0} />
      <Tongue x={-0.62} sc={0.58} rot={-0.35} ph={1.3} />
      <Tongue x={0.6} sc={0.5} rot={0.38} ph={2.1} />
      <pointLight position={[0, 0.3, 1.5]} intensity={26} color="#FF7A2E" />
    </group>
  );
}

/** Space: a spiral galaxy. */
function Space() {
  const g = useRef<THREE.Group>(null);
  const { pos, col } = useMemo(() => {
    const n = 3600, pos = new Float32Array(n * 3), col = new Float32Array(n * 3), c = new THREE.Color(), core = new THREE.Color('#FFE9A0'), mid = new THREE.Color('#FACC2C'), out = new THREE.Color('#6FB6FF');
    for (let i = 0; i < n; i++) {
      const r = Math.pow(Math.random(), 0.65) * 2.2, arm = (i % 3) * ((Math.PI * 2) / 3), a = arm + r * 1.9 + (Math.random() - 0.5) * (0.35 + r * 0.12);
      pos.set([Math.cos(a) * r, (Math.random() - 0.5) * 0.22 * (1.2 - r / 2.2), Math.sin(a) * r], i * 3);
      const k = r / 2.2; c.copy(k < 0.35 ? core.clone().lerp(mid, k / 0.35) : mid.clone().lerp(out, (k - 0.35) / 0.65)); col.set([c.r, c.g, c.b], i * 3);
    }
    return { pos, col };
  }, []);
  useFrame((_, dt) => spin(g, dt, 0.28));
  return (
    <group rotation={[0.95, 0, 0.25]}>
      <group ref={g}>
        <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} /><bufferAttribute attach="attributes-color" args={[col, 3]} /></bufferGeometry><pointsMaterial size={0.045} vertexColors sizeAttenuation transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} /></points>
        <mesh><sphereGeometry args={[0.3, 32, 32]} /><meshBasicMaterial color="#FFF3C4" toneMapped={false} /></mesh>
        <mesh><sphereGeometry args={[0.55, 32, 32]} /><meshBasicMaterial color="#FACC2C" transparent opacity={0.16} depthWrite={false} /></mesh>
      </group>
    </group>
  );
}

/** A thin orbit with a small moon circling the hero object. */
function Orbit({ color }: { color: string }) {
  const m = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => { if (m.current) { const a = clock.getElapsedTime() * 0.6; m.current.position.set(Math.cos(a) * 2.15, 0, Math.sin(a) * 2.15); } });
  return (
    <group rotation={[1.2, 0, 0.35]}>
      <mesh><torusGeometry args={[2.15, 0.006, 8, 160]} /><meshBasicMaterial color={color} transparent opacity={0.55} /></mesh>
      <mesh ref={m}><sphereGeometry args={[0.09, 20, 20]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
    </group>
  );
}

const FX: { count: number; size: number; speed: number; scale: [number, number, number]; color: string }[] = [
  { count: 40, size: 5, speed: 0.25, scale: [5, 3.5, 5], color: '#E8C998' },
  { count: 45, size: 7, speed: 0.6, scale: [4.2, 4.2, 4.2], color: '#9FD8FF' },
  { count: 80, size: 3, speed: 1.8, scale: [5, 4, 5], color: '#E6F6FF' },
  { count: 80, size: 5, speed: 1.3, scale: [2.6, 5, 2.6], color: '#FFB36B' },
  { count: 140, size: 2.5, speed: 0.15, scale: [7, 4, 5], color: '#FFFFFF' },
];
const Shapes = [Earth, Water, Air, Fire, Space];

function Stage({ active }: { active: number }) {
  const { viewport } = useThree();
  const s = Math.min(1, viewport.width / 5.1) * 0.86;
  const fx = FX[active];
  return (
    <group scale={s} position={[0, 0.3, 0]}>
      {Shapes.map((S, i) => <Present key={i} show={active === i}><S /></Present>)}
      <Orbit color={elements[active].color} />
      <Sparkles key={active} count={fx.count} size={fx.size} speed={fx.speed} scale={fx.scale} color={fx.color} opacity={0.85} />
    </group>
  );
}

export default function ElementsScene({ active, running }: Props) {
  return (
    <Canvas camera={{ position: [0, 0.5, 6.6], fov: 32 }} dpr={[1, 1.75]} gl={{ alpha: true, antialias: true }} frameloop={running ? 'always' : 'never'} aria-label={`${elements[active].name}, one of the five elements`}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 4]} intensity={1.8} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#7CC6FF" position={[-5, 0, 2]} scale={[2, 6, 1]} />
      </Environment>
      <Stage active={active} />
    </Canvas>
  );
}
