import { Billboard, Text as Label3D, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import type { Mesh, MeshBasicMaterial } from "three";
import { Box3, Color, Vector3 } from "three";
import type { MachineState, Status } from "../hooks/useFactoryData";
import { C, STATUS } from "./theme";

const USE_GLB = true;
const GLB_URL = "/models/machine.glb";
const GLB_TARGET_SIZE = 2.2;
const GLB_Y = 0;

function BoxMachine({ status, rpm }: { status: Status; rpm: number }) {
  const rotor = useRef<Mesh>(null!);
  useFrame((_, delta) => {
    rotor.current.rotation.y += (rpm / 60) * delta * 0.3;
  });
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.6, 1, 1.2]} />
        <meshStandardMaterial color={STATUS[status].color} />
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
    const k = GLB_TARGET_SIZE / Math.max(size.x, size.y, size.z);
    c.scale.setScalar(k);
    c.position.set(-center.x * k, -box.min.y * k, -center.z * k);
    return c;
  }, [scene]);

  useEffect(() => {
    const tint = new Color(STATUS[status].color);
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

function StatusRing({ status }: { status: Status }) {
  const ref = useRef<Mesh>(null!);
  useFrame(({ clock }) => {
    const mat = ref.current.material as MeshBasicMaterial;
    mat.opacity =
      status === "critical"
        ? 0.45 + 0.55 * Math.abs(Math.sin(clock.elapsedTime * 4))
        : 1;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <ringGeometry args={[1.35, 1.5, 48]} />
      <meshBasicMaterial color={STATUS[status].color} transparent />
    </mesh>
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

      <StatusRing status={status} />

      {selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[1.65, 1.73, 48]} />
          <meshBasicMaterial color={C.accent} />
        </mesh>
      )}

      <Billboard position={[0, 2.4, 0]}>
        <Label3D
          fontSize={0.24}
          color={selected ? C.accent : C.text}
          outlineWidth={0.02}
          outlineColor="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {machine.name}
        </Label3D>
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
  const { width } = useWindowDimensions();
  const height = width < 700 ? 300 : 420;

  return (
    <View
      style={{
        height,
        borderRadius: 18,
        overflow: "hidden",
        backgroundColor: C.canvas,
        borderWidth: 1,
        borderColor: C.border,
      }}
    >
      <Canvas camera={{ position: [6, 4.5, 8] }} style={{ height }}>
        <color attach="background" args={[C.canvas]} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 8, 5]} intensity={1.1} />
        {machines.map((m) => (
          <Machine
            key={m.id}
            machine={m}
            selected={m.id === selectedId}
            onSelect={onSelect}
          />
        ))}
        <gridHelper args={[10, 10, "#c3cde2", "#dbe2f0"]} />
        <OrbitControls />
      </Canvas>

      <View pointerEvents="none" style={{ position: "absolute", left: 14, bottom: 10 }}>
        <Text style={{ color: C.muted, fontSize: 12 }}>
          Drag to rotate · Scroll to zoom · Click an asset to select
        </Text>
      </View>
    </View>
  );
}