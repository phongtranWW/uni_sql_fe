import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { fetchTemplate } from "@/features/template/thunks";
import { clearTemplate } from "@/features/template/slice";
import {
  selectTemplate,
  selectTemplateStatus,
  selectTemplateError,
} from "@/features/template/selectors";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Calendar,
  Database,
  Table2,
  LayoutTemplate,
  User,
  Link2,
  BookOpen,
  Info,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Background,
  ConnectionLineType,
  ConnectionMode,
  Controls,
  MiniMap,
  ReactFlow,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import nodeTypes from "@/data/node-types";
import edgeTypes from "@/data/edge-types";
import Marker from "@/components/custom/marker";

import type { Table } from "@/features/project/schemas/table-schema";
import type { Ref } from "@/features/project/schemas/ref.schema";

interface TemplateDetailDialogProps {
  templateId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Read-only flow: drag allowed, connections/select disabled
function TemplateFlowView({
  tables,
  refs,
}: {
  tables: Table[];
  refs: Ref[];
}) {
  const [nodes, , onNodesChange] = useNodesState<Node>(
    tables.map((table) => ({
      id: table.name,
      type: "tableNode",
      position: { x: table.position.x, y: table.position.y },
      selected: false,
      data: {
        name: table.name,
        fields: table.fields,
        alias: table.alias,
        headerColor: table.headerColor,
      },
    })),
  );

  const [edges, , onEdgesChange] = useEdgesState<Edge>(
    refs.map((ref) => ({
      id: ref.name,
      source: ref.endpoints[0].tableName,
      sourceHandle: ref.endpoints[0].fieldName,
      target: ref.endpoints[1].tableName,
      targetHandle: ref.endpoints[1].fieldName,
      type: "refEdge",
      label: ref.name,
      selected: false,
      data: {
        name: ref.name,
        endpoints: ref.endpoints,
        operator: ref.operator,
      },
    })),
  );

  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      connectionMode={ConnectionMode.Loose}
      connectionLineType={ConnectionLineType.Straight}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      // allow drag, but disable connection & selection actions
      nodesDraggable={true}
      nodesConnectable={false}
      elementsSelectable={false}
      panOnDrag={[1, 2]}
    >
      <Marker />
      <Background />
      <MiniMap />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}

// ── Section label helper ──────────────────────────────────────────────────────
function SectionLabel({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="size-3 text-muted-foreground" />
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
        {label}
      </p>
    </div>
  );
}

export function TemplateDetailDialog({
  templateId,
  open,
  onOpenChange,
}: TemplateDetailDialogProps) {
  const dispatch = useAppDispatch();
  const template = useAppSelector(selectTemplate);
  const status = useAppSelector(selectTemplateStatus);
  const error = useAppSelector(selectTemplateError);

  useEffect(() => {
    if (open && templateId) {
      dispatch(fetchTemplate(templateId));
    }
    if (!open) {
      dispatch(clearTemplate());
    }
  }, [open, templateId, dispatch]);

  const tables: Table[] = useMemo(
    () => template?.project?.tables ?? [],
    [template],
  );
  const refs: Ref[] = useMemo(
    () => template?.project?.refs ?? [],
    [template],
  );

  const formattedDate = template
    ? new Date(template.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 overflow-hidden flex flex-col gap-0"
        style={{ width: "90vw", maxWidth: "90vw", height: "80vh", maxHeight: "80vh" }}
      >
        {/* ── Compact Header ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b shrink-0 min-h-0">
          <div className="flex items-center justify-center size-8 rounded-md bg-primary/10 shrink-0">
            <LayoutTemplate className="size-4 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            {status === "loading" ? (
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-72" />
              </div>
            ) : status === "succeeded" && template ? (
              <>
                {/* Hidden for a11y, rendered visually below */}
                <DialogTitle className="text-sm font-semibold leading-tight truncate">
                  {template.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground truncate">
                  {template.description || "No description provided."}
                </DialogDescription>
              </>
            ) : (
              <DialogTitle className="text-sm font-semibold">
                Template Details
              </DialogTitle>
            )}
          </div>

          {/* Stats pill — only when loaded */}
          {status === "succeeded" && template && (
            <div className="flex items-center gap-2 shrink-0 mr-6">
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground border rounded-full px-2 py-0.5">
                <Table2 className="size-3" />
                {tables.length}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground border rounded-full px-2 py-0.5">
                <Link2 className="size-3" />
                {refs.length}
              </span>
            </div>
          )}
        </div>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left sidebar */}
          <aside className="w-56 shrink-0 border-r overflow-y-auto p-4 flex flex-col gap-4">
            {status === "loading" && (
              <div className="space-y-3">
                <Skeleton className="h-[88px] w-full rounded-lg" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
            )}

            {status === "failed" && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>
                  {error || "Failed to load template details."}
                </AlertDescription>
              </Alert>
            )}

            {status === "succeeded" && template && (
              <>
                {/* Thumbnail */}
                {template.image && (
                  <div className="rounded-md overflow-hidden border">
                    <img
                      src={`${import.meta.env.VITE_URL_BACKEND}/${template.image}`}
                      alt={template.name}
                      className="w-full aspect-video object-cover"
                    />
                  </div>
                )}

                {/* Author */}
                <div className="flex flex-col gap-1.5">
                  <SectionLabel icon={User} label="Author" />
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarImage src={template.author?.avatar || ""} />
                      <AvatarFallback className="text-[10px]">
                        {template.author?.name?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium truncate">
                      {template.author?.name || "Unknown"}
                    </span>
                  </div>
                </div>

                {/* Date */}
                <div className="flex flex-col gap-1.5">
                  <SectionLabel icon={Calendar} label="Created" />
                  <div className="flex items-center gap-1.5 text-sm">
                    <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                    <span>{formattedDate}</span>
                  </div>
                </div>

                {/* Schema stats */}
                <div className="flex flex-col gap-1.5">
                  <SectionLabel icon={Database} label="Schema" />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Table2 className="size-3.5 text-muted-foreground shrink-0" />
                      <span>
                        {tables.length} table{tables.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Link2 className="size-3.5 text-muted-foreground shrink-0" />
                      <span>
                        {refs.length} relation{refs.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Table list */}
                {tables.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <SectionLabel icon={BookOpen} label="Tables" />
                    <div className="flex flex-wrap gap-1">
                      {tables.map((table) => (
                        <Badge
                          key={table.name}
                          variant="secondary"
                          className="text-[10px] font-mono px-1.5 py-0"
                        >
                          {table.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hint */}
                <div className="mt-auto pt-2 flex items-start gap-1.5 text-[11px] text-muted-foreground">
                  <Info className="size-3 shrink-0 mt-px" />
                  <span>You can drag tables to explore the schema.</span>
                </div>
              </>
            )}
          </aside>

          {/* Right – ReactFlow diagram */}
          <div className="flex-1 min-w-0 relative">
            {status === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <div className="size-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Loading diagram…</span>
                </div>
              </div>
            )}

            {status === "failed" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Alert variant="destructive" className="max-w-sm">
                  <AlertCircle className="size-4" />
                  <AlertDescription>
                    {error || "Failed to load diagram."}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {status === "succeeded" && (
              <TemplateFlowView tables={tables} refs={refs} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
