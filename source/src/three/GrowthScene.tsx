import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import { useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';

const FLOOR = 0.3, W = 1.35;
const sstep = (t: number) => t * t * (3 - 2 * t);
const FLOORS = [4, 8, 13];

/** One tower: floors stack up one after another as scroll progress goes 0 → 1. */
function Tower({ n, i, x, k, p }: { n: number; i: number; x: number; k: number; p: MutableRefObject<number> }) {
  const floors = useRef<(THREE.Group | null)[]>([]);
  const cap = useRef<THREE.Mesh>(null);
  const bands = useMemo(() => Array.from({ length: n }, (_, f) => ((f * 7 + i * 3) % 5 === 0 ? '#FFE9A0' : '#FACC2C')), [n, i]);
  useFrame(() => {
    const e = sstep(THREE.MathUtils.clamp((p.current * 1.5 - i * 0.32) / 0.7, 0, 1));
    const built = e * n;
    floors.current.forEach((g, f) => { if (!g) return; const s = THREE.MathUtils.clamp(built - f, 0, 1); g.scale.y = Math.max(0.0001, s); g.visible = s > 0.001; });
    if (cap.current) { cap.current.position.y = Math.min(built, n) * FLOOR + 0.03; cap.current.visible = e > 0.01; cap.current.scale.setScalar(Math.min(1, e * 3)); }
  });
  return (
    <group position={[x, 0, 0]} scale={k}>
      {Array.from({ length: n }, (_, f) => (
        <group key={f} position={[0, f * FLOOR, 0]} ref={(g) => { floors.current[f] = g; }}>
          <mesh position={[0, FLOOR / 2 - 0.01, 0]}><boxGeometry args={[W, FLOOR - 0.02, W]} /><meshPhysicalMaterial color="#25416A" metalness={0.15} roughness={0.3} clearcoat={0.6} /></mesh>
          <mesh position={[0, FLOOR / 2 - 0.01, 0]}><boxGeometry args={[W + 0.012, 0.1, W + 0.012]} /><meshStandardMaterial color={bands[f]} emissive={bands[f]} emissiveIntensity={0.55} /></mesh>
        </group>
      ))}
      <mesh ref={cap}><boxGeometry args={[W + 0.14, 0.07, W + 0.14]} /><meshPhysicalMaterial color="#FACC2C" metalness={0.2} roughness={0.15} clearcoat={1} emissive="#FFB300" emissiveIntensity={0.25} /></mesh>
    </group>
  );
}

function Scene({ p }: { p: MutableRefObject<number> }) {
  const { viewport } = useThree();
  const gap = viewport.width / 3, k = Math.min(1, gap / 2.3);
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (g.current) g.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.1; });
  return (
    <group ref={g}>
      <mesh position={[0, -0.06, 0]}><boxGeometry args={[viewport.width * 1.05, 0.1, 4.2]} /><meshStandardMaterial color="#EEF2F7" roughness={0.9} /></mesh>
      <gridHelper args={[16, 32, '#CBD5E1', '#DDE4EE']} scale={[1, 1, 0.26]} position={[0, 0.001, 0]} />
      {FLOORS.map((n, i) => <Tower key={i} n={n} i={i} x={(i - 1) * gap} k={k} p={p} />)}
      <ContactShadows position={[0, 0.005, 0]} opacity={0.3} blur={2.2} far={5} scale={[viewport.width * 1.1, 5]} />
    </group>
  );
}

export default function GrowthScene({ p, running }: { p: MutableRefObject<number>; running: boolean }) {
  return (
    <Canvas camera={{ position: [0, 4.6, 12.5], fov: 24 }} onCreated={({ camera }) => camera.lookAt(0, 1.95, 0)} dpr={[1, 1.75]} gl={{ alpha: true, antialias: true }} frameloop={running ? 'always' : 'never'} aria-label="FiveS growing from a 12-member team in Udaipur in 2009 to more than 3,000 people today">
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 7, 5]} intensity={1.8} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[9, 2, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#FFE9B0" position={[-5, 1, 2]} scale={[2, 6, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#CFE6FF" position={[5, 1, 2]} scale={[2, 6, 1]} />
      </Environment>
      <Scene p={p} />
    </Canvas>
  );
}
