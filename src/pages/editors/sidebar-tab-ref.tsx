import { useAppSelector } from "@/app/hook";
import type { RootState } from "@/app/store";
import SidebarRef from "./sidebar-ref";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useState } from "react";
import { SearchIcon } from "lucide-react";

const SidebarTabRef = () => {
  const refs = useAppSelector((state: RootState) => state.database.refs);
  const [key, setKey] = useState("");

  const filteredRefs = refs.filter((ref) =>
    ref.name.toLowerCase().includes(key.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-2">
      <InputGroup className="rounded-xs">
        <InputGroupInput
          id="search"
          type="search"
          placeholder="Search references..."
          onChange={(e) => setKey(e.target.value)}
        />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
      <div className="flex flex-col divide-y divide-border">
        {filteredRefs.map((ref) => (
          <SidebarRef key={ref.name} reference={ref} />
        ))}
      </div>
    </div>
  );
};

export default SidebarTabRef;
