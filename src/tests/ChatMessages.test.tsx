import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatMessages from "../components/ChatMessages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";

describe("ChatMessages Component", () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    vi.resetAllMocks();

    vi.spyOn(supabase, "from").mockReturnValue({
      select: () => ({
        eq: () => ({
          order: () =>
            Promise.resolve({
              data: [
                {
                  id: 1,
                  content: "hello world",
                  user_id: "123",
                  email: "test@email.com",
                  created_at: new Date("2025-01-01").toISOString(),
                  room_id: 1,
                },
              ],
              error: null,
            }),
        }),
      }),
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders fetched messages correctly", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ChatMessages />
      </QueryClientProvider>
    );

    expect(screen.getByText("Loading messages...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("hello world")).toBeInTheDocument();
      expect(screen.getByText("test@email.com")).toBeInTheDocument();
    });
  });
});
