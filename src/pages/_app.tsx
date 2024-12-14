import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
          {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
          {children}
    </QueryClientProvider>
  )
};


export default function App({ Component, pageProps }: AppProps) {
  return (
     <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}
