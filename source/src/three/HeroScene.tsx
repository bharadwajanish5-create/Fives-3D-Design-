import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox, Html, Float } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Metric } from '../data/site';

type Props = { metrics: Metric[]; active: number | null; onSelect: (i: number | null) => void; running: boolean };

const R = 3.0;

function Core() {
  const bars = useRef<THREE.InstancedMesh>(null);
  const core = useRef<THREE.Mesh>(null);
  const COUNT = 64;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (core.current) core.current.rotation.y = t * 0.15;
    if (!bars.current) return;
    for (let i = 0; i < COUNT; i++) {
      const a = (i / COUNT) * Math.PI * 2;
      const h = 0.18 + Math.abs(Math.sin(t * 2.2 + i * 0.55) * Math.cos(t * 0.9 + i * 0.21)) * 0.75;
      dummy.position.set(Math.cos(a) * 1.72, 0, Math.sin(a) * 1.72);
      dummy.rotation.set(0, -a, 0);
      dummy.scale.set(1, h, 1);
      dummy.updateMatrix();
      bars.current.setMatrixAt(i, dummy.matrix);
    }
    bars.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <group>
      <mesh ref={core}>
        <sphereGeometry args={[1.28, 96, 96]} />
        <meshPhysicalMaterial color="#FACC2C" metalness={0.25} roughness={0.22} clearcoat={1} clearcoatRoughness={0.15} sheen={0.6} sheenColor="#FFE68A" />
      </mesh>
      {/* thin inner glow shell */}
      <mesh scale={1.06}>
        <sphereGeometry args={[1.28, 48, 48]} />
        <meshBasicMaterial color="#FACC2C" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
      <group rotation={[0.32, 0, 0]}>
        <instancedMesh ref={bars} args={[undefined, undefined, COUNT]}>
          <boxGeometry args={[0.045, 0.9, 0.045]} />
          <meshStandardMaterial color="#EAF1FF" emissive="#7CC6FF" emissiveIntensity={0.35} metalness={0.4} roughness={0.3} />
        </instancedMesh>
      </group>
    </group>
  );
}

function Shape({ m }: { m: Metric }) {
  const mat = <meshPhysicalMaterial color={m.color} metalness={0.3} roughness={0.25} clearcoat={1} clearcoatRoughness={0.2} />;
  switch (m.shape) {
    case 'wave':
      return (
        <group>
          <mesh rotation={[Math.PI / 2.4, 0, 0]}><torusGeometry args={[0.34, 0.12, 32, 64]} />{mat}</mesh>
          <mesh><sphereGeometry args={[0.13, 24, 24]} /><meshStandardMaterial color="#0C1526" metalness={0.6} roughness={0.3} /></mesh>
        </group>
      );
    case 'bubble':
      return (
        <group>
          <RoundedBox args={[0.86, 0.6, 0.26]} radius={0.12} smoothness={6}>{mat}</RoundedBox>
          <mesh position={[-0.22, -0.38, 0]} rotation={[0, 0, 0.5]}><coneGeometry args={[0.12, 0.24, 24]} />{mat}</mesh>
          {[-0.2, 0, 0.2].map((x) => (
            <mesh key={x} position={[x, 0, 0.14]}><sphereGeometry args={[0.055, 16, 16]} /><meshStandardMaterial color="#0C1526" /></mesh>
          ))}
        </group>
      );
    case 'gem':
      return <mesh><octahedronGeometry args={[0.5, 0]} /><meshPhysicalMaterial color={m.color} metalness={0.1} roughness={0.05} clearcoat={1} flatShading transmission={0.35} thickness={0.6} ior={1.6} /></mesh>;
    case 'coin':
      return (
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh><cylinderGeometry args={[0.46, 0.46, 0.13, 64]} /><meshPhysicalMaterial color={m.color} metalness={0.9} roughness={0.22} clearcoat={0.6} /></mesh>
          <mesh position={[0, 0.07, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.33, 0.025, 12, 64]} /><meshStandardMaterial color="#B98A1C" metalness={1} roughness={0.3} /></mesh>
        </group>
      );
    case 'parcel':
      return (
        <group>
          <RoundedBox args={[0.66, 0.66, 0.66]} radius={0.06} smoothness={4}><meshPhysicalMaterial color={m.color} roughness={0.55} clearcoat={0.3} /></RoundedBox>
          <mesh><boxGeometry args={[0.68, 0.14, 0.68]} /><meshStandardMaterial color="#F3E3C8" roughness={0.7} /></mesh>
        </group>
      );
    case 'loop':
    default:
      return <mesh><torusKnotGeometry args={[0.28, 0.09, 128, 20]} />{mat}</mesh>;
  }
}

