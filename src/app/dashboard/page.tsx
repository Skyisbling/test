"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ParticleBackground from "@/components/ParticleBackground";
import FloatingCard from "@/components/FloatingCard";
import EmotionalOrb from "@/components/EmotionalOrb";
import WaveformVisualizer from "@/components/WaveformVisualizer";

type EmotionType = "calm" | "energetic" | "anxious" | "joyful";

interface VoiceLog {
  id: string;
  title: string;
  emotion: EmotionType;
  duration: string;
  time: string;
  vibeScore: number;
}

const initialVoiceLogs: VoiceLog[] = [
  { id: "1", title: "Morning Reflection.wav", emotion: "calm", duration: "1:42", time: "08:32 AM", vibeScore: 92 },
  { id: "2", title: "Project Brainstorm.wav", emotion: "energetic", duration: "3:15", time: "02:15 PM", vibeScore: 88 },
  { id: "3", title: "Midnight Musings.wav", emotion: "anxious", duration: "0:55", time: "11:45 PM", vibeScore: 45 },
];

const emotionInsights: Record<EmotionType, { text: string; details: string; color: string }> = {
  calm: {
    text: "Resonance matches Alpha brain rhythms (8.5Hz). Low acoustic jitter.",
    details: "Your vocal pattern suggests high clarity, low stress, and deep physical stability.",
    color: "text-cyan-400 border-cyan-500/20 bg-cyan-950/20",
  },
  energetic: {
    text: "High velocity speaking rate. Micro-pitch peaks positive.",
    details: "Your vocal frequency is accelerated, showing high enthusiasm, speed, and creative focus.",
    color: "text-pink-400 border-pink-500/20 bg-pink-950/20",
  },
  anxious: {
    text: "Irregular wave intervals. Vocal pitch show micro-tremors.",
    details: "Your resonance pattern indicates elevated cortisol signatures. Try 4-7-8 breathing exercises.",
    color: "text-purple-400 border-purple-500/20 bg-purple-950/20",
  },
  joyful: {
    text: "Perfect harmonic stability. Peak resonant amplification.",
    details: "Acoustic signatures show high emotional variance paired with strong wave coherence.",
    color: "text-yellow-400 border-yellow-500/20 bg-yellow-950/20",
  },
};

