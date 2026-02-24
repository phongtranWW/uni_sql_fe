import type { CODE_FORMATS } from "@/constants/code-formats";

export type CodeFormat = (typeof CODE_FORMATS)[keyof typeof CODE_FORMATS];
