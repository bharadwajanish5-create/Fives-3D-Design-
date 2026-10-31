import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, MeshDistortMaterial, Sparkles, Float, Line, Html } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { elements } from '../data/site';

type Props = { active: number; onSelect: (i: number) => void; running: boolean };

function Earth() {
  return (
    <group>
      <mesh><dodecahedronGeometry args={[0.62, 0]} /><meshStandardMaterial color="#C9A26B" roughness={0.85} flatShading /></mesh>
      {[[0.55, 0.35, 0.2], [-0.5, -0.3, 0.3], [0.1, -0.6, -0.3]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}><icosahedronGeometry args={[0.16, 0]} /><meshStandardMaterial color="#8E6B3E" roughness={0.9} flatShading /></mesh>
      ))}
    </group>
  );
}
function Water() {
  return <mesh><sphereGeometry args={[0.62, 64, 64]} /><MeshDistortMaterial color="#4FB3FF" distort={0.38} speed={2.4} roughness={0.05} metalness={0.15} /></mesh>;
}
function Air() {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (g.current) { g.current.children.forEach((c, i) => { c.rotation.x += dt * (0.4 + i * 0.3); c.rotation.y += dt * (0.6 - i * 0.15); }); } });
  return (
    <group ref={g}>
      {[0.62, 0.48, 0.34].map((r) => <mesh key={r}><torusGeometry args={[r, 0.03, 16, 96]} /><meshPhysicalMaterial color="#7CC6FF" roughness={0.1} metalness={0.3} clearcoat={1} /></mesh>)}
    </group>
  );
}
function Fire() {
  const m = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => { if (m.current) { const t = clock.getElapsedTime(); m.current.scale.set(1 + Math.sin(t * 6) * 0.04, 1.15 + Math.sin(t * 4.3) * 0.07, 1); } });
  return (
    <group>
      <mesh ref={m}><icosahedronGeometry args={[0.55, 1]} /><meshStandardMaterial color="#FF7A45" emissive="#FF4D1A" emissiveIntensity={1.4} roughness={0.4} flatShading /></mesh>
      <Sparkles count={30} scale={[1.4, 1.8, 1.4]} size={3} speed={0.8} color="#FFB36B" />
    </group>
  );
}
function Space() {
  const pts = useMemo(() => {
    const a = new Float32Array(240 * 3);
    for (let i = 0; i < 240; i++) { const v = new THREE.Vector3().randomDirection().multiplyScalar(0.7 + Math.random() * 0.35); a.set([v.x, v.y, v.z], i * 3); }
    return a;
  }, []);
  return (
    <group>
      <mesh><icosahedronGeometry args={[0.62, 1]} /><meshBasicMaterial color="#0F1B2D" wireframe transparent opacity={0.6} /></mesh>
      <mesh><sphereGeometry args={[0.2, 32, 32]} /><meshStandardMaterial color="#FACC2C" emissive="#FACC2C" emissiveIntensity={1.2} /></mesh>
      <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[pts, 3]} /></bufferGeometry><pointsMaterial size={0.03} color="#B88400" /></points>
    </group>
  );
}
const Shapes = [Earth, Water, Air, Fire, Space];

const N = elements.length;
const RING = 2.05;
const ang = (i: number) => (i * 2 * Math.PI) / N;

