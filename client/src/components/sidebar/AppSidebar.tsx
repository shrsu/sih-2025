import { BriefcaseMedical } from "lucide-react";

import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";
import { NavHeader } from "./NavHeader";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { useLoggedInEntity } from "@/contexts/LoggedInEntityContext";

const navItems = [
  {
    title: "Patients",
    url: "#",
    icon: BriefcaseMedical,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { entity } = useLoggedInEntity();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="pt-4.5">
        <NavHeader />
      </SidebarHeader>
      <SidebarContent className="mt-4.5">
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser entity={entity} />
      </SidebarFooter>
    </Sidebar>
  );
}
