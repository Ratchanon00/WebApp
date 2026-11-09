import type { MachineState } from "../hooks/useFactoryData";

type Props = {
  machines: MachineState[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function FactoryScene(_props: Props) {
  return null;
}