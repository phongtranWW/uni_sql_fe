import { useAppDispatch, useAppSelector } from "@/app/hook";
import type { AppDispatch } from "@/app/store";
import { selectProjects } from "@/features/projects/selectors";
import { getProjects } from "@/features/projects/thunks";
import type { ProjectGetManyParams } from "@/services/project/params";
import { useEffect, useState } from "react";
import ContentProjectToolbar from "./content-project-toolbar";
import ContentProjectTable from "./content-project-table";
import ContentProjectPagination from "./content-project-pagination";

const ContentProjectManager = () => {
  const dispatch = useAppDispatch<AppDispatch>();
  const { items, total } = useAppSelector(selectProjects);

  const [params, setParams] = useState<ProjectGetManyParams>({
    page: 1,
    limit: 10,
    sortBy: "updatedAt",
    sortOrder: "desc",
    search: "",
  });

  useEffect(() => {
    dispatch(getProjects(params));
  }, [dispatch, params]);

  return (
    <div className="flex flex-col h-full">
      <ContentProjectToolbar
        params={params}
        total={total}
        onParamsChange={setParams}
      />
      <ContentProjectTable projects={items} />
      <ContentProjectPagination params={params} onParamsChange={setParams} />
    </div>
  );
};

export default ContentProjectManager;
