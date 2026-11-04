import { useEffect, useRef, useState } from "react";

export type Status = "normal" | "warning" | "critical";

export type Reading = {
  temp: number;
  vibration: number;
  rpm: number;
  status: Status;
  time: number;
};

export type Alert = {
  id: number;
  time: number;
  machineId: string;
  machineName: string;
  status: Status;
  message: string;
};

export type MachineInfo = {
  id: string;
  name: string;
  position: [number, number, number];
};

export type MachineState = MachineInfo & {
  latest?: Reading;
  history: Reading[];
};

export const MACHINES: MachineInfo[] = [
  { id: "m1", name: "Pump #1", position: [-2, 0, 0] },
  { id: "m2", name: "Pump #2", position: [2, 0, 0] },
];

function getStatus(temp: number, vib: number): Status {
  if (temp > 85 || vib > 7) return "critical";
  if (temp > 75 || vib > 5) return "warning";
  return "normal";
}

function getMessage(temp: number, vib: number): string {
  const causes: string[] = [];
  if (temp > 75) causes.push(`อุณหภูมิสูง ${temp.toFixed(1)} °C`);
  if (vib > 5) causes.push(`การสั่นสูง ${vib.toFixed(2)}`);
  return causes.join(" / ");
}

type Sim = {
  temp: number;
  vib: number;
  rpm: number;
  fault: number;
  faultTemp: number;
  faultVib: number;
  prev: Status;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export function useFactoryData() {
  const [machines, setMachines] = useState<MachineState[]>(
    MACHINES.map((m) => ({ ...m, history: [] }))
  );
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const sims = useRef<Sim[]>(
    MACHINES.map(() => ({
      temp: rand(64, 70),
      vib: rand(2.8, 3.6),
      rpm: rand(1450, 1550),
      fault: 0,
      faultTemp: 0,
      faultVib: 0,
      prev: "normal" as Status,
    }))
  );
  const alertId = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      const newAlerts: Alert[] = [];

      const readings = sims.current.map((sim, i) => {
        if (sim.fault > 0) {
          sim.fault--;
        } else if (Math.random() < 0.03) {
          sim.fault = Math.floor(rand(12, 28));
          sim.faultTemp = rand(80, 94);
          sim.faultVib = rand(5.5, 8);
        }

        const targetTemp = sim.fault > 0 ? sim.faultTemp : 68;
        const targetVib = sim.fault > 0 ? sim.faultVib : 3.2;

        sim.temp += (targetTemp - sim.temp) * 0.12 + rand(-0.6, 0.6);
        sim.vib += (targetVib - sim.vib) * 0.15 + rand(-0.15, 0.15);
        sim.rpm += (1500 - sim.rpm) * 0.1 + rand(-15, 15);

        const status = getStatus(sim.temp, sim.vib);

        if (status !== sim.prev && status !== "normal") {
          newAlerts.push({
            id: alertId.current++,
            time: now,
            machineId: MACHINES[i].id,
            machineName: MACHINES[i].name,
            status,
            message: getMessage(sim.temp, sim.vib),
          });
        }
        sim.prev = status;

        return {
          temp: sim.temp,
          vibration: sim.vib,
          rpm: sim.rpm,
          status,
          time: now,
        } as Reading;
      });

      setMachines((prev) =>
        prev.map((m, i) => ({
          ...m,
          latest: readings[i],
          history: [...m.history.slice(-29), readings[i]],
        }))
      );
      if (newAlerts.length) {
        setAlerts((a) => [...newAlerts, ...a].slice(0, 50));
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return { machines, alerts };
}