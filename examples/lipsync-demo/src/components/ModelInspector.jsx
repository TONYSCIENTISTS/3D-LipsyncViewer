import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export function ModelInspector({ modelPath }) {
    const { scene, nodes } = useGLTF(modelPath);

    useEffect(() => {
        console.log("🔍 Inspecting model:", modelPath);
        console.log("📦 Full scene:", scene);
        console.log("📦 All nodes:", nodes);

        console.log("\n🎯 Meshes with Morph Targets:");
        scene.traverse((child) => {
            if (child.isMesh || child.isSkinnedMesh) {
                console.log(`\n  Mesh: ${child.name}`);
                console.log(`    Type: ${child.type}`);

                if (child.morphTargetDictionary) {
                    const morphTargets = Object.keys(child.morphTargetDictionary);
                    console.log(`    ✅ Morph Targets (${morphTargets.length}):`);

                    // Log each morph target individually
                    morphTargets.forEach(name => {
                        const index = child.morphTargetDictionary[name];
                        console.log(`       - "${name}" (index: ${index})`);
                    });

                    // Check for viseme-related morph targets
                    const visemes = morphTargets.filter(name =>
                        name.toLowerCase().includes('viseme') ||
                        name.toLowerCase().includes('mouth') ||
                        name.toLowerCase().includes('jaw') ||
                        name.includes('AA') || name.includes('EE') || name.includes('OO')
                    );

                    if (visemes.length > 0) {
                        console.log(`    🎤 Viseme-related:`, visemes.join(', '));
                    }
                } else {
                    console.log(`    ❌ No morph targets`);
                }
            }
        });

        console.log("\n📋 All node names:", Object.keys(nodes));
    }, [scene, nodes, modelPath]);

    return null;
}
