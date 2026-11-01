import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import { useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';

const sstep = (t: number) => t * t * (3 - 2 * t);

/** Technology (a wireframe network) + Human intelligence (a warm living orb) merge into one Purpose gem, driven by scroll progress. */
function Scene({ p }: { p: MutableRefObject<number> }) {
  const { viewport } = useThree();
  const tech = useRef<THREE.Group>(null), human = useRef<THREE.Group>(null), gem = useRef<THREE.Group>(null), orbit = useRef<THREE.Group>(null), ring = useRef<THREE.Mesh>(null);
  const s = useRef(0);
  const ico = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);
  const people = useMemo(() => [0, 1, 2, 3], []);
  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime();
    s.current = THREE.MathUtils.damp(s.current, p.current, 4, dt);
    const e = sstep(THREE.MathUtils.clamp((s.current - 0.08) / 0.8, 0, 1));
    const sc = Math.min(1, viewport.width / 8.2), off = viewport.width * 0.22 * (1 - e);
    if (tech.current) { tech.current.position.set(-off, Math.sin(t * 1.2) * 0.08, 0); tech.current.scale.setScalar(sc * (1 - e * 0.92)); tech.current.rotation.y = t * (0.35 + e * 3); tech.current.rotation.x = t * 0.18; tech.current.visible = e < 0.99; }
    if (human.current) { human.current.position.set(off, Math.sin(t * 1.1 + 1) * 0.08, 0); human.current.scale.setScalar(sc * (1 - e * 0.92) * (1 + Math.sin(t * 1.6) * 0.03)); human.current.visible = e < 0.99; }
    if (orbit.current) orbit.current.children.forEach((c, i) => { const a = t * (0.7 + i * 0.12) + i * 1.57; c.position.set(Math.cos(a) * 1.35, Math.sin(a * 1.3) * 0.25, Math.sin(a) * 1.35); });
    if (gem.current) {
      const pop = e < 1 ? e : 1 + Math.max(0, Math.sin(t * 1.4) * 0.025);
      gem.current.scale.setScalar(sc * 1.05 * pop * (e > 0.55 ? 1 : (e / 0.55) ** 2));
      gem.current.rotation.y = t * 0.5; gem.current.rotation.x = Math.sin(t * 0.6) * 0.18; gem.current.visible = e > 0.02;
    }
    const re = sstep(THREE.MathUtils.clamp((e - 0.7) / 0.3, 0, 1));
    if (ring.current) { ring.current.scale.setScalar(sc * Math.max(0.001, re)); ring.current.rotation.z = t * 0.4; ring.current.visible = re > 0.02; }
  });
  return (
    <>
      <group ref={tech}>
        <lineSegments><edgesGeometry args={[ico]} /><lineBasicMaterial color="#2F8FDB" /></lineSegments>
        <points geometry={ico}><pointsMaterial color="#0F1B2D" size={0.1} sizeAttenuation /></points>
        <mesh><sphereGeometry args={[0.52, 40, 40]} /><meshPhysicalMaterial color="#0F1B2D" metalness={0.6} roughness={0.12} clearcoat={1} /></mesh>
        <mesh scale={1.35} rotation={[1.2, 0, 0]}><torusGeometry args={[1, 0.012, 8, 100]} /><meshBasicMaterial color="#7CC6FF" /></mesh>
      </group>
      <group ref={human}>
        <mesh><sphereGeometry args={[0.95, 64, 64]} /><MeshDistortMaterial color="#FF9A62" distort={0.32} speed={1.8} roughness={0.18} metalness={0.05} /></mesh>
        <group ref={orbit}>{people.map((i) => <mesh key={i}><sphereGeometry args={[0.1, 16, 16]} /><meshStandardMaterial color={['#FACC2C', '#FFD8BF', '#FF7A45', '#FFFFFF'][i]} roughness={0.3} /></mesh>)}</group>
      </group>
      <group ref={gem}>
        <mesh><icosahedronGeometry args={[1, 0]} /><meshPhysicalMaterial color="#FFD43B" metalness={0.12} roughness={0.12} clearcoat={1} flatShading emissive="#FFB300" emissiveIntensity={0.38} /></mesh>
        <mesh scale={0.5}><icosahedronGeometry args={[1, 0]} /><meshBasicMaterial color="#0F1B2D" /></mesh>
      </group>
      <mesh ref={ring} rotation={[1.25, 0, 0]}><torusGeometry args={[1.55, 0.012, 12, 140]} /><meshBasicMaterial color="#0F1B2D" /></mesh>
      <ContactShadows position={[0, -1.5, 0]} opacity={0.22} blur={2.4} far={3} scale={4.5} />
      <Sparkles count={36} scale={[8, 3, 2]} size={2.4} speed={0.3} color="#E9A800" opacity={0.7} />
    </>
  );
}

export default function MergeScene({ p, running }: { p: MutableRefObject<number>; running: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0.4, 7], fov: 30 }} dpr={[1, 1.75]} gl={{ alpha: true, antialias: true }} frameloop={running ? 'always' : 'never'} aria-label="Technology and human intelligence merging into one purpose">
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5, 4]} intensity={1.8} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[9, 2, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#FFE9B0" position={[-5, 0, 2]} scale={[2, 6, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#CFE6FF" position={[5, 1, 2]} scale={[2, 6, 1]} />
      </Environment>
      <Scene p={p} />
    </Canvas>
  );
}
