import { useAppSelector } from "@/app/hook";
import SidebarRef from "./sidebar-ref";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { selectDatabaseRefs } from "@/features/project/selectors";

const SidebarTabRef = () => {
  const refs = useAppSelector(selectDatabaseRefs);
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
      <div className="flex flex-col divide-border">
        {filteredRefs.map((ref) => (
          <SidebarRef key={ref.name} reference={ref} />
        ))}
      </div>
    </div>
  );
};

export default SidebarTabRef;
