import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "@/app/hook";
import { store } from "@/app/store";
import {
  deleteProject,
  getProjects,
  getSharedProjects,
} from "@/features/project/thunks";

export type ProjectTab = "my-projects" | "shared-with-me";
import type { ProjectGetManyParams } from "@/features/project/services/project.service";

export function useProfileProjects() {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<ProjectTab>("my-projects");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] =
    useState<ProjectGetManyParams["sortBy"]>("updatedAt");
  const [sortOrder, setSortOrder] =
    useState<ProjectGetManyParams["sortOrder"]>("desc");
  const [fetchPage, setFetchPage] = useState(1);
  const [refetchKey, setRefetchKey] = useState(0);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const skipNextSearchPageReset = useRef(true);

  useEffect(() => {
    const next = searchInput.trim();
    const delay = next === "" ? 0 : 300;
    const handle = window.setTimeout(() => {
      setDebouncedSearch(next);
    }, delay);
    return () => window.clearTimeout(handle);
  }, [searchInput]);

  useEffect(() => {
    if (skipNextSearchPageReset.current) {
      skipNextSearchPageReset.current = false;
      return;
    }
    setFetchPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const action = tab === "my-projects" ? getProjects : getSharedProjects;
    void dispatch(
      action({
        params: {
          page: fetchPage,
          limit: 6,
          sortBy,
          sortOrder,
          ...(debouncedSearch ? { search: debouncedSearch } : {}),
        },
      }),
    );
  }, [
    dispatch,
    fetchPage,
    refetchKey,
    sortBy,
    sortOrder,
    debouncedSearch,
    tab,
  ]);

  const refreshAfterDelete = useCallback(() => {
    const { page: currentPage, items: currentItems } = store.getState().projects;
    const nextPage =
      currentItems.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
    setFetchPage(nextPage);
    setRefetchKey((k) => k + 1);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await dispatch(deleteProject(deleteTargetId)).unwrap();
      toast.success("Project deleted");
      setDeleteTargetId(null);
      refreshAfterDelete();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete project");
    } finally {
      setDeleting(false);
    }
  }, [deleteTargetId, dispatch, refreshAfterDelete]);

  const setSortByAndResetPage = useCallback(
    (v: ProjectGetManyParams["sortBy"]) => {
      setSortBy(v);
      setFetchPage(1);
    },
    [],
  );

  const setSortOrderAndResetPage = useCallback(
    (v: ProjectGetManyParams["sortOrder"]) => {
      setSortOrder(v);
      setFetchPage(1);
    },
    [],
  );



  const setTabAndReset = useCallback((newTab: ProjectTab) => {
    if (newTab === tab) return;
    setTab(newTab);
    setFetchPage(1);
    setSearchInput("");
  }, [tab]);

  return {
    tab,
    setTab: setTabAndReset,
    searchInput,
    setSearchInput,
    sortBy,
    setSortByAndResetPage,
    sortOrder,
    setSortOrderAndResetPage,
    fetchPage,
    setFetchPage,
    deleteTargetId,
    setDeleteTargetId,
    deleting,
    confirmDelete,
    debouncedSearch,
  };
}

export type ProfileProjectsHandle = ReturnType<typeof useProfileProjects>;
