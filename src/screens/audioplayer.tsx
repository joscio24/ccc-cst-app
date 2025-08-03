import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AudioWaveView from "@kaannn/react-native-waveform";
import Sound from "react-native-sound";
import Icon from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";

interface AudioPlayerProps {
  audioFileUri: string | number; // string for remote URL, number for local require()
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioFileUri }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0); // in seconds
  const [currentTime, setCurrentTime] = useState(0); // in seconds

  const soundRef = useRef<Sound | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
 const { t } = useTranslation();
  useEffect(() => {
    Sound.setCategory("Playback");

    // Differentiate between local file (number) and remote URL (string)
    if (typeof audioFileUri === "string") {
      soundRef.current = new Sound(audioFileUri, undefined, (error) => {
        if (error) {
          console.log("Failed to load sound:", error);
          return;
        }
        setDuration(soundRef.current?.getDuration() || 0);
      });
    } else {
      soundRef.current = new Sound(audioFileUri, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log("Failed to load sound:", error);
          return;
        }
        setDuration(soundRef.current?.getDuration() || 0);
      });
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      soundRef.current?.release();
      soundRef.current = null;
    };
  }, [audioFileUri]);

  const playPause = () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pause();
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      soundRef.current.play((success) => {
        if (success) {
          setIsPlaying(false);
          setCurrentTime(0);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      });
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        soundRef.current?.getCurrentTime((seconds) => {
          setCurrentTime(seconds);
        });
      }, 250);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  // For AudioWaveView, pass string URLs only (convert local require to string URI if possible)
  // If local (number), you may need to load waveform from samples prop or skip waveform for local for now
  // Here we handle string URLs only for waveform
  const waveAudioFileUri = typeof audioFileUri === "string" ? audioFileUri : undefined;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={playPause}>
        <Icon
          name={isPlaying ? "pause-circle" : "play-circle"}
          size={58}
          color="#64C7C3"
        />
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{t("messages.audiMessage")}</Text>

        {waveAudioFileUri ? (
          <AudioWaveView
            style={{ width: "100%", height: 100 }}
            audioFileUri={waveAudioFileUri}
            progress={progressPercent}
            maxProgress={100}
            waveWidth={10}
            waveGap={3}
            waveMinHeight={20}
            waveCornerRadius={4}
            waveBackgroundColor="#E0E0E0"
            waveProgressColor="#64C7C3"
            markerWidth={2}
            markerColor="#FF5722"
            markerTextColor="#000000"
            markerTextSize={10}
            markerTextPadding={2}
          />
        ) : (
          <Text style={{ marginVertical: 20, color: "#999" }}>
            Waveform preview not available for local audio
          </Text>
        )}

        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "flex-start",
  },
  title: {
    fontWeight: "bold",
    flexDirection: "row",
    flex: 1,
    fontSize: 14,
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  timeText: {
    fontSize: 12,
    color: "#555",
  },
});

export default AudioPlayer;
