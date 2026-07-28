import React from 'react';
import { LucideProps } from 'lucide-react';
import {
  MessageCircle, Menu, X, Sparkles, ArrowRight, Heart, Users,
  Monitor, Target, Award, Globe, Check, Tag, GraduationCap,
  Star, Share2, HelpCircle, ChevronDown, CalendarCheck, Clock,
  Gift, FileText, Loader2, Phone, Mail, MapPin, Send, CircleAlert,
} from 'lucide-react';

const icons: Record<string, React.FC<LucideProps>> = {
  MessageCircle, Menu, X, Sparkles, ArrowRight, Heart, Users,
  Monitor, Target, Award, Globe, Check, Tag, GraduationCap,
  Star, Share2, HelpCircle, ChevronDown, CalendarCheck, Clock,
  Gift, FileText, Loader2, Phone, Mail, MapPin, Send, CircleAlert,
};

interface IconProps extends LucideProps {
  name: string;
  fallback?: string;
}

const Icon: React.FC<IconProps> = ({ name, fallback = 'CircleAlert', ...props }) => {
  const IconComponent = icons[name];

  if (!IconComponent) {
    const FallbackIcon = icons[fallback];
    if (!FallbackIcon) return <span className="text-xs text-gray-400">[icon]</span>;
    return <FallbackIcon {...props} />;
  }

  return <IconComponent {...props} />;
};

export default Icon;