function Item({ i, active, onSelect }: { i: number; active: number; onSelect: (i: number) => void }) {
  const g = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const isA = active === i;
  const el = elements[i];
  const Shape = Shapes[i];
  useFrame((_, dt) => {
    if (!g.current) return;
    g.current.scale.setScalar(THREE.MathUtils.damp(g.current.scale.x, isA ? 1.22 : hover ? 0.95 : 0.74, 6, dt));
    g.current.rotation.y += dt * (isA ? 0.9 : 0.35);
  });
  return (
    <group position={[Math.sin(ang(i)) * RING, 0, Math.cos(ang(i)) * RING]}>
      <Float speed={1.5} floatIntensity={0.35} rotationIntensity={0.1}>
        <group ref={g}
          onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setHover(false); document.body.style.cursor = ''; }}
          onClick={(e) => { e.stopPropagation(); onSelect(i); }}>
          <Shape />
          <mesh visible={false}><sphereGeometry args={[0.9, 8, 8]} /></mesh>
        </group>
      </Float>
      {/* soft coloured pool of light under each element */}
      <mesh position={[0, -0.95, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[isA ? 0.8 : 0.5, 40]} /><meshBasicMaterial color={el.color} transparent opacity={isA ? 0.28 : 0.12} depthWrite={false} /></mesh>
      <Html position={[0, -1.25, 0]} center zIndexRange={[10, 0]}>
        <button onClick={() => onSelect(i)} className="whitespace-nowrap rounded-full border px-3.5 py-1 text-[12.5px] font-extrabold tracking-wide transition"
          style={{ background: isA ? el.color : 'rgba(15,27,45,.55)', color: isA ? '#0F1B2D' : '#E6ECF4', borderColor: isA ? el.color : 'rgba(255,255,255,.22)', backdropFilter: 'blur(6px)' }}>{el.name}</button>
      </Html>
    </group>
  );
}

function Ring({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const g = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const phi = useRef(-ang(active));
  const { viewport } = useThree();
  const pent = useMemo(() => Array.from({ length: N + 1 }, (_, i) => { const j = (i * 2) % N; return new THREE.Vector3(Math.sin(ang(j)) * RING, -0.2, Math.cos(ang(j)) * RING); }), []);
  const circle = useMemo(() => Array.from({ length: 97 }, (_, i) => new THREE.Vector3(Math.sin((i / 96) * Math.PI * 2) * RING, -0.2, Math.cos((i / 96) * Math.PI * 2) * RING)), []);
  useFrame(({ clock }, dt) => {
    const target = -ang(active);
    let d = target - phi.current;
    d = ((((d + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
    phi.current += d * Math.min(1, dt * 3);
    if (g.current) g.current.rotation.y = phi.current;
    if (core.current) { core.current.rotation.y = clock.getElapsedTime() * 0.6; core.current.scale.setScalar(0.34 + Math.sin(clock.getElapsedTime() * 2) * 0.02); }
  });
  const s = Math.min(1, viewport.width / 6.8);
  return (
    <group scale={s}>
      <group ref={g}>
        <Line points={circle} color="#FACC2C" lineWidth={1} transparent opacity={0.35} />
        <Line points={pent} color="#FACC2C" lineWidth={1} transparent opacity={0.22} />
        {elements.map((_, i) => <Item key={i} i={i} active={active} onSelect={onSelect} />)}
      </group>
      {/* the FiveS core every element connects to */}
      <mesh ref={core} position={[0, -0.2, 0]}><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color="#FACC2C" emissive="#FACC2C" emissiveIntensity={1.1} roughness={0.3} flatShading /></mesh>
      <mesh position={[0, -0.2, 0]}><sphereGeometry args={[0.62, 32, 32]} /><meshBasicMaterial color="#FACC2C" transparent opacity={0.1} depthWrite={false} /></mesh>
      <Sparkles count={60} scale={[5.5, 3, 5.5]} size={2.2} speed={0.4} color="#FFE08A" opacity={0.7} />
    </group>
  );
}

export default function ElementsScene({ active, onSelect, running }: Props) {
  return (
    <Canvas camera={{ position: [0, 3.3, 8], fov: 34 }} onCreated={({ camera }) => camera.lookAt(0, -0.25, 0)} dpr={[1, 1.75]} gl={{ alpha: true, antialias: true }} frameloop={running ? 'always' : 'never'} aria-label="The five elements, Earth, Water, Air, Fire and Space, arranged around the FiveS core">
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 4]} intensity={1.7} />
      <pointLight position={[0, 0.5, 0]} intensity={14} color="#FACC2C" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#7CC6FF" position={[-5, 0, 2]} scale={[2, 6, 1]} />
      </Environment>
      <Ring active={active} onSelect={onSelect} />
    </Canvas>
  );
}
