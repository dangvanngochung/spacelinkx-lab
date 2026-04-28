export type Msg = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type Thread = {
  id: string;
  title: string;
  createdAt: number;
  messages: Msg[];
};