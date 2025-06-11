import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import appData from "./lib/api.json";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import axios from "axios";
import LaptopList from "@/components/LaptopList";
import { motion, AnimatePresence } from "framer-motion";
import { SpinnerGap, Sparkle, ArrowCounterClockwise } from "phosphor-react";

const BASE_URL = "http://127.0.0.1:5000";
// const BASE_URL = "http://127.0.0.1:5000"; // NGROK

export type LaptopRecommendation = {
  Brand: string;
  Model: string;
  CPU: string;
  GPU: string;
  Price: number | string;
  Match_Score?: number;
  Category?: string;
  RAM?: string;
  Storage?: string;
  Battery?: string;
};

type AppDataItem = (typeof appData)[0];

const App: React.FC = () => {
  const [stage, setStage] = useState<
    "init" | "welcome" | "loading" | "form" | "result"
  >("init");
  const [teks, setTeks] = useState("");
  const [rekomendasi, setRekomendasi] = useState<LaptopRecommendation[]>([]);
  const [typewriterText, setTypewriterText] = useState("");
  const fullTextRef = useRef("Selamat Datang di LapPick ~");
  const idxRef = useRef(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (stage === "welcome") {
      setTypewriterText("");
      idxRef.current = 0;

      const interval = setInterval(() => {
        const current = idxRef.current;
        const full = fullTextRef.current;

        if (current < full.length) {
          setTypewriterText((prev) => prev + full[current]);
          idxRef.current++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setStage("loading");
            setTimeout(() => setStage("form"), 1000);
          }, 1000);
        }
      }, 60);

      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleStart = () => setStage("welcome");

  const handleSubmit = async () => {
    if (!teks.trim()) {
      toast.error("Input kosong");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(
        `${BASE_URL}/recommend?query=${encodeURIComponent(teks)}`
      );

      if (Array.isArray(res.data) && res.data.length > 0) {
        const firstItem = res.data[0];

        if (firstItem.Status === "Tidak Ditemukan") {
          throw new Error(
            firstItem.Pesan ?? "Tidak ditemukan hasil yang cocok."
          );
        }

        const hasil = res.data.map(
          (item: any): LaptopRecommendation => ({
            Brand: item.Brand,
            Model: item.Model,
            CPU: item.CPU,
            GPU: item.GPU,
            RAM: item.RAM,
            Storage: item.Storage,
            Price: item["Final Price"],
            Match_Score: Math.round(item.Match_Score * 100),
            Category: item.Category,
          })
        );

        setRekomendasi(hasil);
        setStage("result");
      } else {
        throw new Error("Response server kosong atau invalid.");
      }
    } catch (err: any) {
      console.error("Error fetching rekomendasi:", err);
      const message =
        err.message || "Terjadi kesalahan saat memproses permintaan.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      // setStage("form");
    }
  }, [error]);

  const resetAll = () => {
    setTeks("");
    setRekomendasi([]);
    setStage("form");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1e3f] via-[#302b63] to-[#5c258d] text-white relative flex items-center justify-center overflow-hidden">
      <Toaster />
      {/* INIT */}
      <AnimatePresence>
        {stage === "init" && (
          <motion.div
            key="init"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-[#2a2a5e]/90 to-[#3c2e6c]/90 rounded-2xl p-10 w-full max-w-lg shadow-xl shadow-purple-500/10 border border-white/10 text-center"
            >
              <motion.div
                className="text-5xl mb-4 animate-wiggle origin-center"
                initial={{ rotate: -10 }}
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 1.2 }}
              >
                👋
              </motion.div>
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-2">
                Siap mulai cari laptop terbaik?
              </h1>
              <p className="text-sm text-zinc-400 mb-6">
                Klik tombol di bawah ini untuk memulai
              </p>
              <Button
                onClick={handleStart}
                className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-300 shadow-md hover:shadow-purple-500/40"
              >
                Mulai
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POPUP STAGES */}
      <AnimatePresence>
        {stage !== "init" && stage !== "result" && (
          <motion.div
            key="popup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              key={stage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-2xl p-10 w-full max-w-lg space-y-6 shadow-xl shadow-purple-500/10 border border-zinc-700 text-center"
            >
              {stage === "welcome" && (
                <>
                  <Sparkle
                    className="mx-auto text-purple-400 w-10 h-10 animate-pulse"
                    weight="duotone"
                  />
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight min-h-[3rem] leading-snug">
                    {typewriterText}
                    <span className="animate-blink">|</span>
                  </h1>
                  {typewriterText === fullTextRef.current && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-sm text-zinc-400"
                    >
                      Rekomendasi laptop berdasarkan kebutuhanmu
                    </motion.p>
                  )}
                </>
              )}

              {stage === "loading" && (
                <div className="flex flex-col items-center gap-3">
                  <SpinnerGap className="w-8 h-8 animate-spin text-purple-400" />
                  <p className="text-sm text-zinc-400">
                    Menyiapkan input form...
                  </p>
                </div>
              )}

              {stage === "form" && (
                <>
                  <h2 className="text-xl font-bold text-center mb-4">
                    Apa kebutuhan laptopmu?
                  </h2>
                  <Input
                    placeholder="Contoh: laptop untuk desain grafis 10 juta"
                    value={teks}
                    onChange={(e) => setTeks(e.target.value)}
                    className="bg-zinc-800 border border-zinc-600 hover:border-purple-400 focus:ring-2 focus:ring-purple-500 text-white placeholder:text-zinc-400/70 transition duration-200 ease-in-out"
                  />
                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-purple-600 hover:bg-purple-700 transition duration-200"
                  >
                    Cari
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RESULT */}
      <AnimatePresence>
        {stage === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full min-h-screen px-6 py-10 bg-gradient-to-br from-purple-900 to-black text-white"
          >
            <LaptopList data={rekomendasi} onBack={resetAll} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Glow Animation */}
      <motion.div
        animate={{ x: [0, 40, -40, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-10"
      />
    </div>
  );
};

export default App;
