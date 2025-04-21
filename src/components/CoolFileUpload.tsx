
import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CoolFileUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
}

export default function CoolFileUpload({ value, onChange }: CoolFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(value ? value.name : null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileName(file ? file.name : null);
    onChange(file);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleChange}
      />
      <div
        onClick={handleClick}
        className={`relative w-full cursor-pointer flex flex-col items-center justify-center p-8 transition-all overflow-hidden rounded-2xl bg-gradient-to-br from-brand-lightPurple/80 via-white to-brand-blue/60 border-2 border-dashed border-brand-purple/30 shadow-lg animate-fade-in hover:scale-105`}
        tabIndex={0}
        role="button"
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleClick()}
      >
        <Upload className="w-10 h-10 text-brand-purple mb-3 animate-bounce" style={{animationDuration: '1.8s'}} />
        <span className="font-bold text-lg text-brand-purple mb-1">{fileName ? "Upload Completed!" : "Upload your CV/Resume"}</span>
        <span className="text-xs text-brand-purple/80 mb-2">{fileName ? fileName : "PDF, DOC, DOCX under 5MB"}</span>
        {!fileName && (
          <Button 
            type="button"
            onClick={handleClick}
            className="bg-brand-purple/90 hover:bg-brand-blue text-white rounded-xl font-semibold py-3 px-8 mt-2 shadow hover-scale"
          >Select File</Button>
        )}
        {fileName && (
          <div className="text-brand-purple/80 mt-2 animate-fade-in">
            <span className="rounded-full bg-brand-lightPurple/70 px-3 py-1 text-xs">CV uploaded ✔</span>
          </div>
        )}
      </div>
    </div>
  );
}
