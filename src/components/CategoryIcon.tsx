import {
  Activity,
  Bone,
  Brain,
  Droplets,
  Eye,
  Flower2,
  Soup,
  Sparkles,
  Stethoscope,
  Waves,
  Wind,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Wind,
  Activity,
  Soup,
  Sparkles,
  Bone,
  Droplets,
  Flower2,
  Brain,
  Eye,
  Waves,
};


export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = map[name] ?? Stethoscope;
  return <Icon className={className} aria-hidden="true" />;
}