function Orbiter({ m, i, n, active, hovered, setHovered, onSelect }: { m: Metric; i: number; n: number; active: number | null; hovered: number | null; setHovered: (i: number | null) => void; onSelect: (i: number | null) => void }) {
  const ref = useRef<THREE.Group>(null);
  const a = (i / n) * Math.PI * 2;
  const isActive = active === i;
  const dim = active !== null && !isActive;
  useFrame(({ clock }, dt) => {
    const g = ref.current;
    if (!g) return;
    const target = isActive ? 1.45 : hovered === i ? 1.18 : dim ? 0.82 : 1;
    const s = THREE.MathUtils.damp(g.scale.x, target, 6, dt);
    g.scale.setScalar(s);
    g.rotation.y += dt * (isActive ? 1.1 : 0.45);
    g.rotation.x = Math.sin(clock.getElapsedTime() * 0.6 + i) * 0.25;
  });
  return (
    <group position={[Math.cos(a) * R, 0, Math.sin(a) * R]}>
      <Float speed={1.6} rotationIntensity={0} floatIntensity={0.5}>
        <group
          ref={ref}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(i); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setHovered(null); document.body.style.cursor = ''; }}
          onClick={(e) => { e.stopPropagation(); onSelect(isActive ? null : i); }}
        >
          <Shape m={m} />
          {/* generous invisible hit area */}
          <mesh visible={false}><sphereGeometry args={[0.7, 8, 8]} /></mesh>
        </group>
        <Html center position={[0, -0.78, 0]} style={{ pointerEvents: 'none' }} zIndexRange={[20, 0]}>
          <div style={{ opacity: dim ? 0.35 : 1, transition: 'opacity .3s' }} className="whitespace-nowrap rounded-full border border-fg/15 bg-surface/70 px-2.5 py-1 font-mono text-[11px] text-fg backdrop-blur">
            <b style={{ color: m.color }}>{m.value}{m.suffix}</b> <span className="text-muted">{m.label.split(' ')[0]}</span>
          </div>
        </Html>
      </Float>
    </group>
  );
}

function Rig({ metrics, active, onSelect }: Omit<Props, 'running'>) {
  const ring = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const { viewport } = useThree();
  const k = Math.min(1.12, viewport.width / 7.4);
  useFrame((state, dt) => {
    const g = ring.current;
    if (!g) return;
    if (active === null) {
      if (hovered === null) g.rotation.y += dt * 0.12;
    } else {
      const a = (active / metrics.length) * Math.PI * 2;
      let target = a - Math.PI / 2;
      // choose the equivalent angle closest to the current rotation
      target += Math.round((g.rotation.y - target) / (Math.PI * 2)) * Math.PI * 2;
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, target, 3.5, dt);
    }
    // pointer parallax
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, state.pointer.x * 0.6, 2, dt);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, 0.9 + state.pointer.y * 0.4, 2, dt);
    state.camera.lookAt(0, 0, 0);
  });
  return (
    <group scale={k}>
      <Core />
      <group rotation={[0.28, 0, 0.06]}>
        <group ref={ring}>
          {metrics.map((m, i) => (
            <Orbiter key={m.id} m={m} i={i} n={metrics.length} active={active} hovered={hovered} setHovered={setHovered} onSelect={onSelect} />
          ))}
        </group>
        {/* orbit track */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[R - 0.005, R + 0.005, 160]} />
          <meshBasicMaterial color="#C9D3E3" transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

export default function HeroScene({ metrics, active, onSelect, running }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0.9, 8.2], fov: 38 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      frameloop={running ? 'always' : 'never'}
      onPointerMissed={() => onSelect(null)}
      aria-label="Interactive 3D model of FiveS operations metrics"
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <pointLight position={[-5, -2, 3]} intensity={30} color="#7CC6FF" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#7CC6FF" position={[-5, 0, 2]} scale={[2, 6, 1]} />
        <Lightformer form="ring" intensity={2} color="#FACC2C" position={[5, 1, -2]} scale={3} />
        <Lightformer form="rect" intensity={0.8} position={[0, -4, 2]} scale={[8, 1, 1]} />
      </Environment>
      <Rig metrics={metrics} active={active} onSelect={onSelect} />
    </Canvas>
  );
}
