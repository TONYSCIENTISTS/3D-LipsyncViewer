import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export function AnimationExtractor() {
    const { animations } = useGLTF("/models/animations.glb");

    useEffect(() => {
        console.log("📦 Total animations found:", animations.length);
        console.log("\n📋 Animation List:");

        animations.forEach((anim, index) => {
            console.log(`\n${index + 1}. ${anim.name}`);
            console.log(`   Duration: ${anim.duration.toFixed(2)}s`);
            console.log(`   Tracks: ${anim.tracks.length}`);

            // List all bone/node names being animated
            const animatedNodes = Array.from(new Set(anim.tracks.map(track => {
                const parts = track.name.split('.');
                return parts[0];
            })));
            console.log(`   Animated nodes: ${animatedNodes.join(', ')}`);
        });

        console.log("\n✅ Full animations data:", animations);
    }, [animations]);

    return null;
}
