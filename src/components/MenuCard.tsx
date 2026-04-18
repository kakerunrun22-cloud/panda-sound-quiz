import { LucideIcon } from "lucide-react";

interface MenuCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  emoji: string;
  onClick: () => void;
}

const MenuCard = ({ icon: Icon, title, subtitle, emoji, onClick }: MenuCardProps) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border-2 border-primary/20 shadow-md hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all text-left"
  >
    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
      {emoji}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon size={16} className="text-primary" />
        <h3 className="font-black text-foreground text-base">{title}</h3>
      </div>
      <p className="text-xs text-muted-foreground leading-snug">{subtitle}</p>
    </div>
  </button>
);

export default MenuCard;
