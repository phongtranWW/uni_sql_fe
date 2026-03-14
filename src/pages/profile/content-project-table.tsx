import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ProjectSummary } from "@/features/projects/schemas";
import ContentProjectRow from "./content-project-row";

interface ContentProjectTableProps {
  projects: ProjectSummary[];
}

const ContentProjectTable = ({ projects }: ContentProjectTableProps) => {
  return (
    <div className="flex-1 overflow-auto px-6">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[40%]">Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {projects.map((project) => (
            <ContentProjectRow key={project.id} project={project} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContentProjectTable;
