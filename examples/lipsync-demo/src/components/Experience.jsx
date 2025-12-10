import { CameraControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Avatar } from "./Avatar";
import { ModelInspector } from "./ModelInspector";

export const Experience = ({ requestedAnimation, lightIntensity = 1.0, smoothMovements = true, selectedCharacter = "aima" }) => {
  const controls = useRef();

  useEffect(() => {
    // Center the character with proper framing
    controls.current.setLookAt(0, 1.6, 1.2, 0, 1.5, 0, true);
  }, []);

  const characterModels = {
    aima: "/models/6936b0da347390125d6069ae (2).glb",
    sara: "/models/Sara.glb",
    custom: "/models/6936b0da347390125d6069ae (2).glb",
  };
  const inspectorPath = characterModels[selectedCharacter] || characterModels.aima;

  return (
    <>
      <ModelInspector modelPath={inspectorPath} />
      <CameraControls ref={controls} />
      <ambientLight intensity={0.5 * lightIntensity} />
      <directionalLight position={[0, 2, 5]} intensity={3 * lightIntensity} />
      <directionalLight position={[1, 0.5, -3]} intensity={2 * lightIntensity} color="blue" />
      <directionalLight position={[-1, 0.5, -2]} intensity={2 * lightIntensity} color="red" />
      <directionalLight position={[1, 1, 3]} intensity={2 * lightIntensity} />
      <Avatar
        requestedAnimation={requestedAnimation}
        smoothMovements={smoothMovements}
        selectedCharacter={selectedCharacter}
      />
    </>
  );
};
