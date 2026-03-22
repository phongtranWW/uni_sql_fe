import { useAppDispatch, useAppSelector } from "@/app/hook";
import type { AppDispatch } from "@/app/store";
import { useEffect, useState } from "react";
import ContentProjectToolbar from "./content-project-toolbar";
import ContentProjectTable from "./content-project-table";
import ContentProjectPagination from "./content-project-pagination";
import {
  selectProjects,
  selectTotal,
} from "@/features/project/selectors/projects.selector";
import type { ProjectGetManyParams } from "@/features/project/services/project.service";
import { getProjects } from "@/features/project/thunks";

const ContentProjectManager = () => {
  const dispatch = useAppDispatch<AppDispatch>();
  const projects = useAppSelector(selectProjects);
  const total = useAppSelector(selectTotal);

  const [params, setParams] = useState<ProjectGetManyParams>({
    page: 1,
    limit: 10,
    sortBy: "updatedAt",
    sortOrder: "desc",
    search: "",
  });

  useEffect(() => {
    dispatch(getProjects({ params }));
  }, [dispatch, params]);

  return (
    <div className="flex flex-col h-full">
      <ContentProjectToolbar
        params={params}
        total={total}
        onParamsChange={setParams}
      />
      <ContentProjectTable projects={projects} />
      <ContentProjectPagination params={params} onParamsChange={setParams} />
    </div>
  );
};

export default ContentProjectManager;
