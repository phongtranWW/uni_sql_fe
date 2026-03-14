import type { Ref } from "@/features/project/schemas/ref";
import type { Table } from "@/features/project/schemas/table";

export interface ProjectSummaryDto {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectDto {
  id: string;
  name: string;
  tables: Table[];
  refs: Ref[];
}

export interface ProjectUpsertDto {
  name: string;
  tables: Table[];
  refs: Ref[];
}
