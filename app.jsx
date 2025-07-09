// App.jsx
import React from "react";
import Sidebar from "./components/Sidebar";
import PromptInput from "./components/PromptInput";
import RatioDropdown from "./components/RatioDropdown";
import StyleDropdown from "./components/StyleDropdown";
import SubmitButton from "./components/SubmitButton";
import OutputText from "./components/OutputText";
import ImagePreview from "./components/ImagePreview";

export default function App() {
  const [prompt, setPrompt] = React.useState("");
  const [ratio, setRatio] = React.useState("1:1");
  const [style, setStyle] = React.useState("Primary1");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen bg-white text-black font-sans">
      <Sidebar />
      <main className="flex-1 p-6 grid grid-cols-2 gap-8">
        <section className="space-y-4">
          <PromptInput value={prompt} onChange={setPrompt} />
          <div className="flex space-x-4">
            <RatioDropdown value={ratio} onChange={setRatio} />
            <StyleDropdown value={style} onChange={setStyle} />
            <SubmitButton onClick={handleSubmit} />
          </div>
          {submitted && <OutputText prompt={prompt} ratio={ratio} style={style} />}
        </section>
        <ImagePreview />
      </main>
    </div>
  );
}
