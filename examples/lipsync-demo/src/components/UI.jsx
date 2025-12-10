import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { Experience } from "./Experience";
import { Visualizer } from "./Visualizer";
import { ChatInterface } from "./ChatInterface";
import { SettingsPanel } from "./SettingsPanel";
import { LoadingProgress } from "./LoadingProgress";
import { useChat } from "../hooks/useChat";

const examples = [
  {
    label: "Visualizer",
    href: "#",
  },
  {
    label: "3D model",
    href: "#model",
  },
];

export const UI = () => {
  const { sendMessage, loading, requestedAnimation, triggerIntro, audioReady, loadingProgress } = useChat();
  const [currentHash, setCurrentHash] = useState(
    window.location.hash.replace("#", "")
  );

  useEffect(() => {
    // When hash in the url changes, update the href state
    const handleHashChange = () => {
      setCurrentHash(window.location.hash.replace("#", ""));
    };
    window.addEventListener("hashchange", handleHashChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const qualityPresets = {
    Low: { pixelRatio: 0.5, shadows: false, antialias: false },
    Medium: { pixelRatio: 1, shadows: true, antialias: false },
    High: { pixelRatio: window.devicePixelRatio, shadows: true, antialias: true },
    Ultra: {
      pixelRatio: Math.min(window.devicePixelRatio * 2, 3),
      shadows: true,
      antialias: true,
      toneMapping: true,
      shadowMapSize: 2048
    },
  };

  const [quality, setQuality] = useState("Medium");
  const settings = qualityPresets[quality];

  const [backgroundColor, setBackgroundColor] = useState({
    top: "#00D4FF",      // Cyan
    bottom: "#D946EF"    // Magenta
  });

  const [lightIntensity, setLightIntensity] = useState(1.0);
  const [smoothMovements, setSmoothMovements] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState("aima");
  const [reloadKey, setReloadKey] = useState(0);
  const [characterVisible, setCharacterVisible] = useState(false);

  // Handle when user clicks to start
  const handleReady = () => {
    setCharacterVisible(true);
    triggerIntro();
  };

  return (
    <section className="flex overflow-hidden h-full w-full">
      {/* Keep Visualizer mounted but hidden - needed for audio routing */}
      <div className="hidden">
        <Visualizer />
      </div>

      <div
        className="flex-1 relative"
        style={{
          background: `linear-gradient(to bottom, ${backgroundColor.top}, ${backgroundColor.bottom})`
        }}
      >
        {characterVisible && (
          <Canvas
            shadows={settings.shadows}
            dpr={settings.pixelRatio}
            gl={{ antialias: settings.antialias }}
            camera={{ position: [0, 1.6, 2.2], fov: 50 }}
          >
            <Suspense>
              <Experience
                key={reloadKey}
                requestedAnimation={requestedAnimation}
                lightIntensity={lightIntensity}
                smoothMovements={smoothMovements}
                selectedCharacter={selectedCharacter}
              />
            </Suspense>
          </Canvas>
        )}

        <SettingsPanel
          quality={quality}
          onQualityChange={setQuality}
          backgroundColor={backgroundColor}
          onBackgroundColorChange={setBackgroundColor}
          lightIntensity={lightIntensity}
          onLightIntensityChange={setLightIntensity}
          smoothMovements={smoothMovements}
          onSmoothMovementsChange={setSmoothMovements}
          selectedCharacter={selectedCharacter}
          onCharacterChange={setSelectedCharacter}
          onSave={() => {
            console.log("Reloading character");
            setReloadKey(prev => prev + 1);
          }}
        />

        <ChatInterface onMessageSent={sendMessage} isLoadingExternal={loading} />

        {/* Loading progress - tap at 100% to start */}
        {!characterVisible && <LoadingProgress progress={loadingProgress} onReady={handleReady} />}
      </div>
    </section>
  );
};
