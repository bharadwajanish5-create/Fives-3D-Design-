import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line, Sparkles } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import dots from '../data/mapDots.json';
import { locations } from '../data/site';

const R = 1.5;
const ll = (lon: number, lat: number, r = R) => {
  const a = (lon * Math.PI) / 180, b = (lat * Math.PI) / 180;
  return new THREE.Vector3(Math.cos(b) * Math.sin(a) * r, Math.sin(b) * r, Math.cos(b) * Math.cos(a) * r);
};
const flat = (pts: number[][], r: number) => {
  const a = new Float32Array(pts.length * 3);
  pts.forEach(([lo, la], i) => { const v = ll(lo, la, r); a.set([v.x, v.y, v.z], i * 3); });
  return a;
};
const HUB = locations.find((l) => l.flagship)!;
const DESKS = locations.filter((l) => l.region === 'intl');

/** Lifted great-circle arc between two surface points. */
function arc(a: THREE.Vector3, b: THREE.Vector3, n = 56) {
  const pts: THREE.Vector3[] = [];
  const ang = a.angleTo(b);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const v = a.clone().normalize().lerp(b.clone().normalize(), t).normalize();
    pts.push(v.multiplyScalar(R + Math.sin(Math.PI * t) * ang * 0.32));
  }
  return pts;
}

function Pulse({ pts, delay }: { pts: THREE.Vector3[]; delay: number }) {
  const m = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!m.current) return;
    const t = ((clock.getElapsedTime() * 0.32 + delay) % 1);
    const f = t * (pts.length - 1), i = Math.floor(f);
    m.current.position.lerpVectors(pts[i], pts[Math.min(i + 1, pts.length - 1)], f - i);
    m.current.scale.setScalar(0.6 + Math.sin(t * Math.PI) * 0.8);
  });
  return <mesh ref={m}><sphereGeometry args={[0.035, 12, 12]} /><meshBasicMaterial color="#FFE08A" toneMapped={false} /></mesh>;
}

function Beacon({ v, color, size }: { v: THREE.Vector3; color: string; size: number }) {
  const ring = useRef<THREE.Mesh>(null);
  const q = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), v.clone().normalize()), [v]);
  useFrame(({ clock }) => {
    if (!ring.current) return;
    const t = (clock.getElapsedTime() * 0.7) % 1;
    ring.current.scale.setScalar(1 + t * 3.2);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.7;
  });
  return (
    <group position={v.clone().multiplyScalar(1.004)} quaternion={q}>
      <mesh><sphereGeometry args={[size, 20, 20]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
      <mesh ref={ring}><ringGeometry args={[size * 1.5, size * 1.9, 40]} /><meshBasicMaterial color={color} transparent depthWrite={false} side={THREE.DoubleSide} /></mesh>
    </group>
  );
}

function Globe() {
  const g = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const sc = Math.min(1, viewport.width / 4.3);
  const world = useMemo(() => flat(dots.world as number[][], R * 1.004), []);
  const india = useMemo(() => flat(dots.india as number[][], R * 1.012), []);
  const hub = useMemo(() => ll(HUB.lon, HUB.lat), []);
  const arcs = useMemo(() => DESKS.map((d) => arc(ll(d.lon, d.lat), hub)), [hub]);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.y = -(HUB.lon * Math.PI) / 180 + 0.25 + clock.getElapsedTime() * 0.16;
  });
  return (
    <group rotation={[0.38, 0, 0]} scale={sc}>
      <group ref={g}>
        <mesh><sphereGeometry args={[R * 0.995, 64, 64]} /><meshStandardMaterial color="#13233A" roughness={0.9} metalness={0.1} /></mesh>
        <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[world, 3]} /></bufferGeometry><pointsMaterial size={0.026} color="#7E97BA" sizeAttenuation transparent opacity={0.95} /></points>
        <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[india, 3]} /></bufferGeometry><pointsMaterial size={0.02} color="#FACC2C" sizeAttenuation toneMapped={false} /></points>
        {arcs.map((p, i) => (
          <group key={i}>
            <Line points={p} color="#FACC2C" lineWidth={1.4} transparent opacity={0.55} />
            <Pulse pts={p} delay={i / arcs.length} />
            <Pulse pts={p} delay={i / arcs.length + 0.5} />
          </group>
        ))}
        {DESKS.map((d) => <Beacon key={d.name} v={ll(d.lon, d.lat)} color="#59B4FF" size={0.03} />)}
        <Beacon v={hub} color="#FACC2C" size={0.06} />
      </group>
    </group>
  );
}

export default function GlobeScene({ running }: { running: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 6.6], fov: 30 }} dpr={[1, 1.75]} gl={{ alpha: true, antialias: true }} frameloop={running ? 'always' : 'never'} aria-label="Globe showing FiveS delivery from India to partner desks worldwide">
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 3, 5]} intensity={1.4} />
      <mesh scale={1.16}><sphereGeometry args={[R, 48, 48]} /><meshBasicMaterial color="#2F8FDB" transparent opacity={0.08} side={THREE.BackSide} depthWrite={false} /></mesh>
      <Globe />
      <Sparkles count={40} scale={[5.5, 4.5, 3]} size={2} speed={0.3} color="#FACC2C" opacity={0.6} />
    </Canvas>
  );
}
