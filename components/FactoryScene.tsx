import { Billboard, OrbitControls, Text, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import type { Mesh } from "three";
import { Box3, Color, Vector3 } from "three";
import type { MachineState, Status } from "../hooks/useFactoryData";

const USE_GLB = true;
const GLB_URL = "/models/machine.glb";
const GLB_TARGET_SIZE = 2.2;
const GLB_Y = 0;
// ================================

const COLORS = { normal: "#22c55e", warning: "#f59e0b", critical: "#ef4444" };

function BoxMachine({ status, rpm }: { status: Status; rpm: number }) {
  const rotor = useRef<Mesh>(null!);
  useFrame((_, delta) => {
    rotor.current.rotation.y += (rpm / 60) * delta * 0.3;
  });
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.6, 1, 1.2]} />
        <meshStandardMaterial color={COLORS[status]} />
      </mesh>
      <mesh ref={rotor} position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.25, 32]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
    </group>
  );
}

function GlbMachine({ status }: { status: Status }) {
  const { scene } = useGLTF(GLB_URL);

  const model = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o: any) => {
      if (o.isMesh && o.material) {
        o.material = o.material.clone();
        o.userData.baseColor = o.material.color?.clone();
      }
    });

    const box = new Box3().setFromObject(c);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const s = GLB_TARGET_SIZE / Math.max(size.x, size.y, size.z);
    c.scale.setScalar(s);
    c.position.set(-center.x * s, -box.min.y * s, -center.z * s);
    return c;
  }, [scene]);

  useEffect(() => {
    const tint = new Color(COLORS[status]);
    model.traverse((o: any) => {
      if (o.isMesh && o.material?.color && o.userData.baseColor) {
        o.material.color
          .copy(o.userData.baseColor)
          .lerp(tint, status === "normal" ? 0.85 : 0.8);
      }
    });
  }, [model, status]);

  return (
    <group position={[0, GLB_Y, 0]}>
      <primitive object={model} />
    </group>
  );
}

function Machine({
  machine,
  selected,
  onSelect,
}: {
  machine: MachineState;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const status = machine.latest?.status ?? "normal";
  const rpm = machine.latest?.rpm ?? 0;

  return (
    <group
      position={machine.position}
      onClick={(e: any) => {
        e.stopPropagation();
        onSelect(machine.id);
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      {USE_GLB ? (
        <Suspense fallback={null}>
          <GlbMachine status={status} />
        </Suspense>
      ) : (
        <BoxMachine status={status} rpm={rpm} />
      )}

      {selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[1.4, 1.55, 48]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      )}

      <Billboard position={[0, 2, 0]}>
        <Text
          fontSize={0.22}
          color={selected ? "#38bdf8" : "white"}
          outlineWidth={0.015}
          outlineColor="#0f172a"
          anchorX="center"
          anchorY="middle"
        >
          {machine.name}
        </Text>
      </Billboard>
    </group>
  );
}

export default function FactoryScene({
  machines,
  selectedId,
  onSelect,
}: {
  machines: MachineState[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <Canvas camera={{ position: [6, 4.5, 8] }} style={{ height: 460 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      {machines.map((m) => (
        <Machine
          key={m.id}
          machine={m}
          selected={m.id === selectedId}
          onSelect={onSelect}
        />
      ))}
      <gridHelper args={[10, 10]} />
      <OrbitControls />
    </Canvas>
  );
}