export default function Dashboard() {
  const [activeEmotion, setActiveEmotion] = useState<EmotionType>("calm");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceLogs, setVoiceLogs] = useState<VoiceLog[]>(initialVoiceLogs);
  const [avgAudioVolume, setAvgAudioVolume] = useState(0);

  // Timer logic for recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording and append new mock log
      setIsRecording(false);
      const newLog: VoiceLog = {
        id: Date.now().toString(),
        title: `Voice Log #${voiceLogs.length + 1}.wav`,
        emotion: activeEmotion,
        duration: formatTime(recordingSeconds),
        time: "Just Now",
        vibeScore: Math.floor(Math.random() * 35) + 65, // 65-100
      };
      setVoiceLogs([newLog, ...voiceLogs]);
    } else {
      // Start recording
      setIsRecording(true);
    }
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Callback to receive average audio level from 3D visualizer
  const handleAudioData = (volume: number) => {
    setAvgAudioVolume(volume);
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* 3D Particle Background */}
      <ParticleBackground />

      {/* Navigation Header */}
      <header className="w-full px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-full glass-panel">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors">
              &larr; Exit
            </Link>
            <div className="w-[1px] h-4 bg-slate-800" />
            <span className="text-sm font-bold bg-neon-gradient text-transparent bg-clip-text">
              Dashboard / Console
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-950/20 text-[10px] font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI Core Online
            </div>
            <div className="w-8 h-8 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center font-bold text-xs text-slate-300">
              VM
            </div>
          </div>
        </nav>
      </header>

      {/* Main Dashboard Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* LEFT COLUMN: 3D Orb & Selector (grid cols 12 md 5) */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <FloatingCard
            glowColor={
              activeEmotion === "calm"
                ? "cyan"
                : activeEmotion === "energetic"
                ? "pink"
                : activeEmotion === "anxious"
                ? "purple"
                : "cyan"
            }
            floatDelay={0}
            className="flex-1 flex flex-col justify-between h-[450px]"
          >
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-bold text-slate-200">
                Cognitive Resonance Orb
              </h2>
              <p className="text-slate-500 text-xs">
                Shows active neural signature deforming volumetric shapes.
              </p>
            </div>

            {/* 3D Orb Canvas */}
            <div className="flex-1 min-h-[220px] relative flex items-center justify-center">
              {/* Dynamic pulsating halo behind the orb deforms with audio level if recording */}
              <div
                className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 blur-3xl transition-transform duration-100"
                style={{
                  transform: `scale(${1 + avgAudioVolume * 1.5})`,
                }}
              />
              <EmotionalOrb emotion={activeEmotion} interactive={true} />
            </div>

            {/* Selector Grid */}
            <div className="grid grid-cols-4 gap-2">
              {(["calm", "energetic", "anxious", "joyful"] as EmotionType[]).map((emo) => (
                <button
                  key={emo}
                  onClick={() => setActiveEmotion(emo)}
                  className={`py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border ${
                    activeEmotion === emo
                      ? "bg-slate-100 border-slate-100 text-slate-950 shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                      : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  {emo}
                </button>
              ))}
            </div>
          </FloatingCard>

          {/* Neuro Diagnostics Card */}
          <FloatingCard floatDelay={1.0} className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-300">
              Acoustic Resonance Insights
            </h3>
            <div className={`p-4 border rounded-2xl ${emotionInsights[activeEmotion].color} transition-all duration-300`}>
              <p className="text-xs font-semibold leading-normal">
                {emotionInsights[activeEmotion].text}
              </p>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {emotionInsights[activeEmotion].details}
            </p>
          </FloatingCard>
        </section>

        {/* RIGHT COLUMN: Recorder & Cards (grid cols 12 md 7) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Volumetric Waveform Recorder Card */}
          <FloatingCard glowColor={isRecording ? "pink" : "none"} floatDelay={0.5} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-200">Volumetric Voice Recorder</h2>
                <p className="text-slate-500 text-xs">
                  Speak to deform the 3D frequency mesh grid.
                </p>
              </div>

              {isRecording && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  REC {formatTime(recordingSeconds)}
                </div>
              )}
            </div>

            {/* 3D Waveform Canvas */}
            <div className="h-[220px] bg-slate-950/30 rounded-2xl border border-slate-900 relative overflow-hidden flex items-center justify-center">
              <WaveformVisualizer isRecording={isRecording} onAudioData={handleAudioData} />
            </div>

            {/* Control Panel */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                {isRecording ? "Listening to microphone input..." : "Click record to analyze vocal resonance."}
              </span>
              
              <button
                onClick={toggleRecording}
                className={`w-full sm:w-auto px-8 py-3 rounded-full font-bold text-xs transition-all duration-300 shadow-md ${
                  isRecording
                    ? "bg-rose-500 text-slate-100 hover:bg-rose-600 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                    : "bg-slate-100 text-slate-950 hover:bg-slate-200 shadow-[0_0_25px_rgba(255,255,255,0.1)]"
                }`}
              >
                {isRecording ? "Stop & Save Log" : "Record Voice Entry"}
              </button>
            </div>
          </FloatingCard>

          {/* Grid Panel for secondary data elements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Stats Dashboard Card */}
            <FloatingCard floatDelay={1.5} className="flex flex-col gap-4 justify-between h-[230px]">
              <h3 className="text-sm font-bold text-slate-300">Live Coherence Index</h3>
              
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-100 tracking-tight">94.2</span>
                <span className="text-xs text-cyan-400 font-bold">%</span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>STRESS DEGREE</span>
                  <span>0.04 (VERY LOW)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 w-[12%]" />
                </div>
              </div>

              <div className="flex justify-between border-t border-slate-900 pt-3 text-[10px] text-slate-400">
                <div>
                  <div className="font-bold text-slate-300">8.24Hz</div>
                  <div>Base Pitch</div>
                </div>
                <div>
                  <div className="font-bold text-slate-300">0.96</div>
                  <div>Coherence</div>
                </div>
                <div>
                  <div className="font-bold text-slate-300">12.5dB</div>
                  <div>RMS Vol</div>
                </div>
              </div>
            </FloatingCard>

            {/* Audio History Logs */}
            <FloatingCard floatDelay={2.0} className="flex flex-col gap-3 justify-between h-[230px]">
              <h3 className="text-sm font-bold text-slate-300">Acoustic Diary Logs</h3>
              
              <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto pr-1">
                {voiceLogs.map((log) => {
                  const tagColors: Record<EmotionType, string> = {
                    calm: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
                    energetic: "bg-pink-500/10 text-pink-400 border-pink-500/20",
                    anxious: "bg-purple-500/10 text-purple-400 border-purple-500/20",
                    joyful: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
                  };

                  return (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-950/20 border border-slate-900 hover:border-slate-800 transition-colors"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-bold text-slate-200 truncate max-w-[130px]">
                          {log.title}
                        </span>
                        <span className="text-[9px] text-slate-500">
                          {log.time} &middot; {log.duration}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 border rounded-full text-[9px] font-extrabold uppercase tracking-wide ${tagColors[log.emotion]}`}>
                        {log.emotion}
                      </span>
                    </div>
                  );
                })}
              </div>
            </FloatingCard>

          </div>
        </section>

      </main>

      {/* Simple absolute positioned decorative orb */}
      <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-gradient-to-tr from-purple-500/5 to-pink-500/5 blur-3xl -z-10" />
    </div>
  );
}
