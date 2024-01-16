"use client";
import Header from "./components/Header";
import InputField from "./components/InputField";

export default function Home() {
  return (
    <div className="flex flex-col bg-[#f0e9ff]">
      <Header />
      <InputField />
    </div>
  );
}
