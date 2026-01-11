interface SidebarItemProps {
  item: any;
  pathname: string;
  isOpen: boolean;
  onToggle: () => void;
  onCloseSidebar: () => void;
}