import {
  BriefcaseMedical,
  CalendarClock,
  ClipboardPlus,
  Pill,
} from "lucide-react";

import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";
import { NavHeader } from "./NavHeader";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { useUserContext } from "@/contexts/UserContext";

const navItems = [
  {
    title: "Patients",
    url: "#",
    icon: BriefcaseMedical,
  },
  {
    title: "Medicines",
    url: "#",
    icon: Pill,
  },
  {
    title: "Time Slots",
    url: "#",
    icon: CalendarClock,
  },
  {
    title: "Reports",
    url: "#",
    icon: ClipboardPlus,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUserContext();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="pt-4.5">
        <NavHeader />
      </SidebarHeader>
      <SidebarContent className="mt-4.5">
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} /> {/* ← context-driven user */}
      </SidebarFooter>
    </Sidebar>
  );
}
