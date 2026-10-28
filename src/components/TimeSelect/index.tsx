import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// Native <input type="time"> follows the device locale (often AM/PM) and can't be
// forced to 24h, so hours and minutes are picked separately. Value stays "HH:mm".
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

interface TimeSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function TimeSelect({
  id,
  value,
  onChange,
}: Readonly<TimeSelectProps>) {
  const [hour = "", minute = ""] = value.split(":");

  return (
    <div className="flex items-center gap-1">
      <Select
        value={hour}
        onValueChange={(h) => onChange(`${h}:${minute || "00"}`)}
      >
        <SelectTrigger id={id} aria-label="Hour">
          <SelectValue placeholder="HH" />
        </SelectTrigger>
        <SelectContent>
          {HOURS.map((h) => (
            <SelectItem key={h} value={h}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span>:</span>
      <Select
        value={minute}
        onValueChange={(m) => onChange(`${hour || "00"}:${m}`)}
      >
        <SelectTrigger aria-label="Minute">
          <SelectValue placeholder="mm" />
        </SelectTrigger>
        <SelectContent>
          {MINUTES.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
