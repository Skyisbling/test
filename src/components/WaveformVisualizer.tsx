"use client";

import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface WaveformVisualizerProps {
  isRecording: boolean;
  onAudioData?: (avgVolume: number) => void;
}

const BAR_COUNT = 24;

function VisualizerBars({ isRecording, onAudioData }: WaveformVisualizerProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Web Audio API refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isRecording) {
      // Clean up audio stream and context when recording stops
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
      audioContextRef.current = null;
      analyserRef.current = null;
      dataArrayRef.current = null;
      return;
    }

    // Initialize microphone capture
    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64; // Small fftSize for 32 bin items
        analyserRef.current = analyser;

        const bufferLength = analyser.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);
        sourceRef.current = source;
      } catch (err) {
        console.warn("Microphone access denied or unavailable. Running in simulation mode.", err);
      }
    };

    initAudio();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isRecording]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const frequencies = new Float32Array(BAR_COUNT);
    let avgVol = 0;

    if (isRecording && analyserRef.current && dataArrayRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);
      
      // Map audio bins to BAR_COUNT bars
      const binSize = Math.floor(dataArrayRef.current.length / BAR_COUNT) || 1;
      let total = 0;
      
      for (let i = 0; i < BAR_COUNT; i++) {
        let sum = 0;
        for (let j = 0; j < binSize; j++) {
          const index = i * binSize + j;
          if (index < dataArrayRef.current.length) {
            sum += dataArrayRef.current[index];
          }
        }
        const val = sum / binSize / 255;
        frequencies[i] = val;
        total += val;
      }
      avgVol = total / BAR_COUNT;
    } else {
      // Idle / Fallback Simulation Mode
      // Generate a dynamic scrolling wave using sines/cosines
      const speed = isRecording ? 18.0 : 4.0;
      const baseHeight = isRecording ? 0.35 : 0.12;
      let total = 0;

      for (let i = 0; i < BAR_COUNT; i++) {
        // Centered wave shape
        const distanceFromCenter = Math.abs(i - BAR_COUNT / 2) / (BAR_COUNT / 2);
        const wave = Math.sin(i * 0.45 - time * speed) * Math.cos(time * 0.8) * 0.25;
        const finalVal = Math.max(0.02, (baseHeight + wave) * (1 - distanceFromCenter * 0.4));
        frequencies[i] = finalVal;
        total += finalVal;
      }
      avgVol = total / BAR_COUNT;
    }

    // Send volume back to parent for UI scale modifications (e.g. glowing rings)
    if (onAudioData) {
      onAudioData(avgVol);
    }

    // Render bar modifications
    if (groupRef.current) {
      groupRef.current.children.forEach((child, idx) => {
        // Interpolate height scale
        const targetScaleY = 0.2 + frequencies[idx] * 5.5;
        child.scale.y += (targetScaleY - child.scale.y) * 0.22;

        // Dynamic coloring (cyan -> purple -> pink transition)
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;
        
        if (material) {
          const val = frequencies[idx];
          // Cyan HSL hue is 0.5, Purple is 0.75, Pink is 0.9
          const hue = 0.52 + val * 0.35;
          material.color.setHSL(hue, 0.95, 0.55);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: BAR_COUNT }).map((_, i) => {
        // Position bars horizontally with a curved arc facing the camera
        const step = 0.35;
        const x = (i - (BAR_COUNT - 1) / 2) * step;
        const z = -Math.cos((i / (BAR_COUNT - 1)) * Math.PI - Math.PI / 2) * 0.8;
        
        return (
          <mesh key={i} position={[x, 0, z]}>
            <boxGeometry args={[0.18, 1, 0.18]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
        );
      })}
    </group>
  );
}

export default function WaveformVisualizer({ isRecording, onAudioData }: WaveformVisualizerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-40 flex items-center justify-center gap-1.5 px-6">
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <div
            key={i}
            className="w-2.5 bg-neon-cyan/20 rounded-full transition-all duration-300"
            style={{
              height: `${12 + Math.sin(i * 0.4) * 20}px`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[220px] relative">
      <Canvas camera={{ position: [0, 1.2, 5], fov: 42 }} gl={{ alpha: true }}>
        <VisualizerBars isRecording={isRecording} onAudioData={onAudioData} />
      </Canvas>
    </div>
  );
}
